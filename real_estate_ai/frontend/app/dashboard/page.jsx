"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("predict"); // 'predict' or 'history'
  const [formData, setFormData] = useState({
    crime_rate: 3.6,
    avg_rooms: 6.2,
    sqft: 1500,
    house_age: 68.0,
    distance_to_work: 3.8,
    tax_rate: 408.0,
    school_ratio: 18.5,
    low_income_percent: 12.6,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load History
  useEffect(() => {
    if (activeTab === "history" && session) {
      fetchHistory();
    }
  }, [activeTab, session]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get("/api/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

    const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null); // Clear old results
    try {
      const res = await axios.post("/api/predict", formData);
      setPrediction(res.data);
    } catch (err) {
      console.error("Dashboard Predict Error:", err);
      const msg = err.response?.data?.error || err.message || "Unknown error";
      const details = err.response?.data?.details || "";
      alert(`⚠️ Prediction Failed\n\n${msg}\n${details}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return;
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory(history.filter(item => item._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col fixed md:h-full z-20 bottom-0 md:bottom-auto">
        <div className="p-6 border-b border-slate-50 hidden md:flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-black text-slate-900 tracking-tight">RealEstateAI</span>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col items-center md:items-stretch justify-around md:justify-start gap-2">
          <button 
            onClick={() => setActiveTab("predict")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'predict' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-xl">🔍</span>
            <span className="hidden md:inline">Predict</span>
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="text-xl">📋</span>
            <span className="hidden md:inline">History</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 hidden md:block">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">{session.user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{session.user.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-4 md:p-12 pb-32 md:pb-12">
        
        {activeTab === "predict" ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Get Price Prediction</h1>
              <p className="text-slate-500 font-medium">Adjust the features below to estimate the property value.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Form Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handlePredict} className="space-y-8">
                  {Object.keys(formData).map((key) => {
                    const config = {
                      sqft: { min: 400, max: 8000, step: 10, label: "Square Feet" },
                      crime_rate: { min: 0.0, max: 90.0, step: 0.1, label: "Crime Rate" },
                      avg_rooms: { min: 3.0, max: 9.0, step: 0.1, label: "Avg Rooms" },
                      house_age: { min: 0, max: 100, step: 1, label: "House Age" },
                      distance_to_work: { min: 1.0, max: 12.0, step: 0.1, label: "Dist to Work" },
                      tax_rate: { min: 100, max: 700, step: 10, label: "Tax Rate" },
                      school_ratio: { min: 12.0, max: 22.0, step: 0.1, label: "School Ratio" },
                      low_income_percent: { min: 1.0, max: 38.0, step: 0.1, label: "Low Income %" },
                    }[key];

                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{config.label}</label>
                          <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{formData[key]}</span>
                        </div>
                        <input 
                          type="range"
                          min={config.min}
                          max={config.max}
                          step={config.step}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          value={formData[key]}
                          onChange={(e) => setFormData({...formData, [key]: parseFloat(e.target.value)})}
                        />
                      </div>
                    );
                  })}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>🔍 Predict Market Price</>
                    )}
                  </button>
                </form>
              </div>

              {/* Prediction Display */}
              <div className="space-y-6">
                {prediction ? (
                  <div className="animate-in zoom-in duration-300">
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 border border-blue-500">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Estimated Property Price</p>
                            <h2 className="text-5xl font-black tracking-tighter">
                              {prediction.predicted_price >= 10000000 
                                ? `₹${(prediction.predicted_price / 10000000).toFixed(2)} Crores` 
                                : `₹${(prediction.predicted_price / 100000).toFixed(2)} Lakhs`}
                            </h2>
                          </div>
                          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                            <span className="text-2xl">💰</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-white/10">
                          <div>
                            <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">Based on Area</p>
                            <p className="text-xl font-bold">{formData.sqft} sq ft</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-[10px] font-bold uppercase mb-1">Price per Sq Ft</p>
                            <p className="text-xl font-bold">₹{Math.round(prediction.predicted_price / formData.sqft).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Low Estimate</p>
                          <p className="text-xl font-bold text-slate-700">
                            {prediction.confidence_low >= 10000000 
                              ? `₹${(prediction.confidence_low / 10000000).toFixed(2)} Cr` 
                              : `₹${(prediction.confidence_low / 100000).toFixed(2)} L`}
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">High Estimate</p>
                          <p className="text-xl font-bold text-slate-700">
                            {prediction.confidence_high >= 10000000 
                              ? `₹${(prediction.confidence_high / 10000000).toFixed(2)} Cr` 
                              : `₹${(prediction.confidence_high / 100000).toFixed(2)} L`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-3xl p-8 text-white">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        🧠 Why This Price?
                      </h4>
                      <div className="space-y-3 mb-8">
                        {prediction.top_factors.map((factor, idx) => (
                          <div key={idx} className={`px-4 py-3 rounded-xl border flex items-center gap-3 text-xs font-bold ${factor.includes('✅') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {factor}
                          </div>
                        ))}
                      </div>

                      {/* Chart Area */}
                      <div className="h-64 w-full mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={Object.entries(formData).map(([name, value]) => ({ name: name.replace('_',' '), value }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={8} tick={{fill: '#94a3b8'}} />
                            <YAxis stroke="#64748b" fontSize={8} tick={{fill: '#94a3b8'}} />
                            <Tooltip 
                              cursor={{fill: '#ffffff05'}}
                              contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px'}}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {Object.keys(formData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-slate-200 rounded-[3rem]">
                    <div className="text-6xl mb-6 opacity-20">📈</div>
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Ready for Analysis</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-[200px]">Adjust some values and hit predict to see magic.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">History</h1>
                <p className="text-slate-500 font-medium">Your past property valuations.</p>
              </div>
              <button 
                onClick={fetchHistory}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                🔄 Refresh
              </button>
            </header>

            {historyLoading ? (
              <div className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-20 bg-slate-200/50 animate-pulse rounded-2xl w-full"></div>
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Top Factor</th>
                      <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((record) => (
                      <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-medium text-slate-500">
                          {new Date(record.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-lg font-black text-slate-900">
                            {record.predicted_price >= 10000000 
                              ? `₹${(record.predicted_price / 10000000).toFixed(2)} Cr` 
                              : `₹${(record.predicted_price / 100000).toFixed(2)} L`}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${record.top_factors?.[0]?.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {record.top_factors?.[0]?.split(') ')[1] || 'Neutral'}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => deleteRecord(record._id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="text-7xl mb-8">🗄️</div>
                <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest mb-4">No records found</h3>
                <button 
                  onClick={() => setActiveTab("predict")}
                  className="bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all"
                >
                   + Start New Prediction
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
