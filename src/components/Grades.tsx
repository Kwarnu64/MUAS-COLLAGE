import React, { useState } from "react";
import { Student, StudentGrade } from "../types";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Briefcase, 
  Check, 
  Award, 
  BookOpen, 
  TrendingUp, 
  User,
  PlusCircle,
  AlertCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface GradesProps {
  students: Student[];
  gradesByStudent: Record<string, StudentGrade[]>;
  onAddGrade: (studentId: string, grade: StudentGrade) => void;
}

export default function Grades({ students, gradesByStudent, onAddGrade }: GradesProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("3");
  const [gradePoint, setGradePoint] = useState("4.0");
  const [letterGrade, setLetterGrade] = useState("A");
  const [semester, setSemester] = useState("First Semester 2025-2026");

  const [addGradeSuccess, setAddGradeSuccess] = useState(false);

  // Selected Student Data
  const currentStudent = students.find(s => s.id === selectedStudentId);
  const studentGrades = gradesByStudent[selectedStudentId] || [];

  // Calculate GPA for the term
  const totalCredits = studentGrades.reduce((sum, g) => sum + g.credits, 0);
  const totalGradePointsTimesCredits = studentGrades.reduce((sum, g) => sum + (g.gradePoint * g.credits), 0);
  const semesterGpa = totalCredits > 0 
    ? (totalGradePointsTimesCredits / totalCredits).toFixed(2) 
    : "0.00";

  // Map grade to letter grades automatically for smooth UX
  const handleGradePointChange = (val: string) => {
    setGradePoint(val);
    const gp = Number(val);
    if (gp >= 4.0) setLetterGrade("A");
    else if (gp >= 3.7) setLetterGrade("A-");
    else if (gp >= 3.3) setLetterGrade("B+");
    else if (gp >= 3.0) setLetterGrade("B");
    else if (gp >= 2.7) setLetterGrade("B-");
    else if (gp >= 2.3) setLetterGrade("C+");
    else if (gp >= 2.0) setLetterGrade("C");
    else if (gp >= 1.0) setLetterGrade("D");
    else setLetterGrade("F");
  };

  const handleAddGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !courseCode || !courseName) return;

    const newGrade: StudentGrade = {
      courseCode: courseCode,
      courseName: courseName,
      credits: Number(credits) || 3,
      gradePoint: Number(gradePoint) || 4.0,
      letterGrade: letterGrade,
      semester: semester,
    };

    onAddGrade(selectedStudentId, newGrade);

    // Clear form
    setCourseCode("");
    setCourseName("");
    setAddGradeSuccess(true);
    setTimeout(() => setAddGradeSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" id="grades-module">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-brand-blue-500" />
            MUAS Academic Gradebook
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign official theological and business course credits, view student academic summaries, and track GPA indices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Student Picker & Core GPA details */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card 1: Account Selection */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-800 flex items-center gap-1.5 label">
              <User className="h-4.5 w-4.5 text-slate-400" />
              Select Student To Review
            </h3>

            <div className="space-y-1.5 text-xs">
              <select 
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 outline-none bg-slate-50/50 focus:bg-white focus:border-brand-blue-500 font-semibold text-slate-700 transition"
              >
                {students.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.id})</option>
                ))}
              </select>
            </div>

            {currentStudent && (
              <div className="pt-2.5 border-t border-slate-50 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Enrolled Pipeline:</span>
                  <span className="font-semibold text-slate-800">{currentStudent.program}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Level:</span>
                  <span className="font-semibold text-slate-800">Year {currentStudent.year} Student</span>
                </div>
                <div className="flex justify-between">
                  <span>Academic Standing:</span>
                  <span className="font-semibold text-emerald-600">Good Standing</span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Quick Assign Grade Form */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-800 flex items-center gap-1.5 label">
              <PlusCircle className="h-4.5 w-4.5 text-brand-gold-500" />
              Assign Grade Entry
            </h3>

            <form onSubmit={handleAddGradeSubmit} className="space-y-3.5 text-xs text-slate-600">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Course Code</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="THEO-304"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-brand-blue-500 font-semibold"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Course Title Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Systematic Theology"
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-brand-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Credits</label>
                  <select 
                    value={credits}
                    onChange={e => setCredits(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-semibold"
                  >
                    <option value="1">1 Credit</option>
                    <option value="2">2 Credits</option>
                    <option value="3">3 Credits</option>
                    <option value="4">4 Credits</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Grade Point</label>
                  <select 
                    value={gradePoint}
                    onChange={e => handleGradePointChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-bold"
                  >
                    <option value="4.0">4.00 (A)</option>
                    <option value="3.7">3.70 (A-)</option>
                    <option value="3.3">3.30 (B+)</option>
                    <option value="3.0">3.00 (B)</option>
                    <option value="2.7">2.70 (B-)</option>
                    <option value="2.3">2.30 (C+)</option>
                    <option value="2.0">2.00 (C)</option>
                    <option value="1.0">1.00 (D)</option>
                    <option value="0.0">0.00 (F)</option>
                  </select>
                </div>

                <div className="space-y-1 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Letter</span>
                  <span className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-transparent bg-slate-100 font-display text-base font-extrabold text-slate-800">
                    {letterGrade}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Semester / Term</label>
                <select 
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-semibold"
                >
                  <option value="First Semester 2025-2026">First Semester 2025-2026</option>
                  <option value="Second Semester 2025-2026">Second Semester 2025-2026</option>
                  <option value="Summer Term 2026">Summer Term 2026</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 py-2.5 text-xs font-semibold text-white transition active:scale-[0.97] cursor-pointer shadow-md shadow-brand-blue-500/10"
              >
                Assign Course Grade
              </button>

              {addGradeSuccess && (
                <div className="rounded-lg bg-emerald-55/70 text-emerald-700 text-[11px] font-medium p-2 text-center border border-emerald-100/50 animate-fade-in">
                  Grade registered into the SIS database.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right column: Interactive Term GPA breakdown and Transcript Table list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 3: Academic Record List Table */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-50 pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">Transcript Course Scores</h2>
                <p className="text-[11px] text-slate-400">Selected term courses and registered grades.</p>
              </div>
              
              {/* Semester GPA Display */}
              <div className="rounded-xl border border-brand-blue-100 bg-brand-blue-50/40 px-3.5 py-2 text-right">
                <span className="text-[9px] font-bold tracking-wider text-brand-blue-700 uppercase block">Semester GPA Index</span>
                <span className="font-display text-lg font-extrabold text-brand-blue-800">{semesterGpa}</span>
                <span className="text-[10px] text-slate-400"> / 4.00</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-2">Code</th>
                    <th className="py-2">Course Name</th>
                    <th className="py-2 text-center">Credit Hours</th>
                    <th className="py-2 text-center">Grade Point</th>
                    <th className="py-2 text-right">Letter Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {studentGrades.length > 0 ? (
                    studentGrades.map(g => (
                      <tr key={g.courseCode} className="hover:bg-slate-50/30">
                        <td className="py-3 font-mono font-bold text-slate-800">{g.courseCode}</td>
                        <td className="py-3 font-medium text-slate-700">{g.courseName}</td>
                        <td className="py-3 text-center text-slate-500 font-semibold">{g.credits} Credits</td>
                        <td className="py-3 text-center text-slate-600 font-medium">{g.gradePoint.toFixed(2)}</td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex h-6 w-8 items-center justify-center rounded-md font-bold text-[10px] ${
                            g.letterGrade.startsWith("A") ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            g.letterGrade.startsWith("B") ? "bg-brand-blue-50 text-brand-blue-700 border border-brand-blue-100" :
                            g.letterGrade.startsWith("C") ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {g.letterGrade}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-slate-500">No grades on directory for this student yet</p>
                        <p className="text-[11px] text-slate-400 mt-1">Use the left form to insert course metrics.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {studentGrades.length > 0 && (
              <div className="bg-slate-50/70 border-t border-slate-100 px-1 py-3 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Total Term Course Load: {studentGrades.length} units</span>
                <span>System Verified: Registrar General Authority</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
