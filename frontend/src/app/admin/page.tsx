"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Activity, Users, AlertTriangle } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import api from "@/lib/api";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

interface Metrics {
  totalLogins: number;
  failedLogins: number;
  blockedAttacks: number;
  successfulLogins: number;
}

interface LoginLog {
  _id: string;
  username: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  attempts: number;
  location: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics>({ totalLogins: 0, failedLogins: 0, blockedAttacks: 0, successfulLogins: 0 });
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, logsRes] = await Promise.all([
          api.get("/admin/metrics"),
          api.get("/admin/logs")
        ]);
        setMetrics(metricsRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  };

  // Mock chart data based on metrics for demonstration
  const loginTrendsData = {
    labels: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'],
    datasets: [
      {
        label: 'Logins',
        data: [12, 19, 15, 25, 22, 30, Math.max(10, metrics.totalLogins)],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const attackData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Blocked Attacks',
        data: [2, 5, 3, 15, 1, 0, metrics.blockedAttacks],
        backgroundColor: '#ef4444',
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Monitoring Dashboard</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time threat detection and access logs</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full animate-pulse tracking-wide">
          <Activity size={14} /> LIVE
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.0 }} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Total Logins</p>
                  <h3 className="text-3xl font-bold text-white">{metrics.totalLogins}</h3>
                </div>
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={20} /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Failed Logins</p>
                  <h3 className="text-3xl font-bold text-yellow-500">{metrics.failedLogins}</h3>
                </div>
                <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg"><AlertTriangle size={20} /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Blocked Attacks</p>
                  <h3 className="text-3xl font-bold text-red-500">{metrics.blockedAttacks}</h3>
                </div>
                <div className="p-2 bg-red-500/20 text-red-500 rounded-lg"><ShieldAlert size={20} /></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-1">Successful</p>
                  <h3 className="text-3xl font-bold text-green-500">{metrics.successfulLogins}</h3>
                </div>
                <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><ShieldCheck size={20} /></div>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 rounded-xl p-6 h-[300px]">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">LOGIN TRENDS</h3>
              <div className="h-[220px] w-full">
                <Line data={loginTrendsData} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-xl p-6 h-[300px]">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">ATTACK DETECTION</h3>
              <div className="h-[220px] w-full">
                <Bar data={attackData} options={chartOptions} />
              </div>
            </motion.div>
          </div>

          {/* Logs Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Security Logs</h3>
              <button className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-1.5 transition-colors text-slate-300">Export CSV</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 bg-black/20 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Username</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">IP Address</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Location</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Attempts</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.length > 0 ? logs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {log.username}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {log.location || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {log.attempts}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                          ${log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                          ${log.status === 'FAILED' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : ''}
                          ${log.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500 border border-red-500/20 scale-105 inline-block animate-pulse' : ''}
                        `}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No security logs available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
