import React from "react";
import { Student, FeeTransaction, StudentStatus, FeeStatus } from "../types";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  GraduationCap, 
  TrendingUp, 
  CalendarCheck2,
  BookOpen,
  Award,
  Wallet,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  students: Student[];
  transactions: FeeTransaction[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ students, transactions, onNavigate }: DashboardProps) {
  // Stat calculations
  const totalStudents = students.length;
  const newRegistrations = students.filter(s => {
    // Let's assume registration within some recent timeframe or Year 1
    return s.year === 1;
  }).length;

  const totalFeesExpected = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalFeesPaid = students.reduce((sum, s) => sum + s.paidFees, 0);
  const pendingFees = totalFeesExpected - totalFeesPaid;

  const validGpas = students.filter(s => s.gpa > 0);
  const avgGpa = validGpas.length > 0
    ? (validGpas.reduce((sum, s) => sum + s.gpa, 0) / validGpas.length).toFixed(2)
    : "0.00";

  const totalAttendance = students.reduce((sum, s) => sum + s.attendanceRate, 0);
  const avgAttendance = (totalAttendance / totalStudents).toFixed(1);

  // Distribution by program
  const programCounts: Record<string, number> = {};
  students.forEach(s => {
    programCounts[s.program] = (programCounts[s.program] || 0) + 1;
  });

  const programs = Object.keys(programCounts).map(program => ({
    name: program,
    count: programCounts[program],
    percentage: ((programCounts[program] / totalStudents) * 100).toFixed(0),
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8" id="dashboard-module">
      {/* Academy Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue-700 via-brand-blue-600 to-brand-blue-800 p-6 md:p-8 text-white shadow-xl"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-gold-400 opacity-10 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-brand-blue-500 opacity-20 blur-2xl"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-500/25 px-3 py-1 text-xs font-semibold text-brand-gold-400 border border-brand-gold-500/30">
            <Award className="h-3.5 w-3.5" />
            Adventist Christian Education Since 1938
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
            Myanmar Union Adventist Seminary
          </h1>
          <p className="text-brand-blue-100 text-sm md:text-base leading-relaxed antialiased">
            Welcome back to the Registrar's Admin Console. Managing academic excellence, spiritual development, and administrative accountability in one unified system.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate("registration")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold-500 px-4 py-2 text-xs md:text-sm font-semibold text-brand-blue-950 transition hover:bg-brand-gold-400 shadow-lg shadow-brand-gold-500/20 active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              Register New Student
            </button>
            <button 
              onClick={() => onNavigate("students")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/20 px-4 py-2 text-xs md:text-sm font-semibold text-white transition backdrop-blur border border-white/10 active:scale-95"
            >
              <Users className="h-4 w-4" />
              View Student Database
            </button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Enrolled</span>
            <div className="rounded-xl bg-brand-blue-50 p-2.5 text-brand-blue-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{totalStudents}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +12%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Active seminar learners</p>
        </motion.div>

        {/* Freshman / New Registrations */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">First-Year Students</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-brand-gold-600">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{newRegistrations}</span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +5%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">First semester freshmen</p>
        </motion.div>

        {/* Outstanding Fees Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Pending Fees</span>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-500">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-xl md:text-2xl font-bold text-slate-900">
              {pendingFees.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">MMK</span>
            </span>
            {pendingFees > 0 ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                <TrendingDown className="h-3 w-3" />
                Unpaid
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                Clear
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">Fee clearance pending audit</p>
        </motion.div>

        {/* Average GPA */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Average GPA</span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{avgGpa}</span>
            <span className="text-xs font-semibold text-emerald-500">/ 4.00</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Overall academic standard</p>
        </motion.div>
      </div>

      {/* Central Visual Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Programs Enrolment Share */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-brand-blue-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Academic Segments</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">Student distribution across educational and theological pipelines at MUAS.</p>
            
            <div className="space-y-4">
              {programs.map((prog, index) => (
                <div key={prog.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="truncate max-w-[180px]">{prog.name}</span>
                    <span className="text-slate-500">{prog.count} Students ({prog.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        index === 0 ? "bg-brand-blue-500" :
                        index === 1 ? "bg-brand-gold-500" :
                        index === 2 ? "bg-purple-500" : "bg-teal-500"
                      }`}
                      style={{ width: `${prog.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-400">Total departments listed: {programs.length}</div>
            <button 
              onClick={() => onNavigate("reports")}
              className="text-xs font-semibold text-brand-blue-500 hover:text-brand-blue-600 inline-flex items-center gap-1 active:scale-95 transition"
            >
              Analyze Report <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Finance Quick Metrics */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-emerald-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Seminary Fee Collections</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-sans">Summary of overall semester fee receipts and student payment behavior.</p>
            
            <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-100/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Received In Total</span>
                <p className="font-display text-lg font-bold text-slate-800">{totalFeesPaid.toLocaleString()} MMK</p>
              </div>
              <div className="h-10 w-[1px] bg-slate-200"></div>
              <div className="text-right">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Collection Rate</span>
                <p className="font-display text-lg font-bold text-emerald-600">
                  {((totalFeesPaid / (totalFeesExpected || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-teal-500/5 border border-teal-500/10 text-teal-700">
                <span className="font-medium">Fully Paid Students</span>
                <span className="font-bold">{students.filter(s => s.feeStatus === FeeStatus.FULLY_PAID).length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-700">
                <span className="font-medium">Partially Paid Students</span>
                <span className="font-bold">{students.filter(s => s.feeStatus === FeeStatus.PARTIALLY_PAID).length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-700">
                <span className="font-medium">No Tuition Paid Yet</span>
                <span className="font-bold">{students.filter(s => s.feeStatus === FeeStatus.UNPAID).length}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-400">Target Semester: Regular 2026</div>
            <button 
              onClick={() => onNavigate("finance")}
              className="text-xs font-semibold text-brand-blue-500 hover:text-brand-blue-600 inline-flex items-center gap-1 active:scale-95 transition"
            >
              Verify Transactions <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Recent Transactions & Office Indicators */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck2 className="h-5 w-5 text-brand-gold-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">Recent Accounting Logs</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">Daily collections & ledger entries verified by registrar office.</p>

            <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
              {transactions.slice(0, 4).map(txn => (
                <div key={txn.id} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{txn.studentName}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span>{txn.id}</span>
                      <span>•</span>
                      <span>{txn.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">+{txn.amount.toLocaleString()} MMK</p>
                    <span className={`inline-flex items-center text-[9px] font-semibold ${
                      txn.status === "Completed" ? "text-emerald-500" :
                      txn.status === "Pending" ? "text-yellow-500" : "text-rose-500"
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Overall Campus Safety Rate</span>
            <span className="font-bold text-brand-blue-500">{avgAttendance}% Attend.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
