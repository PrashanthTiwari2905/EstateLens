"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-100">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-48 bg-[#0B1120] text-white">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 text-center z-10 relative">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 animate-pulse shadow-xl shadow-blue-900/20">
            <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
            <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-blue-300">
              🤖 AI-Powered Property Valuation
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            Know Your Home's <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              True Value
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
            Stop relying on guesswork. Our Advanced Random Forest model uses 7 core demographic and house factors to provide instant, SHAP-explained valuations with 95% accuracy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl shadow-blue-600/30 active:scale-95 transition-all text-lg"
            >
              🚀 Get Started Free
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold py-5 px-10 rounded-2xl backdrop-blur-sm active:scale-95 transition-all text-lg"
            >
              See Demo →
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 font-bold uppercase tracking-widest border-t border-white/5 pt-12">
            <div className="flex items-center gap-2">✓ 95% Accuracy</div>
            <div className="flex items-center gap-2">✓ Free Forever</div>
            <div className="flex items-center gap-2">✓ Instant Results</div>
          </div>

          {/* Floating Card Mockup Overlay */}
          <div className="mt-20 relative group max-w-4xl mx-auto hidden lg:block">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-3xl text-left overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">🔍</div>
                    <h3 className="font-bold text-slate-300">New Valuation Request</h3>
                  </div>
                  <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-500/30">Stable V1.0</div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
                  ))}
                </div>
                <div className="h-20 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-black text-blue-400">$342,450.00</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 uppercase tracking-widest text-blue-600 font-black text-sm">
            Everything You Need
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group border border-slate-100 rounded-3xl p-10 hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">🤖</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">AI Predictions</h3>
              <p className="text-slate-500 leading-relaxed">Get property estimates in milliseconds using our specialized Random Forest model trained on thousands of data points.</p>
            </div>
            {/* Feature 2 */}
            <div className="group border border-slate-100 rounded-3xl p-10 hover:shadow-2xl hover:shadow-purple-600/5 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors">🧠</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">SHAP Explained</h3>
              <p className="text-slate-500 leading-relaxed">No black boxes here. See exactly which demographic factors increased or decreased each valuation using SHAP intelligence.</p>
            </div>
            {/* Feature 3 */}
            <div className="group border border-slate-100 rounded-3xl p-10 hover:shadow-2xl hover:shadow-orange-600/5 hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-orange-600 group-hover:text-white transition-colors">📊</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Full History</h3>
              <p className="text-slate-500 leading-relaxed">Keep track of your valuations over time. Review past predictions and market changes directly in your secure dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Up and Running in 3 Steps</h2>
            <p className="text-slate-500">The fastest way to professional-grade property insights.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Step 1 */}
            <div className="relative group">
              <span className="absolute -top-16 -left-8 text-8xl md:text-[10rem] font-black text-blue-600/5 -z-10 group-hover:text-blue-600/10 transition-colors">1</span>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Create Free Account</h4>
              <p className="text-slate-500">Sign up instantly with just your email. No credit card or property address required to start.</p>
            </div>
            {/* Step 2 */}
            <div className="relative group">
              <span className="absolute -top-16 -left-8 text-8xl md:text-[10rem] font-black text-blue-600/5 -z-10 group-hover:text-blue-600/10 transition-colors">2</span>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Enter House Details</h4>
              <p className="text-slate-500">Input 7 key features including average rooms, crime rates, and proximity to major employment hubs.</p>
            </div>
            {/* Step 3 */}
            <div className="relative group">
              <span className="absolute -top-16 -left-8 text-8xl md:text-[10rem] font-black text-blue-600/5 -z-10 group-hover:text-blue-600/10 transition-colors">3</span>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">Get AI Prediction</h4>
              <p className="text-slate-500">Receive an instant valuation with a detailed breakdown of the positive and negative drivers of that price.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl md:text-6xl font-black mb-2">95%</div>
            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Accuracy</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black mb-2">10K+</div>
            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Predictions</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black mb-2">7</div>
            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Features</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-black mb-2">100%</div>
            <div className="text-sm font-bold text-blue-200 uppercase tracking-widest">Free</div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-[#0B1120] text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Start Predicting Today</h2>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-3 bg-white text-slate-900 font-bold py-6 px-12 rounded-3xl hover:bg-blue-50 active:scale-95 transition-all text-xl"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">RealEstateAI</span>
          </div>
          <div className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} RealEstateAI. Build with Next.js + FastAPI + Random Forest.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
