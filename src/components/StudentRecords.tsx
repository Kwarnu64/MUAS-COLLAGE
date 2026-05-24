import React, { useState } from "react";
import { Student, StudentStatus, FeeStatus } from "../types";
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  UserPlus, 
  Check, 
  AlertCircle,
  X,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudentRecordsProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const PROGRAM_OPTIONS = [
  "Bachelor of Theology",
  "BS in Information Technology",
  "BA in Business Administration",
  "BA in Education",
  "BA in English"
];

export default function StudentRecords({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent 
}: StudentRecordsProps) {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected student for detail preview modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Modal forms
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormState, setEditFormState] = useState<Student | null>(null);

  // New Student state
  const [newStudent, setNewStudent] = useState({
    name: "",
    program: "Bachelor of Theology",
    year: 1,
    gender: "Male" as "Male" | "Female" | "Other",
    status: StudentStatus.ACTIVE,
    gpa: 3.0,
    attendanceRate: 95.0,
    feeStatus: FeeStatus.UNPAID,
    totalFees: 1200000,
    paidFees: 0,
    email: "",
    phone: "",
  });

  // Handler for opening the edit modal
  const openEditModal = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal
    setEditFormState({ ...student });
    setIsEditModalOpen(true);
  };

  // Submit add logic
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    // Generate accurate ID
    const yearPrefix = new Date().getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedId = `MUAS-${yearPrefix}-${randomSuffix}`;
    const calculatedEmail = `${newStudent.name.toLowerCase().replace(/\s+/g, ".")}@muas.edu.mm`;

    const studentToPush: Student = {
      id: generatedId,
      name: newStudent.name,
      program: newStudent.program,
      year: Number(newStudent.year),
      gender: newStudent.gender,
      status: newStudent.status,
      gpa: Number(newStudent.gpa) || 0.0,
      attendanceRate: Number(newStudent.attendanceRate) || 100,
      feeStatus: newStudent.feeStatus,
      totalFees: Number(newStudent.totalFees) || 1200000,
      paidFees: Number(newStudent.paidFees) || 0,
      email: newStudent.email || calculatedEmail,
      phone: newStudent.phone || "09-xxxxxxxxx",
      enrollmentDate: new Date().toISOString().split("T")[0],
    };

    onAddStudent(studentToPush);
    setIsAddModalOpen(false);
    // Reset form
    setNewStudent({
      name: "",
      program: "Bachelor of Theology",
      year: 1,
      gender: "Male",
      status: StudentStatus.ACTIVE,
      gpa: 3.0,
      attendanceRate: 95.0,
      feeStatus: FeeStatus.UNPAID,
      totalFees: 1200000,
      paidFees: 0,
      email: "",
      phone: "",
    });
  };

  // Submit edit logic
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormState) {
      onUpdateStudent(editFormState);
      setIsEditModalOpen(false);
      setEditFormState(null);
    }
  };

  // Delete wrapper with confirm alert
  const handleDeleteClick = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name} (ID: ${id})? This will erase all their academic and finance logs.`)) {
      onDeleteStudent(id);
      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }
    }
  };

  // Filter & search implementation
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram = programFilter === "All" || student.program === programFilter;
    const matchesYear = yearFilter === "All" || student.year.toString() === yearFilter;
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesProgram && matchesYear && matchesStatus;
  });

  return (
    <div className="space-y-6" id="studentrecords-module">
      {/* Title Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-brand-blue-500" />
            MUAS Registrations Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, update and safely remove core student rosters in the Seminary database.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue-500 text-white px-4 py-2.5 text-xs font-semibold hover:bg-brand-blue-600 transition shadow-lg shadow-brand-blue-500/10 active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Add Student Profile
        </button>
      </div>

      {/* Filter Matrix panel */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by student name, MUAS ID, or cloud email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 outline-none bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 transition placeholder:text-slate-400 focus:border-brand-blue-500 focus:bg-white"
            />
          </div>

          {/* Program Select */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/40 px-2.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select 
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer py-1"
              >
                <option value="All">All Programs</option>
                {PROGRAM_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Year Select */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/40 px-2.5">
              <select 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer py-1"
              >
                <option value="All">All Years</option>
                <option value="1">Year 1 (Freshman)</option>
                <option value="2">Year 2 (Sophomore)</option>
                <option value="3">Year 3 (Junior)</option>
                <option value="4">Year 4 (Senior)</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/40 px-2.5">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer py-1"
              >
                <option value="All">All Statuses</option>
                {Object.values(StudentStatus).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <th className="py-3.5 px-6">ID & Student</th>
                <th className="py-3.5 px-6">Degree Program</th>
                <th className="py-3.5 px-6">Year / Level</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Academic GPA</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs text-slate-755">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr 
                    key={st.id} 
                    onClick={() => setSelectedStudent(st)}
                    className="hover:bg-slate-50/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-blue-50 text-brand-blue-600 font-display font-bold flex items-center justify-center border border-slate-100 text-xs">
                          {st.name.split(" ").slice(-1)[0][0] || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-brand-blue-500 transition">{st.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{st.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                      {st.program}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-semibold">
                      Year {st.year}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        st.status === StudentStatus.ACTIVE ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        st.status === StudentStatus.ON_LEAVE ? "bg-amber-50 text-amber-700 border-amber-100" :
                        st.status === StudentStatus.SUSPENDED ? "font-sans bg-rose-50 text-rose-700 border-rose-100" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${
                          st.status === StudentStatus.ACTIVE ? "bg-emerald-500" :
                          st.status === StudentStatus.ON_LEAVE ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1">
                        <span className={`font-semibold ${st.gpa >= 3.5 ? "text-emerald-600" : "text-slate-700"}`}>
                          {st.gpa.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">GPA</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={(e) => openEditModal(st, e)}
                          title="Edit student specifications"
                          className="p-1 px-1.5 rounded-lg border border-slate-100 hover:border-brand-blue-100 hover:bg-brand-blue-50/40 text-slate-500 hover:text-brand-blue-500 transition active:scale-90"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(st.id, st.name, e)}
                          title="Erase profile"
                          className="p-1 px-1.5 rounded-lg border border-slate-100 hover:border-rose-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition active:scale-90"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-slate-400">
                    <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-500">No student matching requirements found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try resetting your filter fields or search keyword text.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-3.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>Row count: {filteredStudents.length} of {students.length} students</span>
          <span className="text-slate-400 font-sans">Verification Authority: Registrar Administrative Branch</span>
        </div>
      </div>

      {/* Roster Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <UserPlus className="h-5 w-5 text-brand-blue-500" />
                  Seminary Enrollment Form
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Naw Eh Phaw"
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Enrollment Program</label>
                    <select 
                      value={newStudent.program}
                      onChange={e => setNewStudent({...newStudent, program: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      {PROGRAM_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Year / Level</label>
                    <select 
                      value={newStudent.year}
                      onChange={e => setNewStudent({...newStudent, year: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      <option value="1">Year 1 (Freshman)</option>
                      <option value="2">Year 2 (Sophomore)</option>
                      <option value="3">Year 3 (Junior)</option>
                      <option value="4">Year 4 (Senior)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Gender</label>
                    <select 
                      value={newStudent.gender}
                      onChange={e => setNewStudent({...newStudent, gender: e.target.value as any})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Academic Score (Init GPA)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="4"
                      value={newStudent.gpa}
                      onChange={e => setNewStudent({...newStudent, gpa: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Initial Attendance Rate (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={newStudent.attendanceRate}
                      onChange={e => setNewStudent({...newStudent, attendanceRate: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Primary Contact Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 09-954382371"
                      value={newStudent.phone}
                      onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Email (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="Custom cloud login email"
                      value={newStudent.email}
                      onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 mt-4">
                  <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Financial Setup</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Total Term Fees (MMK)</label>
                      <input 
                        type="number" 
                        value={newStudent.totalFees}
                        onChange={e => setNewStudent({...newStudent, totalFees: Number(e.target.value)})}
                        className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold">Fee Status Pin</label>
                      <select 
                        value={newStudent.feeStatus}
                        onChange={e => {
                          const fStatus = e.target.value as FeeStatus;
                          const paidVal = fStatus === FeeStatus.FULLY_PAID ? newStudent.totalFees : fStatus === FeeStatus.UNPAID ? 0 : Math.floor(newStudent.totalFees / 2);
                          setNewStudent({...newStudent, feeStatus: fStatus, paidFees: paidVal});
                        }}
                        className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-semibold"
                      >
                        {Object.values(FeeStatus).map(fs => (
                          <option key={fs} value={fs}>{fs}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 text-[13px]">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 font-semibold text-white bg-brand-blue-500 hover:bg-brand-blue-600 rounded-xl transition cursor-pointer shadow-md"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Roster Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editFormState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="h-5 w-5 text-brand-gold-500" />
                  Edit Student Specifications
                </h3>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setEditFormState(null); }}
                  className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={editFormState.name}
                      onChange={e => setEditFormState({...editFormState, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Enrollment Program</label>
                    <select 
                      value={editFormState.program}
                      onChange={e => setEditFormState({...editFormState, program: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      {PROGRAM_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Year / Level</label>
                    <select 
                      value={editFormState.year}
                      onChange={e => setEditFormState({...editFormState, year: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      <option value="1">Year 1 (Freshman)</option>
                      <option value="2">Year 2 (Sophomore)</option>
                      <option value="3">Year 3 (Junior)</option>
                      <option value="4">Year 4 (Senior)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Status</label>
                    <select 
                      value={editFormState.status}
                      onChange={e => setEditFormState({...editFormState, status: e.target.value as StudentStatus})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    >
                      {Object.values(StudentStatus).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Cumulative GPA</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="4"
                      value={editFormState.gpa}
                      onChange={e => setEditFormState({...editFormState, gpa: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Attendance Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      value={editFormState.attendanceRate}
                      onChange={e => setEditFormState({...editFormState, attendanceRate: Number(e.target.value)})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Phone</label>
                    <input 
                      type="text" 
                      value={editFormState.phone}
                      onChange={e => setEditFormState({...editFormState, phone: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Email Address</label>
                    <input 
                      type="email" 
                      value={editFormState.email}
                      onChange={e => setEditFormState({...editFormState, email: e.target.value})}
                      className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 text-[13px]">
                  <button 
                    type="button" 
                    onClick={() => { setIsEditModalOpen(false); setEditFormState(null); }}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 font-semibold text-white bg-brand-gold-500 hover:bg-brand-gold-600 rounded-xl transition cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Roster Details Slide-over / Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedStudent(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
            >
              {/* Cover Top */}
              <div className="bg-gradient-to-br from-brand-blue-800 to-brand-blue-600 p-6 text-white relative">
                <div className="absolute right-4 top-4">
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-full bg-black/15 hover:bg-black/25 p-1.5 text-slate-100 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-full bg-brand-gold-400 font-display font-extrabold text-[28px] text-brand-blue-900 flex items-center justify-center shadow-md">
                    {selectedStudent.name.split(" ").slice(-1)[0][0] || "S"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display">{selectedStudent.name}</h2>
                    <p className="font-mono text-[11px] text-brand-blue-200">{selectedStudent.id}</p>
                    <p className="text-xs bg-brand-gold-500/20 text-brand-gold-300 border border-brand-gold-500/30 rounded-md px-2 py-0.5 mt-1.5 inline-block font-semibold">
                      {selectedStudent.program}
                    </p>
                  </div>
                </div>
              </div>

              {/* Roster Details */}
              <div className="p-6 space-y-5 text-xs text-slate-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">Academic Progress</span>
                    <div className="space-y-2">
                      <p className="text-slate-800 font-bold text-sm">Year {selectedStudent.year} Student</p>
                      <p className="flex items-center gap-1 text-slate-500">
                        <GraduationCap className="h-4 w-4 text-brand-blue-500" />
                        Cumulative GPA: <span className="text-slate-800 font-bold">{selectedStudent.gpa.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">Status Codes</span>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Status: <span className="font-bold text-slate-800">{selectedStudent.status}</span>
                      </p>
                      <p className="text-slate-500">
                        Registered on: <span className="font-medium text-slate-700">{selectedStudent.enrollmentDate}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Contact Demographics</span>
                  <p className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{selectedStudent.email}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700">{selectedStudent.phone}</span>
                  </p>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-3.5">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Billing Summary</span>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">Semester Tuition Fee:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.totalFees.toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">Cleared/Paid:</span>
                      <span className="font-bold text-emerald-600">{selectedStudent.paidFees.toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] border-t border-slate-200/60 pt-2 font-bold">
                      <span className="text-slate-700">Outstanding Balance:</span>
                      <span className="text-rose-600">{(selectedStudent.totalFees - selectedStudent.paidFees).toLocaleString()} MMK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="bg-slate-50/70 border-t border-slate-100 px-6 py-4 flex gap-2 justify-end">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-100 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Close Profile
                </button>
                <button 
                  onClick={(e) => { setSelectedStudent(null); openEditModal(selectedStudent, e); }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-brand-blue-500 hover:bg-brand-blue-600 rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
