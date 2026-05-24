import React, { useState } from "react";
import { Student, FeeTransaction, FeeStatus } from "../types";
import { 
  DollarSign, 
  Search, 
  Plus, 
  Check, 
  ArrowUpRight, 
  Clock, 
  CreditCard, 
  User, 
  Book,
  Calendar,
  AlertCircle,
  X,
  Wallet,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FinanceProps {
  students: Student[];
  transactions: FeeTransaction[];
  onAddTransaction: (txn: FeeTransaction) => void;
  onUpdateStudentFees: (studentId: string, additionalAmount: number) => void;
}

export default function Finance({ 
  students, 
  transactions, 
  onAddTransaction, 
  onUpdateStudentFees 
}: FinanceProps) {
  // Collection Form state
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCategory, setPaymentCategory] = useState<"Tuition" | "Dormitory" | "Cafeteria" | "Registration" | "Library">("Tuition");
  const [paymentMethod, setPaymentMethod] = useState<"KBZPay" | "CB Bank" | "Cash" | "WaveMoney" | "Bank Transfer">("KBZPay");
  const [txnSearch, setTxnSearch] = useState("");

  // Statistics
  const totalCharged = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalReceived = students.reduce((sum, s) => sum + s.paidFees, 0);
  const totalPending = totalCharged - totalReceived;
  const collectionRate = totalCharged > 0 ? (totalReceived / totalCharged) * 100 : 0;

  // Selected student to preview their outstanding balance in collect form
  const targetStudentForPayment = students.find(s => s.id === selectedStudentId);
  const outstandingBalance = targetStudentForPayment 
    ? targetStudentForPayment.totalFees - targetStudentForPayment.paidFees 
    : 0;

  // Search filter transactions
  const filteredTransactions = transactions.filter(txn => {
    return (
      txn.studentName.toLowerCase().includes(txnSearch.toLowerCase()) ||
      txn.studentId.toLowerCase().includes(txnSearch.toLowerCase()) ||
      txn.receiptNo.toLowerCase().includes(txnSearch.toLowerCase()) ||
      txn.category.toLowerCase().includes(txnSearch.toLowerCase())
    );
  });

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !paymentAmount || Number(paymentAmount) <= 0) return;

    const amountNum = Number(paymentAmount);
    const targetStudent = students.find(s => s.id === selectedStudentId);

    if (!targetStudent) return;

    // Create fee transaction record
    const newTxnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newReceiptNo = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const currentDay = new Date().toISOString().split("T")[0];

    const finalTxn: FeeTransaction = {
      id: newTxnId,
      studentId: selectedStudentId,
      studentName: targetStudent.name,
      amount: amountNum,
      date: currentDay,
      category: paymentCategory,
      paymentMethod: paymentMethod,
      status: "Completed",
      receiptNo: newReceiptNo,
    };

    onAddTransaction(finalTxn);
    onUpdateStudentFees(selectedStudentId, amountNum);

    // Reset Form
    setIsCollectModalOpen(false);
    setSelectedStudentId("");
    setPaymentAmount("");
  };

  return (
    <div className="space-y-6" id="finance-module">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="h-6 w-6 text-brand-blue-500" />
            MUAS Business & Finance Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile tuition fees, track individual outstanding student dues, and log KBZPay/cash deposits.
          </p>
        </div>
        <button 
          onClick={() => setIsCollectModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue-500 text-white px-4 py-2.5 text-xs font-semibold hover:bg-brand-blue-600 transition shadow-lg shadow-brand-blue-500/10 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Collect New Payment
        </button>
      </div>

      {/* Finance Top Highlight Metrics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">Aggregate Semester Dues</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2.5xl font-bold text-slate-900">{totalCharged.toLocaleString()}</span>
            <span className="text-xs text-slate-400">MMK</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-sans">Seminary total billing ledger</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">Net Collected Hand</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2.5xl font-bold text-emerald-600">{totalReceived.toLocaleString()}</span>
            <span className="text-xs text-slate-400">MMK</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Collection Rate</span>
            <span className="font-bold text-slate-800">{collectionRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">Total Default Dues</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2.5xl font-bold text-rose-500">{totalPending.toLocaleString()}</span>
            <span className="text-xs text-slate-400">MMK</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-sans">Receivables balance pending audit</p>
        </div>
      </div>

      {/* Split visual lists: Student Dues & Detailed Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Outstanding Students roster (left col) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-display text-base font-bold text-slate-900">Student Tuition Records</h2>
              <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded-full text-slate-600 uppercase">
                {students.length} Accounts
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {students.map(st => {
                const balance = st.totalFees - st.paidFees;
                return (
                  <div 
                    key={st.id} 
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      setIsCollectModalOpen(true);
                    }}
                    className="flex justify-between items-center p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-850">{st.name}</p>
                      <p className="text-[10px] text-slate-400">{st.id} • {st.program.split(" ").slice(-1)[0]}</p>
                    </div>
                    <div className="text-right">
                      {balance > 0 ? (
                        <div>
                          <p className="text-xs font-extrabold text-rose-500">{balance.toLocaleString()} MMK</p>
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Unpaid</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-emerald-600">{st.totalFees.toLocaleString()}</p>
                          <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider">Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Outstanding count: {students.filter(s => s.totalFees > s.paidFees).length} students</span>
            <span className="text-[10px] bg-amber-50 rounded-md border border-amber-100 text-amber-600 px-1.5 font-bold">Pending Clearance</span>
          </div>
        </div>

        {/* Transactions listing logs (right list) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-50">
            <h2 className="font-display text-base font-bold text-slate-900">Accounting Collections Journal</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search ledger..."
                value={txnSearch}
                onChange={e => setTxnSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 outline-none bg-slate-50/50 py-1.5 pl-8 pr-3 text-[11px] text-slate-700 transition focus:border-brand-blue-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px] overflow-y-auto pr-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2 pb-3">Doc ID / Receipt</th>
                  <th className="py-2 pb-3">Student Name</th>
                  <th className="py-2 pb-3">Deposit Segment</th>
                  <th className="py-2 pb-3">Gateway</th>
                  <th className="py-2 pb-3 text-right">Amount (MMK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50/30">
                      <td className="py-3">
                        <p className="font-semibold text-slate-800">{txn.id}</p>
                        <p className="text-[9px] text-slate-400">{txn.receiptNo}</p>
                      </td>
                      <td className="py-3 font-medium text-slate-700">
                        {txn.studentName}
                        <span className="block text-[9px] text-slate-400">{txn.studentId}</span>
                      </td>
                      <td className="py-3">
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-600">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800">
                        {txn.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      <AlertCircle className="h-6 w-6 mx-auto mb-1.5 text-slate-350" />
                      <p className="font-bold">No collections found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Payment collection Dialog */}
      <AnimatePresence>
        {isCollectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                  Collect Seminary Payment
                </h3>
                <button 
                  onClick={() => setIsCollectModalOpen(false)}
                  className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Select Enrolled Student *</label>
                  <select 
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-medium text-slate-700"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.id})
                      </option>
                    ))}
                  </select>
                </div>

                {targetStudentForPayment && (
                  <div className="bg-brand-blue-50/50 border border-brand-blue-100 rounded-xl p-3 space-y-1 animate-fade-in font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Semester Rate:</span>
                      <span className="font-bold text-slate-800">{targetStudentForPayment.totalFees.toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleared So Far:</span>
                      <span className="font-bold text-emerald-600">{targetStudentForPayment.paidFees.toLocaleString()} MMK</span>
                    </div>
                    <div className="flex justify-between border-t border-brand-blue-100/40 pt-1.5 font-bold text-slate-900">
                      <span>Outstanding Debt:</span>
                      <span className="text-rose-600">{outstandingBalance.toLocaleString()} MMK</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Deposit Amount (MMK) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 300000"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    max={outstandingBalance > 0 ? outstandingBalance : undefined}
                    className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-brand-blue-500 font-bold text-slate-800 text-sm"
                  />
                  {outstandingBalance > 0 && (
                    <button 
                      type="button"
                      onClick={() => setPaymentAmount(outstandingBalance.toString())}
                      className="text-[10px] text-brand-blue-500 hover:text-brand-blue-600 font-bold mt-1 inline-block"
                    >
                      Pay Full Debt Balance
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Deposit Category</label>
                    <select 
                      value={paymentCategory}
                      onChange={e => setPaymentCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-medium"
                    >
                      <option value="Tuition">Tuition Fee</option>
                      <option value="Dormitory">Dormitory</option>
                      <option value="Cafeteria">Cafeteria</option>
                      <option value="Registration">Registration Office</option>
                      <option value="Library">Library Fund</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Gateway Transfer</label>
                    <select 
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 p-2 bg-white outline-none focus:border-brand-blue-500 font-medium"
                    >
                      <option value="KBZPay">KBZPay App</option>
                      <option value="WaveMoney">WaveMoney</option>
                      <option value="CB Bank">CB Bank Transfer</option>
                      <option value="Cash">Cash Handover</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-3 text-[13px]">
                  <button 
                    type="button" 
                    onClick={() => setIsCollectModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition cursor-pointer shadow-md"
                  >
                    Post Payment Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
