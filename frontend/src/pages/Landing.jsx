import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightIcon, 
  ChartBarIcon, 
  CpuChipIcon, 
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Model Accuracy', value: '95%' },
    { label: 'Predictions Made', value: '10,000+' },
    { label: 'Key Features', value: '7' },
    { label: 'Cost', value: '100% Free' },
  ];

  const features = [
    {
      title: 'Instant AI Predictions',
      description: 'Receive accurate real estate valuations in milliseconds powered by our Random Forest engine.',
      icon: <CpuChipIcon className="w-8 h-8 text-blue-600" />,
    },
    {
      title: 'Explainable Results',
      description: 'Understand the "why" behind every price. We use SHAP values to reveal factor impacts.',
      icon: <ChartBarIcon className="w-8 h-8 text-blue-600" />,
    },
    {
      title: 'Prediction History',
      description: 'Track your valuations over time with a secure history dashboard tied to your account.',
      icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
    },
  ];

  return (
    <div className="bg-white scroll-smooth">
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl">🏠</span>
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white md:text-gray-900'}`}>
                EstateLens
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <div className="flex items-center gap-4 ml-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-sm font-semibold border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-8 h-8 text-gray-900" />
                ) : (
                  <Bars3Icon className={`w-8 h-8 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b absolute top-full w-full py-4 px-4 flex flex-col gap-4 shadow-xl">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-600">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-gray-600">How it Works</a>
            <button onClick={() => navigate('/login')} className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg">Login</button>
            <button onClick={() => navigate('/register')} className="w-full py-2 bg-blue-600 text-white rounded-lg">Get Started</button>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse duration-3000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
            🤖 AI-Powered • Free to Use
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Know Your Home's<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">True Value</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Stop relying on guesswork. ML-powered predictions with full transparency on every estimate. Understand exactly what drives your local market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              🚀 Get Started Free <ArrowRightIcon className="w-5 h-5" />
            </button>
            <a 
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 border border-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/10 transition-all text-center"
            >
              See How It Works ↓
            </a>
          </div>

          <div className="mt-16 flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-4 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-1.5"><CheckBadgeIcon className="w-5 h-5 text-blue-500" /> 95% Accuracy</div>
            <div className="flex items-center gap-1.5"><CheckBadgeIcon className="w-5 h-5 text-blue-500" /> 10K+ Predictions</div>
            <div className="flex items-center gap-1.5"><CheckBadgeIcon className="w-5 h-5 text-blue-500" /> SHAP Explained</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section id="features" className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Everything You Need</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, id) => (
              <div key={id} className="p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="mb-6 inline-block p-4 rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-colors">
                  {React.cloneElement(feature.icon, { className: "w-8 h-8 text-blue-600 group-hover:text-white" })}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-32 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">How It Works</h2>
            <p className="text-slate-600 text-lg">Simple steps to professional-grade valuation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/4 left-[20%] right-[20%] h-0.5 bg-slate-200 border-dashed border-t-2" />
            
            {[
              { step: '1', title: 'Enter Details', desc: 'Provide 7 key features of the property including rooms, location, and age.' },
              { step: '2', title: 'AI Analysis', desc: 'Our engine processes market data against 500+ records in real-time.' },
              { step: '3', title: 'Get Insight', desc: 'Receive a predicted price along with the top 3 factors driving that estimate.' }
            ].map((s, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-8 z-10 shadow-lg shadow-blue-600/30">
                  {s.step}
                </div>
                <h5 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h5>
                <p className="text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-black mb-2">{s.value}</div>
                <div className="text-blue-100 text-sm font-medium uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to get started?</h2>
          <p className="text-slate-400 text-lg mb-12 relative z-10">Join the next generation of data-driven real estate agents and investors.</p>
          <button 
            onClick={() => navigate('/register')}
            className="group px-10 py-5 bg-blue-600 text-white text-xl font-bold rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 mx-auto relative z-10"
          >
            Create Free Account <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-900">EstateLens</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 EstateLens AI. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
