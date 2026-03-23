"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

interface Schedule {
  _id: string;
  day: string;
  task: string;
  time: string;
}

export default function EmployeeDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/employee/schedules");
        setSchedules(response.data);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Group schedules by day for UI presentation
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.day]) {
      acc[schedule.day] = [];
    }
    acc[schedule.day].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400">Here is your schedule and active tasks for the week.</p>
        </div>
        <div className="hidden md:flex bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full items-center gap-2 font-medium text-sm">
          <CheckCircle2 size={16} />
          Systems Normal
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-medium">Upcoming Tasks</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">{schedules.length}</span>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-medium">Hours Logged</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">32.5h</span>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <span className="text-slate-300 font-medium mb-2">Security Status</span>
            <div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                Secured
              </div>
              <p className="text-sm text-slate-400 mt-1">Last login: Today, 8:43 AM</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Schedule section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Weekly Schedule</h3>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : Object.keys(groupedSchedules).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedSchedules).map(([day, daySchedules], index) => (
              <div key={day} className="relative pl-8">
                {/* Timeline line */}
                {index !== Object.keys(groupedSchedules).length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-white/10"></div>
                )}
                
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>

                <h4 className="text-lg font-semibold text-white mb-4">{day}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {daySchedules.map((schedule, idx) => (
                    <div key={idx} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex flex-col items-center justify-center text-primary font-medium border border-white/5 text-sm">
                        {schedule.time.split(" ")[0]}
                        <span className="text-[10px] text-slate-400">{schedule.time.split(" ")[1] || "AM"}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{schedule.task}</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                          <Clock size={12} /> {schedule.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No schedules found for this week.
          </div>
        )}
      </motion.div>
    </div>
  );
}
