import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Download, ChevronDown, Bell, CreditCard, 
  AlertCircle, FileText, Trash2, Edit 
} from "lucide-react";
import { getStorageData, setStorageData } from "../data/schoolData";

const AdminFee = () => {
  const [activeTab, setActiveTab] = useState("categories");
  
  // States
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pendingDues, setPendingDues] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All Months");

  // Inline editing states for modal toggles
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    try {
      const fetchedCategories = getStorageData("fee_categories");
      const fetchedPayments = getStorageData("fee_payments");
      const fetchedPending = getStorageData("fee_pending");

      if (Array.isArray(fetchedCategories)) setCategories(fetchedCategories);
      if (Array.isArray(fetchedPayments)) setPayments(fetchedPayments);
      if (Array.isArray(fetchedPending)) setPendingDues(fetchedPending);
    } catch (error) {
      console.error("Failed to parse schoolData metrics inside AdminFee on mount:", error);
    }
  }, []);

  // Safe Math Computations using fallback protection loops
  const statistics = useMemo(() => {
    const totalCollected = (payments || [])
      .filter(p => p?.status === "Paid")
      .reduce((sum, curr) => sum + (Number(curr?.amount) || 0), 0);

    const totalOutstanding = (pendingDues || [])
      .reduce((sum, curr) => sum + (Number(curr?.dueAmount) || 0), 0);

    const activeOverdue = (pendingDues || [])
      .filter(p => p?.status === "Overdue")
      .reduce((sum, curr) => sum + (Number(curr?.dueAmount) || 0), 0);

    return { totalCollected, totalOutstanding, activeOverdue };
  }, [payments, pendingDues]);

  // Safe text query comparison with Optional Chaining
  const filteredData = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    if (activeTab === "categories") {
      return (categories || []).filter(c => c?.name?.toLowerCase().includes(searchLower));
    }
    
    if (activeTab === "payments") {
      return (payments || []).filter(p => {
        const matchesSearch = 
          p?.studentName?.toLowerCase().includes(searchLower) || 
          p?.studentId?.toLowerCase().includes(searchLower);
        
        const matchesMonth = 
          selectedMonth === "All Months" || 
          (p?.paidDate && String(p.paidDate).toLowerCase().includes(selectedMonth.toLowerCase()));
          
        return matchesSearch && matchesMonth;
      });
    }

    if (activeTab === "pending") {
      return (pendingDues || []).filter(d => 
        d?.studentName?.toLowerCase().includes(searchLower) || 
        d?.studentId?.toLowerCase().includes(searchLower)
      );
    }

    return [];
  }, [activeTab, categories, payments, pendingDues, searchQuery, selectedMonth]);

  // ACTION FUNCTIONALITIES

  // Open Edit Modality Context
  const startEditCategory = (category) => {
    setEditingCategory(category);
    setEditName(category.name || "");
    setEditAmount(category.amount || 0);
  };

  // Save Category Inline Updates
  const saveCategoryUpdate = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editAmount) return;

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id 
        ? { ...cat, name: editName, amount: Number(editAmount) } 
        : cat
    );

    setCategories(updatedCategories);
    setStorageData("fee_categories", updatedCategories);
    setEditingCategory(null);
  };

  // Delete Category Row 
  const handleDeleteCategory = (categoryId, categoryName) => {
    const confirmed = window.confirm(`Are you sure you want to remove the "${categoryName}" fee structure layout?`);
    if (!confirmed) return;

    const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
    setCategories(updatedCategories);
    setStorageData("fee_categories", updatedCategories);
  };

  const handleExportData = () => {
    if (filteredData.length === 0) return alert("No matching records found to export.");
    
    let headings = [];
    let extractionRows = [];

    if (activeTab === "categories") {
      headings = ["Category Name", "Applicable Bracket", "Type Interval", "Amount ($)"];
      extractionRows = filteredData.map(c => `"${c?.name || ''}","${c?.gradeRange || ''}","${c?.type || ''}","${c?.amount || 0}"`);
    } else if (activeTab === "payments") {
      headings = ["Student Name", "ID Context", "Class Group", "Fee Item Type", "Receipt No", "Amount", "Paid Date", "Status", "Gateway"];
      extractionRows = filteredData.map(p => `"${p?.studentName || ''}","${p?.studentId || ''}","${p?.class || ''}","${p?.feeType || ''}","${p?.receiptNo || ''}","${p?.amount || 0}","${p?.paidDate || ''}","${p?.status || ''}","${p?.method || ''}"`);
    } else {
      headings = ["Student Name", "ID Context", "Class Group", "Fee Item Type", "Due Balance", "Interval Overdue", "Deadline Date", "Status Flag"];
      extractionRows = filteredData.map(d => `"${d?.studentName || ''}","${d?.studentId || ''}","${d?.class || ''}","${d?.feeType || ''}","${d?.dueAmount || 0}","${d?.daysOverdue || ''}","${d?.dueDate || ''}","${d?.status || ''}"`);
    }

    const csvBlob = new Blob([headings.join(",") + "\n" + extractionRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const directURL = URL.createObjectURL(csvBlob);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", directURL);
    linkElement.setAttribute("download", `EduSmart_Fees_${activeTab}_Report.csv`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  const triggerAlertReminder = (name) => {
    alert(`Reminder Dispatched for: ${name}.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 w-full max-w-[1400px] mx-auto text-gray-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Fee Management</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Track fees structure,payments and pending payments.</p>
        </div>
        <button 
          onClick={handleExportData}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all"
        >
          <Download size={15} /> Export Excel
        </button>
      </div>

      {/* METRIC SUMMATION STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><CreditCard size={18} /></div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-none">${statistics.totalCollected.toLocaleString()}</h3>
            <p className="text-gray-400 font-bold text-[11px] mt-1">Total collected</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><FileText size={18} /></div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-none">${statistics.totalOutstanding.toLocaleString()}</h3>
            <p className="text-gray-400 font-bold text-[11px] mt-1">Pending/Partial</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600"><AlertCircle size={18} /></div>
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-none">${statistics.activeOverdue.toLocaleString()}</h3>
            <p className="text-gray-400 font-bold text-[11px] mt-1">Total overdue</p>
          </div>
        </div>
      </div>

      {/* TABS INTERACTION ROW */}
      <div className="flex items-center bg-gray-100/70 p-1 rounded-2xl w-fit border border-gray-200/40">
        <button
          onClick={() => { setActiveTab("categories"); setSearchQuery(""); }}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${activeTab === "categories" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          📖 Fee Structure
        </button>
        <button
          onClick={() => { setActiveTab("payments"); setSearchQuery(""); }}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${activeTab === "payments" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          💳 Payments History
        </button>
        <button
          onClick={() => { setActiveTab("pending"); setSearchQuery(""); }}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${activeTab === "pending" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          ⚠️ Pending Dues
        </button>
      </div>

        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Fee Categories</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Define and manage school fee categories.</p>
        </div>

      {/* SEARCH STRIP TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching fields..."
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {activeTab === "payments" && (
          <div className="relative bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-4 shadow-xs">
            <span className="text-xs font-bold text-gray-700">📅 {selectedMonth}</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value="All Months">All Months</option>
              <option value="Oct">Oct Logs</option>
              <option value="Nov">Nov Logs</option>
            </select>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG CONTAINER */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={saveCategoryUpdate} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-black text-gray-900">Modify Fee Target Sizing</h3>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Label Title</label>
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 mt-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Amount ($)</label>
              <input 
                type="number" 
                value={editAmount} 
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 mt-1 text-xs outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-1.5 text-xs font-bold shadow-xs hover:bg-blue-700">Save Modifications</button>
            </div>
          </form>
        </div>
      )}

      {/* GRID AND LIST VIEWS DISPLAY SHEET */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {activeTab === "categories" && (
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50/20">
            {filteredData.map((fee) => (
              <div key={fee.id} className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between group relative hover:border-blue-400 transition-all">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-blue-50 text-[#1E3BB3] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{fee.gradeRange}</span>
                    <div className="flex items-center gap-0.5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditCategory(fee)}
                        className="p-1 text-gray-400 hover:text-[#1E3BB3] transition-colors"
                        title="Edit Structure"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(fee.id, fee.name)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Remove Structure"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-2.5 truncate">{fee.name}</h4>
                  <span className="text-[9px] text-emerald-600 bg-emerald-50/70 font-bold px-1.5 py-0.5 rounded-sm mt-1 inline-block uppercase tracking-wide">{fee.type}</span>
                </div>
                <div className="text-lg font-black text-gray-900 mt-4 pt-2 border-t border-gray-50 flex justify-between items-end">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Rate</span>
                  <span className="text-gray-900">${fee.amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EBF3F5] text-gray-500 uppercase text-[10px] font-bold border-b">
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Grade Group</th>
                  <th className="py-3 px-5">Type</th>
                  <th className="py-3 px-5">Receipt Index</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Paid Date</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-semibold text-gray-700">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/40">
                    <td className="py-3 px-5">
                      <div className="font-bold text-gray-900">{row.studentName}</div>
                      <div className="text-[10px] font-mono text-gray-400">{row.studentId}</div>
                    </td>
                    <td className="py-3 px-5 text-gray-600">{row.class}</td>
                    <td className="py-3 px-5 font-medium">{row.feeType}</td>
                    <td className="py-3 px-5 font-mono text-gray-400">{row.receiptNo}</td>
                    <td className="py-3 px-5 font-black text-gray-900">${row.amount?.toLocaleString()}</td>
                    <td className="py-3 px-5 text-gray-500">{row.paidDate}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-0.5 text-[10px] rounded border ${
                        row.status === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "pending" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EBF3F5] text-gray-500 uppercase text-[10px] font-bold border-b">
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Grade Group</th>
                  <th className="py-3 px-5">Fee Category</th>
                  <th className="py-3 px-5">Due Amount</th>
                  <th className="py-3 px-5">Days Overdue</th>
                  <th className="py-3 px-5">Due Date</th>
                  <th className="py-3 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-semibold text-gray-700">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/40">
                    <td className="py-3 px-5">
                      <div className="font-bold text-gray-900">{row.studentName}</div>
                      <div className="text-[10px] font-mono text-gray-400">{row.studentId}</div>
                    </td>
                    <td className="py-3 px-5 text-gray-600">{row.class}</td>
                    <td className="py-3 px-5 font-medium">{row.feeType}</td>
                    <td className="py-3 px-5 font-black text-rose-600">${row.dueAmount?.toLocaleString()}</td>
                    <td className="py-3 px-5 text-rose-700 font-mono font-bold">{row.daysOverdue || "-"}</td>
                    <td className="py-3 px-5 text-gray-500">{row.dueDate}</td>
                    <td className="py-3 px-5 text-center">
                      <button 
                        onClick={() => triggerAlertReminder(row.studentName)}
                        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-[#1E3BB3] transition-all"
                      >
                        <Bell size={12} /> Remind Parent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="py-16 text-center text-gray-400 font-medium">
            No matching data records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFee;