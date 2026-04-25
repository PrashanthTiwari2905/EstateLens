import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'None', color: 'bg-slate-200' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password Strength Logic
  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength({ score: 0, label: 'None', color: 'bg-slate-200' });
      return;
    }

    let score = 0;
    if (pass.length >= 6) score += 33;
    if (pass.length > 10) score += 33;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 34;

    if (score > 66) setPasswordStrength({ score, label: 'Strong', color: 'bg-green-500' });
    else if (score > 33) setPasswordStrength({ score, label: 'Medium', color: 'bg-orange-500' });
    else setPasswordStrength({ score, label: 'Weak', color: 'bg-red-500' });
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email format";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!termsAccepted) newErrors.terms = "You must accept the terms";
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
    setLoading(true);

    const result = await register(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      alert("Account created successfully! Please sign in.");
      navigate('/login');
    } else {
      setErrors({ server: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm">Start predicting property values for free</p>
        </div>

        {/* Server Error */}
        {errors.server && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm">
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                className={`w-full bg-slate-50 border ${errors.fullName ? 'border-red-300' : 'border-slate-200'} text-slate-900 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            {errors.fullName && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <input
                type="email"
                className={`w-full bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} text-slate-900 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all`}
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div className="relative group mb-3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <input
                type="password"
                className={`w-full bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-200'} text-slate-900 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            {/* Strength Meter */}
            {formData.password && (
              <div className="px-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Security Strength</span>
                  <span className={`text-[10px] font-bold uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-500`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <input
                type="password"
                className={`w-full bg-slate-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'} text-slate-900 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed">
              I agree to the <a href="#" className="font-bold text-blue-600">Terms of Service</a> and <a href="#" className="font-bold text-blue-600">Privacy Policy</a>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-500 font-medium ml-1">{errors.terms}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign in here →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
