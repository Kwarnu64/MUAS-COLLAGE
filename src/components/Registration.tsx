import React, { useState } from "react";
import { Student, StudentStatus, FeeStatus } from "../types";
import { 
  UserPlus, 
  CheckCircle, 
  FileText, 
  MapPin, 
  BookOpen, 
  Mail, 
  Phone, 
  Award, 
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RegistrationProps {
  onRegister: (student: any) => void;
  onNavigate: (page: string) => void;
}

const PROGRAM_OPTIONS = [
  "Bachelor of Theology",
  "BS in Information Technology",
  "BA in Business Administration",
  "BA in Education",
  "BA in English"
];

export default function Registration({ onRegister, onNavigate }: RegistrationProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    program: "Bachelor of Theology",
    year: "1",
    phone: "",
    email: "",
    address: "",
    sponsorName: "",
    sponsorPhone: "",
    totalFees: "1200000",
    initialPaid: "0",
    paymentMethod: "KBZPay",
  });

  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Build the clean added student object
    const yearPrefix = new Date().getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedId = `MUAS-${yearPrefix}-${randomSuffix}`;
    const calculatedEmail = formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@muas.edu.mm`;

    const totalFeesNum = Number(formData.totalFees) || 1200000;
    const initialPaidNum = Number(formData.initialPaid) || 0;

    let calculatedFeeStatus = FeeStatus.UNPAID;
    if (initialPaidNum >= totalFeesNum) {
      calculatedFeeStatus = FeeStatus.FULLY_PAID;
    } else if (initialPaidNum > 0) {
      calculatedFeeStatus = FeeStatus.PARTIALLY_PAID;
    }

    const compiledStudent: Student = {
      id: generatedId,
      name: formData.name,
      program: formData.program,
      year: Number(formData.year),
      gender: formData.gender as any,
      status: StudentStatus.ACTIVE,
      gpa: 4.0, // High starting GPA!
      attendanceRate: 100,
      feeStatus: calculatedFeeStatus,
      totalFees: totalFeesNum,
      paidFees: initialPaidNum,
      email: calculatedEmail,
      phone: formData.phone || "09-xxxxxxxxx",
      enrollmentDate: new Date().toISOString().split("T")[0],
    };

    onRegister({
      student: compiledStudent,
      transaction: initialPaidNum > 0 ? {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: generatedId,
        studentName: formData.name,
        amount: initialPaidNum,
        date: new Date().toISOString().split("T")[0],
        category: "Registration",
        paymentMethod: formData.paymentMethod,
        status: "Completed",
        receiptNo: `REC-REG-${Math.floor(10000 + Math.random() * 90000)}`
      } : null
    });

    setRegisterSuccess(generatedId);
    
    // Reset Form
    setFormData({
      name: "",
      gender: "Male",
      program: "Bachelor of Theology",
      year: "1",
      phone: "",
      email: "",
      address: "",
      sponsorName: "",
      sponsorPhone: "",
      totalFees: "1200000",
      initialPaid: "0",
      paymentMethod: "KBZPay",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="registration-module">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-brand-blue-500" />
          MUAS Admissions & Student Registration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the official seminary admissions card below. Creating a new profile automatically initiates academic and billing ledger accounts.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {registerSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-emerald-100 bg-emerald-500/5 p-8 text-center space-y-4 shadow-sm"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">Admissions Record Secured!</h2>
            <div className="max-w-md mx-auto text-xs text-slate-600 leading-relaxed">
              <p>The student has been successfully admitted into the seminary registry. A campus login has been generated automatically with standard default codes.</p>
              <div className="mt-4 rounded-xl bg-white p-4 border border-slate-150 flex flex-col gap-2.5 text-left font-mono">
                <p><span className="text-slate-400 font-sans">Student ID:</span> <span className="text-brand-blue-600 font-bold">{registerSuccess}</span></p>
                <p><span className="text-slate-400 font-sans">Default Email:</span> <span className="text-slate-700 font-semibold">student_name@muas.edu.mm</span></p>
                <p><span className="text-slate-400 font-sans">Initial Account Status:</span> <span className="text-emerald-600 font-semibold font-sans">Active (Ready for Classes)</span></p>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button 
                onClick={() => setRegisterSuccess(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 cursor-pointer transition active:scale-95"
              >
                Enroll Another Candidate
              </button>
              <button 
                onClick={() => onNavigate("students")}
                className="rounded-xl bg-brand-blue-500 hover:bg-brand-blue-600 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer transition active:scale-95 shadow-lg shadow-brand-blue-500/15"
              >
                Go to Student Database
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Form inputs left columns */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Segment 1: Personal Attributes */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <FileText className="h-4 w-4 text-brand-blue-500" />
                    <h2 className="font-display font-bold text-sm text-slate-800">1. Applicant Personal Record</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-600 block">Candidate Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Aung Myo Thu"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-800 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Degree Selection *</label>
                      <select 
                        value={formData.program}
                        onChange={e => setFormData({...formData, program: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                      >
                        {PROGRAM_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Academic Year Level</label>
                      <select 
                        value={formData.year}
                        onChange={e => setFormData({...formData, year: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                      >
                        <option value="1">Year 1 (Freshman)</option>
                        <option value="2">Year 2 (Sophomore)</option>
                        <option value="3">Year 3 (Junior)</option>
                        <option value="4">Year 4 (Senior)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Primary Mobile Phone *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 09-XXXXXXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Personal Email address</label>
                      <input 
                        type="email" 
                        placeholder="Optional - auto generated if blank"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-800"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-600 block">Myanmar Residential Address</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. Pyindawbo Ward, Myaungmya Township, Ayeyarwady Region"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-800 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Segment 2: Sponsor Details */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Award className="h-4 w-4 text-brand-gold-500" />
                    <h2 className="font-display font-bold text-sm text-slate-800">2. Spiritual Sponsor / Parent Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Sponsor / Parent Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pastor Saw Shwe"
                        value={formData.sponsorName}
                        onChange={e => setFormData({...formData, sponsorName: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">Sponsor Contact Phone *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 09-XXXXXXX"
                        value={formData.sponsorPhone}
                        onChange={e => setFormData({...formData, sponsorPhone: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-slate-50/20 focus:bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar financial section on right column */}
              <div className="space-y-6">
                
                {/* Billing Summary Box */}
                <div className="rounded-2xl border border-brand-blue-100 bg-brand-blue-50/40 p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-brand-blue-100/50">
                    <Sparkles className="h-4 w-4 text-brand-blue-600" />
                    <h3 className="font-display font-bold text-sm text-brand-blue-900">Financial Setup</h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-blue-800 block">Tuition Semester Rate (MMK)</label>
                      <input 
                        type="number" 
                        value={formData.totalFees}
                        onChange={e => setFormData({...formData, totalFees: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-semibold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-brand-blue-800 block">Initial Down Payment (MMK)</label>
                      <input 
                        type="number" 
                        value={formData.initialPaid}
                        onChange={e => setFormData({...formData, initialPaid: e.target.value})}
                        className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-semibold text-slate-800"
                      />
                    </div>

                    {Number(formData.initialPaid) > 0 && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="font-bold text-brand-blue-800 block">Payment Clearing Gateway</label>
                        <select 
                          value={formData.paymentMethod}
                          onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 bg-white outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                        >
                          <option value="KBZPay">KBZPay App</option>
                          <option value="WaveMoney">WaveMoney Cash</option>
                          <option value="CB Bank">CB Bank Transfer</option>
                          <option value="Cash">Cash in Registrar Hand</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl bg-white border border-brand-blue-100 p-3 text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Total Charged:</span>
                      <span className="text-slate-800">{(Number(formData.totalFees) || 0).toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500">Initial Deposit:</span>
                      <span className="text-emerald-600">{(Number(formData.initialPaid) || 0).toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-slate-50 pt-1 text-[11px] mt-1 text-slate-900">
                      <span>Outstanding Debt:</span>
                      <span>
                        {Math.max(0, (Number(formData.totalFees) || 0) - (Number(formData.initialPaid) || 0)).toLocaleString()} MMK
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 text-xs text-slate-500 space-y-2.5">
                  <p className="font-bold text-slate-700 flex items-center gap-1">
                    <Info className="h-4 w-4 text-slate-400" />
                    Admissions Guideline:
                  </p>
                  <p className="leading-relaxed">
                    Once registered, students are enrolled in the current semester. Official academic grades modules track grades after registrar grades input.
                  </p>
                </div>

                {/* Submit Action */}
                <button 
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue-500 text-white py-3.5 text-xs font-bold hover:bg-brand-blue-600 transition shadow-lg shadow-brand-blue-500/10 cursor-pointer active:scale-[0.98]"
                >
                  <UserPlus className="h-4.5 w-4.5" />
                  Finalize Seminary Enrollment
                </button>
              </div>

            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
