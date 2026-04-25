import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EstateLens AI - Professional Property Valuation",
  description: "Advanced AI house price prediction with SHAP explanations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
