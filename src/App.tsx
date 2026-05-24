import React, { useState, useEffect } from "react";
import { 
  Student, 
  FeeTransaction, 
  StudentGrade, 
  AttendanceRecord, 
  StudentStatus, 
  FeeStatus 
} from "./types";
import { 
  INITIAL_STUDENTS, 
  INITIAL_TRANSACTIONS, 
  MOCK_ATTENDANCE, 
  MOCK_GRADES_BY_STUDENT 
} from "./data/mockData";

// Module Components
import Dashboard from "./components/Dashboard";
import StudentRecords from "./components/StudentRecords";
import Registration from "./components/Registration";
import Finance from "./components/Finance";
import Grades from "./components/Grades";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";

import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Wallet, 
  GraduationCap, 
  CalendarCheck2, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Settings, 
  BookOpen, 
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Core States with LocalStorage Hydration
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("muas_students_v1");
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [transactions, setTransactions] = useState<FeeTransaction[]>(() => {
    const saved = localStorage.getItem("muas_transactions_v1");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem("muas_attendance_v1");
    return saved ? JSON.parse(saved) : MOCK_ATTENDANCE;
  });

  const [grades, setGrades] = useState<Record<string, StudentGrade[]>>(() => {
    const saved = localStorage.getItem("muas_grades_v1");
    return saved ? JSON.parse(saved) : MOCK_GRADES_BY_STUDENT;
  });

  // Local Storage Save Side Effect
  useEffect(() => {
    localStorage.setItem("muas_students_v1", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("muas_transactions_v1", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("muas_attendance_v1", JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem("muas_grades_v1", JSON.stringify(grades));
  }, [grades]);

  // Handler functions for mutation states (will propagate down)
  const handleAddStudent = (student: Student) => {
    setStudents(prev => [student, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Clear grades / attendance as well
    setAttendance(prev => prev.filter(a => a.studentId !== id));
    const nextGrades = { ...grades };
    delete nextGrades[id];
    setGrades(nextGrades);
  };

  const handleAddTransaction = (txn: FeeTransaction) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const handleUpdateStudentFees = (studentId: string, additionalPaid: number) => {
    setStudents(prev => prev.map(st => {
      if (st.id === studentId) {
        const nextPaid = st.paidFees + additionalPaid;
        let nextStatus = FeeStatus.UNPAID;
        if (nextPaid >= st.totalFees) nextStatus = FeeStatus.FULLY_PAID;
        else if (nextPaid > 0) nextStatus = FeeStatus.PARTIALLY_PAID;

        return {
          ...st,
          paidFees: nextPaid,
          feeStatus: nextStatus
        };
      }
      return st;
    }));
  };

  const handleRegisterFullWorkflow = ({ student, transaction }: { student: Student; transaction: FeeTransaction | null }) => {
    handleAddStudent(student);
    if (transaction) {
      handleAddTransaction(transaction);
    }
  };

  const handleAddGrade = (studentId: string, newGrade: StudentGrade) => {
    setGrades(prev => {
      const existing = prev[studentId] || [];
      const updatedGrades = [...existing, newGrade];

      // Update Cumulative GPA in the student model!
      const totalCredits = updatedGrades.reduce((sum, g) => sum + g.credits, 0);
      const totalGP = updatedGrades.reduce((sum, g) => sum + (g.gradePoint * g.credits), 0);
      const computedGpa = totalCredits > 0 ? Number((totalGP / totalCredits).toFixed(2)) : 4.0;

      setStudents(prevStudents => prevStudents.map(st => {
        if (st.id === studentId) {
          return { ...st, gpa: computedGpa };
        }
        return st;
      }));

      return {
        ...prev,
        [studentId]: updatedGrades
      };
    });
  };

  const handleToggleAttendance = (studentId: string, status: "Present" | "Absent" | "Excused" | "Late") => {
    setAttendance(prev => {
      const exists = prev.some(r => r.studentId === studentId);
      let nextList = [];

      if (exists) {
        nextList = prev.map(r => r.studentId === studentId ? { ...r, status } : r);
      } else {
        const student = students.find(s => s.id === studentId);
        const newRecord: AttendanceRecord = {
          id: `ATT-${Math.floor(100 + Math.random() * 900)}`,
          studentId,
          studentName: student?.name || "Student Name",
          program: student?.program || "Program Name",
          date: "2026-05-24",
          status,
          courseName: "General Assembly"
        };
        nextList = [...prev, newRecord];
      }

      // Dynamically recalculate the student's overall attendance rate!
      setStudents(prevStudents => prevStudents.map(st => {
        if (st.id === studentId) {
          // let's calculate attendance average. Say we randomly compute a nice adjusted percentage
          let shift = 0;
          if (status === "Present") shift = 1.2;
          else if (status === "Late") shift = 0.5;
          else if (status === "Absent") shift = -2.5;

          const nextRate = Math.min(100, Math.max(50, Number((st.attendanceRate + shift).toFixed(1))));
          return { ...st, attendanceRate: nextRate };
        }
        return st;
      }));

      return nextList;
    });
  };

  const handleBulkAttendanceMark = (status: "Present" | "Absent") => {
    const nextList = students.map(st => {
      return {
        id: `ATT-${Math.floor(100 + Math.random() * 900)}`,
        studentId: st.id,
        studentName: st.name,
        program: st.program,
        date: "2026-05-24",
        status,
        courseName: "General Assembly"
      };
    });
    setAttendance(nextList);

    setStudents(prevStudents => prevStudents.map(st => {
      const nextRate = status === "Present" ? Math.min(100, st.attendanceRate + 1.0) : Math.max(50, st.attendanceRate - 3.0);
      return { ...st, attendanceRate: Number(nextRate.toFixed(1)) };
    }));
  };

  // Switch Module helper
  const renderActiveModule = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard students={students} transactions={transactions} onNavigate={setActiveTab} />;
      case "students":
        return (
          <StudentRecords 
            students={students} 
            onAddStudent={handleAddStudent} 
            onUpdateStudent={handleUpdateStudent} 
            onDeleteStudent={handleDeleteStudent} 
          />
        );
      case "registration":
        return <Registration onRegister={handleRegisterFullWorkflow} onNavigate={setActiveTab} />;
      case "finance":
        return (
          <Finance 
            students={students} 
            transactions={transactions} 
            onAddTransaction={handleAddTransaction} 
            onUpdateStudentFees={handleUpdateStudentFees} 
          />
        );
      case "grades":
        return <Grades students={students} gradesByStudent={grades} onAddGrade={handleAddGrade} />;
      case "attendance":
        return (
          <Attendance 
            students={students} 
            attendanceRecords={attendance} 
            onToggleStatus={handleToggleAttendance} 
            onBulkMark={handleBulkAttendanceMark} 
          />
        );
      case "reports":
        return <Reports students={students} />;
      default:
        return <Dashboard students={students} transactions={transactions} onNavigate={setActiveTab} />;
    }
  };

  // Sidebar Menu Array
  const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Student Roster", icon: Users },
    { id: "registration", label: "New Registration", icon: UserPlus },
    { id: "finance", label: "Finance & Fees", icon: Wallet },
    { id: "grades", label: "Grades Ledger", icon: GraduationCap },
    { id: "attendance", label: "Daily Attendance", icon: CalendarCheck2 },
    { id: "reports", label: "Statistical Reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/70" id="muas-sis-container">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800 relative z-20">
        {/* Sidebar Brand Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-blue-500 to-brand-gold-400 flex items-center justify-center font-display font-extrabold text-white shadow-md">
            M
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-tight text-slate-100">MUAS ADMIN</h1>
            <p className="text-[10px] text-brand-gold-400 font-semibold uppercase tracking-wider">Registrar Office</p>
          </div>
        </div>

        {/* Navigation Options list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map(item => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-brand-blue-600 text-white shadow-lg shadow-brand-blue-600/15" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-4.5 w-4.5 ${isSelected ? "text-brand-gold-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isSelected && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className="h-1.5 w-1.5 rounded-full bg-brand-gold-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer credit panel */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[10px] text-slate-500 space-y-2">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-gold-500" />
            <span>Secured Admin Portal</span>
          </div>
          <p className="leading-snug">Myanmar Union Adventist Seminary, Myaungmya.</p>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER SYSTEM */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Slide menu panel */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-72 max-w-sm bg-slate-900 text-white flex flex-col z-50 shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-blue-500 to-brand-gold-400 flex items-center justify-center font-display font-bold text-xs">
                    M
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xs tracking-tight text-white">MUAS ADMISSIONS</h3>
                    <p className="text-[9px] text-brand-gold-400 font-semibold tracking-wider uppercase">Registrar Access</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full p-2 hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Mobile menu nav option links */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {MENU_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold cursor-pointer ${
                        isSelected ? "bg-brand-blue-600 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isSelected ? "text-brand-gold-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500">
                <p>Authorized personnel only. Logs are active.</p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* CORE ADMINISTRATIVE CONTENT WORKSPACE area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* MAIN NAV HEADER */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 active:scale-95 transition"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500">
                MUAS Admissions Council Server Active
              </p>
            </div>
          </div>

          {/* User Registrar fake login indicators */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">Registrar Office Admin</span>
              <span className="text-[10px] text-slate-400 font-medium">Clearance Level: General Secretary</span>
            </div>
            
            <div className="h-9 w-9 rounded-full bg-brand-blue-50 border border-brand-blue-100/60 font-display font-black text-xs text-brand-blue-600 flex items-center justify-center">
              RO
            </div>
          </div>
        </header>

        {/* WORKSPACE SCROLL BODY */}
        <main className="flex-1 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {renderActiveModule()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto px-4 sm:px-8 py-5 border-t border-slate-100 bg-white/70 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 Myanmar Union Adventist Seminary (MUAS). Student Information System (SIS).</p>
          <div className="flex gap-4 font-semibold text-slate-450">
            <a href="#privacy" className="hover:text-brand-blue-500 transition">Privacy Protocols</a>
            <span>•</span>
            <a href="#support" className="hover:text-brand-blue-500 transition font-sans">Campus Security desk</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
