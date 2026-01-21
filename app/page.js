"use client";
import { useState, useEffect } from "react";
import InvoiceGenerator from "./components/InvoiceGenerator";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // This pulls from your .env.local file
  const SYSTEM_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === SYSTEM_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
      // Optional: Save session so they don't have to re-login immediately
      sessionStorage.setItem("isAllowed", "true");
    } else {
      setError(true);
      setPassword("");
    }
  };

  // Check if already authenticated in this session
  useEffect(() => {
    if (sessionStorage.getItem("isAllowed") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <InvoiceGenerator />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Icon Header */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${error ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
              {error ? <AlertCircle size={32} /> : <Lock size={32} />}
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Private Terminal</h1>
            <p className="text-slate-500 text-sm mb-8">
              Please enter the system password to access the AfterRender Invoice Generator.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system password"
                  className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all font-medium ${error
                      ? 'border-red-200 bg-red-50/30 focus:border-red-400'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
                    }`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <ShieldCheck size={20} />
                Authenticate
              </button>
            </form>

            {error && (
              <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest">
                Access Denied: Incorrect Password
              </p>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
          Secure Encryption Enabled • 2026 AfterRender Studio
        </p>
      </div>
    </div>
  );
}