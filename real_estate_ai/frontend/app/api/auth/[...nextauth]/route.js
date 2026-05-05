import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB, User } from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
  
          // 1. Find user in MongoDB
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.error("Auth Error: No user found with email", credentials.email);
            throw new Error("No user found with this email.");
          }
  
          // 2. Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.error("Auth Error: Invalid password for", credentials.email);
            throw new Error("Invalid password. Please try again.");
          }
  
          // 3. Return user object to NextAuth
          return {
            id: user._id.toString(),
            name: user.full_name,
            email: user.email,
          };
        } catch (error) {
          console.error("CRITICAL AUTH ERROR:", error.message);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Pass user ID and email to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session dashboard
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
