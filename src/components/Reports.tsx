import React from "react";
import { Student, StudentStatus, FeeStatus } from "../types";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  FileCheck, 
  Layers, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";

interface ReportsProps {
  students: Student[];
}

export default function Reports({ students }: ReportsProps) {
  const totalStudents = students.length;

  // 1. Program breakdown counts
  const programData: Record<string, { count: number; avgGpa: number; totalGpa: number }> = {
    "Bachelor of Theology": { count: 0, avgGpa: 0, totalGpa: 0 },
    "BS in Information Technology": { count: 0, avgGpa: 0, totalGpa: 0 },
    "BA in Business Administration": { count: 0, avgGpa: 0, totalGpa: 0 },
    "BA in Education": { count: 0, avgGpa: 0, totalGpa: 0 },
    "BA in English": { count: 0, avgGpa: 0, totalGpa: 0 },
  };

  students.forEach(st => {
    if (programData[st.program] !== undefined) {
      programData[st.program].count += 1;
      programData[st.program].totalGpa += st.gpa;
    }
  });

  Object.keys(programData).forEach(prog => {
    const data = programData[prog];
    data.avgGpa = data.count > 0 ? Number((data.totalGpa / data.count).toFixed(2)) : 0;
  });

  // 2. Gender ratio breakdown
  const maleCount = students.filter(s => s.gender === "Male").length;
  const femaleCount = students.filter(s => s.gender === "Female").length;
  const otherCount = students.filter(s => s.gender === "Other").length;

  const malePercent = totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0;
  const femalePercent = totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0;

  // 3. Billing Clearance Metrics
  const fullyPaidCount = students.filter(s => s.feeStatus === FeeStatus.FULLY_PAID).length;
  const partiallyPaidCount = students.filter(s => s.feeStatus === FeeStatus.PARTIALLY_PAID).length;
  const unpaidCount = students.filter(s => s.feeStatus === FeeStatus.UNPAID).length;

  const handleFakeExport = (type: string) => {
    alert(`Generating ${type} ledger export. Downward downloads will start shortly.`);
  };

  return (
    <div className="space-y-6" id="reports-module">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand-blue-500" />
            MUAS Analytics & Reports Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile aggregate academic ratings, review gender demographics, and export directory summaries.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            onClick={() => handleFakeExport("Admissions PDF")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3.5 py-2.5 text-xs font-semibold cursor-pointer active:scale-95 transition"
          >
            <Download className="h-4 w-4" />
            Export Audit PDF
          </button>
          <button 
            onClick={() => handleFakeExport("Accounting Ledger Excel")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 text-white px-3.5 py-2.5 text-xs font-semibold cursor-pointer active:scale-95 transition shadow-lg shadow-brand-blue-500/10"
          >
            <Layers className="h-4 w-4" />
            Download Excel Spreadsheet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dynamic GPA Indices Chart Layout */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-slate-900 text-base">Course Pipelines GPA Summary</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold border border-emerald-100/50 px-2 py-0.5 rounded-full uppercase">
                Active GPA Indices
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Aggregate student Cumulative Grade Point Averages compared across degree segments.</p>

            <div className="space-y-5">
              {Object.keys(programData).map((prog, index) => {
                const data = programData[prog];
                const gpaRatioPercent = (data.avgGpa / 4.0) * 100;

                return (
                  <div key={prog} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-700 font-semibold">
                      <span>{prog}</span>
                      <span className="font-bold text-slate-900">{data.avgGpa.toFixed(2)} GPA index <span className="text-[10px] text-slate-400 font-normal">({data.count} candidates)</span></span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          data.avgGpa >= 3.5 ? "bg-emerald-500" :
                          data.avgGpa >= 3.0 ? "bg-brand-blue-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${gpaRatioPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Overall MUAS Honor Scale Thresholds: 3.50+ Cum.</span>
            <span className="font-semibold text-emerald-600 inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Grade Index Stable
            </span>
          </div>
        </div>

        {/* Demographics / Billing Summary (RHS grid) */}
        <div className="space-y-6">
          {/* Box 1: Student Demographics */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Users className="h-4.5 w-4.5 text-slate-400" />
              Enrollment Demographics Share
            </h2>
            <p className="text-xs text-slate-500 font-sans">Student split percentages recorded in current regular semester.</p>

            <div className="grid grid-cols-2 gap-4">
              {/* Male segment */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Male Learners</span>
                <p className="text-2xl font-bold font-display text-slate-800">{maleCount}</p>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden max-w-[100px] mx-auto">
                  <div className="h-full bg-brand-blue-500 rounded-full" style={{ width: `${malePercent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">{malePercent}% aggregate ratio</span>
              </div>

              {/* Female segment */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Female Learners</span>
                <p className="text-2xl font-bold font-display text-slate-800">{femaleCount}</p>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden max-w-[100px] mx-auto">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${femalePercent}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">{femalePercent}% aggregate ratio</span>
              </div>
            </div>
          </div>

          {/* Box 2: Billing Ledger Health */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-display font-semibold text-slate-900 text-base border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <FileCheck className="h-4.5 w-4.5 text-emerald-500" />
              Tuition Ledger Health Summary
            </h2>
            <p className="text-xs text-slate-500">Student count allocations mapped by final financial clearing statuses.</p>

            <div className="space-y-3">
              {/* Row 1 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600 font-medium">Fully Settled Accounts</span>
                </div>
                <span className="font-bold text-slate-800">{fullyPaidCount} Students ({totalStudents > 0 ? Math.round((fullyPaidCount / totalStudents) * 100) : 0}%)</span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-slate-600 font-medium">Partially Clearance Pending</span>
                </div>
                <span className="font-bold text-slate-800">{partiallyPaidCount} Students ({totalStudents > 0 ? Math.round((partiallyPaidCount / totalStudents) * 100) : 0}%)</span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                  <span className="text-slate-600 font-medium">Unpaid Tuition Defaults</span>
                </div>
                <span className="font-bold text-slate-800">{unpaidCount} Students ({totalStudents > 0 ? Math.round((unpaidCount / totalStudents) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
