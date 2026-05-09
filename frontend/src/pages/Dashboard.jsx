import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { 
  MagnifyingGlassIcon, 
  ListBulletIcon, 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('predict');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Form State for 7 Features
  const [formData, setFormData] = useState({
    crim: 0.1,
    rm: 6.5,
    sqft: 1500,
    age: 40.0,
    dis: 5.0,
    tax: 300.0,
    ptratio: 18.0,
    lstat: 10.0
  });

  const featureLabels = [
    { id: 'sqft', label: 'Square Feet', min: 400, max: 8000, step: 10, desc: 'Property area in sq ft (Key feature)' },
    { id: 'rm', label: 'Avg Rooms', min: 1.0, max: 10.0, step: 0.1, desc: 'Average number of rooms per dwelling' },
    { id: 'crim', label: 'Crime Rate', min: 0.0, max: 100.0, step: 0.1, desc: 'Per capita crime rate by town' },
    { id: 'age', label: 'House Age', min: 1.0, max: 100.0, step: 1.0, desc: 'Proportion of built before 1940' },
    { id: 'dis', label: 'Distance to Work', min: 1.0, max: 30.0, step: 0.1, desc: 'Weighted distances to employment centers' },
    { id: 'tax', label: 'Tax Rate', min: 100.0, max: 1000.0, step: 1.0, desc: 'Full-value property-tax rate' },
    { id: 'ptratio', label: 'School Ratio', min: 10.0, max: 30.0, step: 0.1, desc: 'Pupil-teacher ratio by town' },
    { id: 'lstat', label: 'Low Income %', min: 1.0, max: 50.0, step: 0.1, desc: '% lower status of the population' },
  ];

  const formatPriceINR = (value) => {
    // Assuming value is in $1000s, convert to INR Lakhs
    // 1 unit ($1000) approx ₹3.5 Lakhs to match user's example (1500sqft -> 75L)
    const inrLakhs = value * 3.5;
    if (inrLakhs >= 100) {
      return `₹${(inrLakhs / 100).toFixed(2)} Crores`;
    }
    return `₹${inrLakhs.toFixed(2)} Lakhs`;
  };

  const getRawINR = (value) => value * 350000; // Raw INR value for calculations

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getPredictionHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const result = await api.predictPrice(formData);
      setPrediction(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-black text-slate-900 tracking-tight">EstateLens</span>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <NavItem 
            icon={<MagnifyingGlassIcon className="w-5 h-5" />} 
            label="Predict" 
            active={activeTab === 'predict'} 
            onClick={() => setActiveTab('predict')} 
          />
          <NavItem 
            icon={<ListBulletIcon className="w-5 h-5" />} 
            label="History" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <NavItem 
            icon={<UserCircleIcon className="w-5 h-5" />} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </nav>

        <div className="p-6 bg-slate-50 mt-auto border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all text-sm font-semibold"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-10">
        {/* TOP HEADER */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {activeTab === 'predict' && 'Price Prediction Engine'}
              {activeTab === 'history' && 'Prediction History'}
              {activeTab === 'profile' && 'User Profile'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'predict' && 'Configure property features to estimate market value.'}
              {activeTab === 'history' && 'Archive of your previous AI valuations.'}
            </p>
          </div>
          <div className="text-sm font-medium text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* TAB CONTENT: PREDICT */}
        {activeTab === 'predict' && (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form Side */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <form onSubmit={handlePredict} className="space-y-8">
                <div className="grid sm:grid-cols-1 gap-8">
                  {featureLabels.map((f) => (
                    <div key={f.id} className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <label className="font-bold text-slate-800">{f.label}</label>
                        <span className="bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full font-bold">{formData[f.id]}</span>
                      </div>
                      <input 
                        type="range" 
                        min={f.min} 
                        max={f.max} 
                        step={f.step} 
                        value={formData[f.id]} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:accent-blue-700"
                        onChange={(e) => setFormData({ ...formData, [f.id]: parseFloat(e.target.value) })}
                      />
                      <p className="text-[10px] text-slate-400 ml-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (
                    <>Run AI Prediction <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Results Side */}
            <div className="space-y-8">
              {prediction ? (
                <>
                  <div className="grid sm:grid-cols-1 gap-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 border border-blue-500">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-blue-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Estimated Property Price</p>
                          <h2 className="text-5xl font-black tracking-tighter">
                            {formatPriceINR(prediction.predicted_price)}
                          </h2>
                        </div>
                        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                          <CurrencyDollarIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-white/10">
                        <div>
                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">Based on Area</p>
                          <p className="text-xl font-bold">{formData.sqft} sq ft</p>
                        </div>
                        <div>
                          <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">Price per Sq Ft</p>
                          <p className="text-xl font-bold">₹{Math.round(getRawINR(prediction.predicted_price) / formData.sqft).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <ResultCard 
                        icon={<ScaleIcon className="w-5 h-5" />} 
                        label="Lower Bound" 
                        value={formatPriceINR(prediction.confidence_range[0])}
                        color="white"
                      />
                      <ResultCard 
                        icon={<ScaleIcon className="w-5 h-5" />} 
                        label="Upper Bound" 
                        value={formatPriceINR(prediction.confidence_range[1])}
                        color="white"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                       <ChartBarIcon className="w-5 h-5 text-blue-600" /> Key Prediction Drivers
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      {prediction.top_factors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <CheckIcon className={`w-5 h-5 ${factor.includes('increases') ? 'text-green-500' : 'text-red-400'}`} />
                          <span className="text-sm text-slate-700">{factor}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-64 mt-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prediction.top_factors.map((f, i) => ({ 
                          name: f.split(' ')[0], 
                          impact: f.includes('increases') ? (10 - i) : -(10 - i) 
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                            cursor={{ fill: 'transparent' }}
                          />
                          <Bar dataKey="impact" radius={[6, 6, 0, 0]}>
                            {prediction.top_factors.map((f, index) => (
                              <Cell key={index} fill={f.includes('increases') ? '#22c55e' : '#f87171'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center text-slate-400">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <MagnifyingGlassIcon className="w-10 h-10 opacity-20" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-500">No Prediction Yet</h4>
                  <p className="text-sm mt-2">Adjust the sliders and run the AI model to see real-time property valuation analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Past Valuations</h3>
            </div>
            
            {loading ? (
              <div className="p-20 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClockIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-slate-800 font-bold mb-2">No history found</h4>
                <p className="text-slate-500 text-sm mb-8">Start by running your first prediction.</p>
                <button 
                  onClick={() => setActiveTab('predict')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Try Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5">Top Impact Driver</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((h) => (
                      <tr key={h._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-slate-800">{new Date(h.timestamp).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {formatPriceINR(h.predicted_price)}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${h.top_factors[0].includes('increases') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {h.top_factors[0].split(' ')[0]}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600">View Detail →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className={active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}>
      {icon}
    </div>
    <span className="font-bold text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
  </button>
);

const ResultCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-3xl border shadow-sm ${
    color === 'blue' 
      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-500' 
      : 'bg-white border-slate-100 text-slate-900'
  }`}>
    <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center ${
      color === 'blue' ? 'bg-white/10' : 'bg-slate-100 text-slate-400'
    }`}>
      {icon}
    </div>
    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
      color === 'blue' ? 'text-blue-100' : 'text-slate-400'
    }`}>
      {label}
    </p>
    <h4 className="text-2xl font-black">{value}</h4>
  </div>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Dashboard;
