export enum StudentStatus {
  ACTIVE = "Active",
  ON_LEAVE = "On Leave",
  SUSPENDED = "Suspended",
  GRADUATED = "Graduated",
}

export enum FeeStatus {
  FULLY_PAID = "Fully Paid",
  PARTIALLY_PAID = "Partially Paid",
  UNPAID = "Unpaid",
}

export interface Student {
  id: string; // e.g., MUAS-2026-0034
  name: string;
  program: string; // e.g., Bachelor of Theology, BS Information Technology, BA Business Administration
  year: number; // 1, 2, 3, 4
  gender: "Male" | "Female" | "Other";
  status: StudentStatus;
  gpa: number;
  attendanceRate: number; // percentage
  feeStatus: FeeStatus;
  totalFees: number; // in MMK or USD, let's use MMK with USD displays as options, or clear formatted MMK
  paidFees: number;
  email: string;
  phone: string;
  enrollmentDate: string;
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
}

export interface StudentGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  gradePoint: number; // e.g., 4.0
  letterGrade: string; // A, B+, etc.
  semester: string; // First Semester 2025-2026
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  date: string;
  status: "Present" | "Absent" | "Excused" | "Late";
  courseName: string;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  category: "Tuition" | "Dormitory" | "Cafeteria" | "Registration" | "Library";
  paymentMethod: "KBZPay" | "CB Bank" | "Cash" | "WaveMoney" | "Bank Transfer";
  status: "Completed" | "Pending" | "Failed";
  receiptNo: string;
}

export interface DashboardStats {
  totalStudents: number;
  newRegistrations: number;
  pendingFees: number; // Total unpaid amount
  avgGpa: number;
  avgAttendance: number;
}
