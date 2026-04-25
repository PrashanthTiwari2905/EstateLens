"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              🏠
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">RealEstateAI</span>
          </Link>

          {/* DESKTOP MENU - GUEST */}
          {!session ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900 px-4">Login</Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* DESKTOP MENU - LOGGED IN */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  🔍 <span className="hidden lg:inline">Predict</span>
                </Link>
                <Link 
                  href="/dashboard?tab=history" 
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-all ${isActive('/history') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  📋 <span className="hidden lg:inline">History</span>
                </Link>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 border-2 border-white shadow-md flex items-center justify-center text-blue-700 font-bold hover:scale-105 transition-all uppercase"
                >
                  {session.user?.name?.[0] || 'U'}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-sm font-black text-slate-900">{session.user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="p-1 mt-1">
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3"
                      >
                         🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-50 bg-white p-4 space-y-4 shadow-xl">
          {!session ? (
            <>
              <a href="#features" className="block px-4 py-2 text-slate-600 font-bold">Features</a>
              <a href="#how-it-works" className="block px-4 py-2 text-slate-600 font-bold">How it Works</a>
              <Link href="/login" className="block px-4 py-2 text-slate-600 font-bold">Login</Link>
              <Link href="/register" className="block px-4 py-4 bg-blue-600 text-white font-bold rounded-xl text-center shadow-lg">Get Started</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="block px-4 py-2 text-slate-600 font-bold">🔍 Predict Price</Link>
              <Link href="/history" className="block px-4 py-2 text-slate-600 font-bold">📋 View History</Link>
              <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-red-500 font-bold border-t border-slate-50 pt-4">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
