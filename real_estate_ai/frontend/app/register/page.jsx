"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "None", color: "bg-slate-200" });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Strength Meter Logic
  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength({ score: 0, label: "None", color: "bg-slate-200" });
      return;
    }

    let strength = 0;
    if (pass.length >= 6) strength += 33;
    if (pass.length >= 10 || (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass))) strength += 33;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 34;

    if (strength > 66) setPasswordStrength({ score: strength, label: "Strong", color: "bg-green-500" });
    else if (strength > 33) setPasswordStrength({ score: strength, label: "Medium", color: "bg-orange-500" });
    else setPasswordStrength({ score: strength, label: "Weak", color: "bg-red-500" });
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.email.includes("@") || !formData.email.includes(".")) newErrors.email = "Invalid email format";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match";
    if (!termsAccepted) newErrors.terms = "Please accept the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        // Success redirect
        router.push("/login?registered=true");
      }
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-900/5 p-8 border border-slate-100">
          
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 mb-8 transition-colors">
            ← Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium">Join 10,000+ users today</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 flex items-center gap-2">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
              <input 
                type="text"
                className={`w-full px-4 py-4 bg-slate-50 border ${errors.full_name ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900 font-medium`}
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
              {errors.full_name && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <input 
                type="email"
                className={`w-full px-4 py-4 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900 font-medium`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <input 
                type="password"
                className={`w-full px-4 py-4 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900 font-medium`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-3 px-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-400">Security Score</span>
                    <span className={`text-[9px] font-black uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-500`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Confirm Password</label>
              <input 
                type="password"
                className={`w-full px-4 py-4 bg-slate-50 border ${errors.confirm_password ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-slate-900 font-medium`}
                placeholder="••••••••"
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              />
              {errors.confirm_password && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.confirm_password}</p>}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed">
                I agree to the <span className="text-blue-600 font-bold">Terms of Service</span> and <span className="text-blue-600 font-bold">Privacy Policy</span>
              </label>
            </div>
            {errors.terms && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.terms}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Create Account →"}
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-black hover:underline">Sign in →</Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
