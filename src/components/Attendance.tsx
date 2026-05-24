import React, { useState } from "react";
import { Student, AttendanceRecord } from "../types";
import { 
  CalendarCheck2, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  User, 
  CheckCircle2,
  Filter,
  Users,
  Activity,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";

interface AttendanceProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onToggleStatus: (studentId: string, status: "Present" | "Absent" | "Excused" | "Late") => void;
  onBulkMark: (status: "Present" | "Absent") => void;
}

export default function Attendance({ 
  students, 
  attendanceRecords, 
  onToggleStatus, 
  onBulkMark 
}: AttendanceProps) {
  const [dateFilter, setDateFilter] = useState("2026-05-24");
  const [programFilter, setProgramFilter] = useState("All");
  const [searchWord, setSearchWord] = useState("");

  const programs = [
    "Bachelor of Theology",
    "BS in Information Technology",
    "BA in Business Administration",
    "BA in Education",
    "BA in English"
  ];

  // Calculations for KPI cards
  const totalEnrolled = students.length;
  const criticalList = students.filter(st => st.attendanceRate < 85);
  const avgAttendance = (students.reduce((sum, st) => sum + st.attendanceRate, 0) / (totalEnrolled || 1)).toFixed(1);

  // Filter students for attendance roster check
  const filteredRoster = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchWord.toLowerCase()) || st.id.toLowerCase().includes(searchWord.toLowerCase());
    const matchesProgram = programFilter === "All" || st.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  return (
    <div className="space-y-6" id="attendance-module">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-brand-blue-500" />
            MUAS Daily Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Log physical seminar presence indicators, generate advisor notification warnings, and supervise attendance quotients.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            onClick={() => onBulkMark("Present")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-2 text-xs font-semibold hover:bg-emerald-100 transition active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark All Present
          </button>
          <button 
            onClick={() => onBulkMark("Absent")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-semibold hover:bg-slate-200 transition active:scale-95 cursor-pointer"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* KPI highlight row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-brand-blue-50 p-3 text-brand-blue-500">
            <Users className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Tracked learners</span>
            <p className="font-display text-lg font-bold text-slate-800">{students.length} Registered</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-500">
            <Activity className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Average Attendance Ratio</span>
            <p className="font-display text-lg font-bold text-emerald-600">{avgAttendance}% Standard</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-rose-50 p-3 text-rose-500">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Below Goal (&lt;85%)</span>
            <p className="font-display text-lg font-bold text-rose-500">{criticalList.length} Students At Risk</p>
          </div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roster by student name or record index..."
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
            className="w-full rounded-xl border border-slate-200 outline-none bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-700 transition focus:border-brand-blue-500 focus:bg-white"
          />
        </div>

        {/* Date / Program selects */}
        <div className="flex gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/40 px-2.5 py-1">
            <span className="text-xs text-slate-400 font-bold">Class Date:</span>
            <input 
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer py-1"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/40 px-2.5 py-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select 
              value={programFilter}
              onChange={e => setProgramFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer py-1"
            >
              <option value="All">All Pipelines</option>
              {programs.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main interactive tracking grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Quick status trigger checklist */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-50/60 border-b border-slate-100 py-3.5 px-6 font-bold text-xs tracking-wider text-slate-400 uppercase">
            Active Seminary Rollcall Board
          </div>
          <div className="overflow-x-auto text-xs text-slate-700">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5 px-6">ID & Student Name</th>
                  <th className="py-2.5 px-6">Pipeline Code</th>
                  <th className="py-2.5 px-6">Avg Ratio</th>
                  <th className="py-2.5 px-6 text-right">Attendance Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRoster.length > 0 ? (
                  filteredRoster.map(st => {
                    const record = attendanceRecords.find(r => r.studentId === st.id);
                    const status = record?.status || "Present";

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/40">
                        <td className="py-3.5 px-6">
                          <p className="font-bold text-slate-800">{st.name}</p>
                          <p className="font-mono text-[9px] text-slate-400">{st.id}</p>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-slate-500">
                          {st.program.split(" ").slice(-1)[0]}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`font-semibold ${st.attendanceRate < 85 ? "text-rose-500 font-bold" : "text-slate-700"}`}>
                            {st.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 text-[10px] font-bold">
                            <button 
                              onClick={() => onToggleStatus(st.id, "Present")}
                              className={`px-2 py-1 rounded-md border text-center transition cursor-pointer ${
                                status === "Present" 
                                  ? "bg-emerald-500 text-white border-emerald-500" 
                                  : "bg-white border-slate-150 hover:bg-slate-50 text-slate-500"
                              }`}
                            >
                              Present
                            </button>
                            <button 
                              onClick={() => onToggleStatus(st.id, "Absent")}
                              className={`px-2 py-1 rounded-md border text-center transition cursor-pointer ${
                                status === "Absent" 
                                  ? "bg-rose-500 text-white border-rose-500" 
                                  : "bg-white border-slate-150 hover:bg-slate-50 text-slate-500"
                              }`}
                            >
                              Absent
                            </button>
                            <button 
                              onClick={() => onToggleStatus(st.id, "Late")}
                              className={`px-2 py-1 rounded-md border text-center transition cursor-pointer ${
                                status === "Late" 
                                  ? "bg-amber-500 text-white border-amber-500" 
                                  : "bg-white border-slate-150 hover:bg-slate-50 text-slate-500"
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 px-6 text-center text-slate-400">
                      No matching student roster profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Advising List Warnings (&lt;85%) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-1 mb-2">
            <h2 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
              Academic Advisor Warning List
            </h2>
            <span className="text-[10px] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full text-rose-500 font-bold">
              Critical Dues
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Students whose attendance fall below **85%** are flagged below. They require direct registrar warning notices or spiritual counseling alignment under Seminary rules.
          </p>

          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {criticalList.length > 0 ? (
              criticalList.map(st => (
                <div key={st.id} className="p-3 border border-slate-100 hover:border-slate-150 bg-slate-50/30 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{st.name}</h4>
                      <p className="text-[10px] text-slate-400">{st.id} • {st.program}</p>
                    </div>
                    <span className="text-xs font-extrabold text-rose-500">{st.attendanceRate}% Rate</span>
                  </div>
                  <div className="text-[10px] flex justify-between text-slate-500">
                    <span>Contact: {st.phone}</span>
                    <button 
                      onClick={() => alert(`Warning notice generated and queued for ${st.name} (${st.email}).`)}
                      className="text-brand-blue-500 hover:text-brand-blue-600 font-bold hover:underline"
                    >
                      Email Advisor Warning Card
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                <p className="font-bold text-slate-500">Seminary Roster Clear</p>
                <p className="text-[10px] text-slate-400 mt-0.5">All student attendance quotients currently exceed the 85% safety threshhold.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
