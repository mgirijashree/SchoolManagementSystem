import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Calendar, ChevronDown, Download, Check, X, Clock, HelpCircle, Save 
} from "lucide-react";
import { getStorageData, setStorageData, AVAILABLE_GRADES } from "../data/schoolData";
import * as XLSX from 'xlsx';

const AdminAttendance = () => {
  // --- STATE HOARDS ---
  const [activeTab, setActiveTab] = useState("student"); // "student" or "staff"
  const [studentRecords, setStudentRecords] = useState([]);
  const [staffRecords, setStaffRecords] = useState([]);
  
  // --- FILTER CONTEXT CONTROLS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-04-14"); // YYYY-MM-DD standard matching image
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  // Load datasets uniformly via local storage wrapper keys on mounting
  useEffect(() => {
    const students = getStorageData("student_attendance");
    const staff = getStorageData("staff_attendance");
    setStudentRecords(students);
    setStaffRecords(staff);
  }, []);

  // --- CORE FILTER ENGINE ---
  const currentDataset = activeTab === "student" ? studentRecords : staffRecords;

  const filteredRecords = useMemo(() => {
    return currentDataset.filter((record) => {
      // 1. Key-stroke search check against Name or Roll Number index
      const matchesSearch = 
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Exact match date check
      const matchesDate = record.date === selectedDate;

      // 3. Dropdown Grade selection filter (Skipped for staff rosters)
      const matchesGrade = 
        activeTab === "staff" || 
        selectedGrade === "All Grades" || 
        record.gradeGroup === selectedGrade;

      return matchesSearch && matchesDate && matchesGrade;
    });
  }, [currentDataset, searchQuery, selectedDate, selectedGrade, activeTab]);

  // --- DYNAMIC COUNTERS (Computed strictly off current filtered display subset) ---
  const dynamicMetrics = useMemo(() => {
    const counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
    filteredRecords.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    return counts;
  }, [filteredRecords]);


  const exportToExcel = () => {
  if (filteredRecords.length === 0) {
    alert("No data available to export.");
    return;
  }

  // --- IN-PLACE ROW INTERACTION HANDLERS ---
  const handleStatusChange = (id, newStatus) => {
    if (activeTab === "student") {
      setStudentRecords(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } else {
      setStaffRecords(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleRemarkChange = (id, updatedText) => {
    if (activeTab === "student") {
      setStudentRecords(prev => prev.map(item => item.id === id ? { ...item, remarks: updatedText } : item));
    } else {
      setStaffRecords(prev => prev.map(item => item.id === id ? { ...item, remarks: updatedText } : item));
    }
  };

  // --- PERSISTENCE: SAVE BATCH STORAGE ROUTINE ---
  const saveBatchToStorage = () => {
    setStorageData("student_attendance", studentRecords);
    setStorageData("staff_attendance", staffRecords);
    alert(`Success: ${activeTab === "student" ? "Student" : "Staff"} Batch Saved Successfully!.`);
  };

  // --- EXPORT: EXCEL DATA MATRIX PARSER GENERATOR ---
  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      alert("Operational halt: No data available to export .");
      return;
    }

    // Compose CSV Text Block Stream Header entries
    const headers = ["Student/Staff Name", "Roll/ID No", "Assigned Class Group", "Current Status Flag", "Remarks Description", "Captured Log Date\n"];
    const rows = filteredRecords.map(r => 
      `"${r.name}","${r.rollNo}","${r.class}","${r.status}","${r.remarks || ''}","${r.date}"\n`
    );

    const blobStream = new Blob([headers.join(",") + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const dynamicURL = URL.createObjectURL(blobStream);
    const linkElement = document.createElement("a");
    
    linkElement.setAttribute("href", dynamicURL);
    linkElement.setAttribute("download", `Attendance_Report_${activeTab}_export_${selectedDate}.csv`);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };


  // 1. Map your filtered records to a clean structure for Excel
  const dataToExport = filteredRecords.map(r => ({
    "Name": r.name,
    "Roll/ID No": r.rollNo,
    "Class Group": r.class,
    "Status": r.status,
    "Remarks": r.remarks || '',
    "Date": r.date
  }));

  // 2. Create the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // 3. Generate and trigger download
  XLSX.writeFile(workbook, `Attendance_Report_${activeTab}_${selectedDate}.xlsx`);
};


  return (
    <div className="p-6 space-y-6 w-full max-w-[1400px] mx-auto text-gray-800">
      
      {/* HEADER META PANEL SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Attendance</h1>
          <p className="text-gray-500 text-xs mt-0.5 font-medium">Track and manage student and staff attendance rosters seamlessly</p>
        </div>
        <button 
  onClick={exportToExcel}
  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-gray-200 shadow-sm transition-all"
>
  <Download size={15} /> Export Excel
</button>
      </div>

      {/* VIEW DIVISION TAB SELECTORS */}
      <div className="flex items-center bg-gray-100/70 p-1 rounded-2xl w-fit border border-gray-200/40">
        <button
          onClick={() => { setActiveTab("student"); setSelectedGrade("All Grades"); }}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTab === "student" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          🎓 Student Attendance
        </button>
        <button
          onClick={() => { setActiveTab("staff"); setSelectedGrade("Staff"); }}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTab === "staff" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          📖 Staff Attendance
        </button>
      </div>

      {/* --- DYNAMIC STATS MATRICES DISPLAY --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Present", count: dynamicMetrics.Present, border: "border-l-emerald-500", bg: "bg-emerald-50 text-emerald-600", icon: <Check size={18} strokeWidth={3} /> },
          { label: "Absent", count: dynamicMetrics.Absent, border: "border-l-rose-500", bg: "bg-rose-50 text-rose-600", icon: <X size={18} strokeWidth={3} /> },
          { label: "Late", count: dynamicMetrics.Late, border: "border-l-amber-500", bg: "bg-amber-50 text-amber-600", icon: <Clock size={18} /> },
          { label: "Excused", count: dynamicMetrics.Excused, border: "border-l-blue-500", bg: "bg-blue-50 text-blue-600", icon: <HelpCircle size={18} /> },
        ].map((card, idx) => (
          <div key={idx} className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 ${card.border}`}>
            <div className={`p-3 rounded-xl ${card.bg}`}>{card.icon}</div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{card.count}</h3>
              <p className="text-gray-400 font-bold text-xs mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- LIVE INTERACTION QUERY FILTERS --- */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center bg-transparent pt-2">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Key stroke search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'student' ? 'Student' : 'Staff'} or roll no......`}
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date Picker Input */}
          <div className="relative w-full sm:w-auto flex items-center bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar size={14} className="text-gray-500 mr-2" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-gray-800 outline-none cursor-pointer bg-transparent"
            />
          </div>

          {/* Grade Dropdown (Only for students) */}
          {activeTab === "student" && (
            <div className="relative w-full sm:w-auto bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between gap-4 shadow-sm">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                📁 {selectedGrade}
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer font-bold"
              >
                {AVAILABLE_GRADES.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Save Batch Button */}
        <button
          onClick={saveBatchToStorage}
          className="w-full lg:w-auto bg-[#1E3BB3] hover:bg-[#162b87] text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
        >
          <Save size={14} /> Save Batch
        </button>
      </div>

      {/* --- ATTENDANCE ROSTER TABLE --- */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EBF3F5] text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-100">
                <th className="py-3 px-5">{activeTab === "student" ? "Student" : "Staff Member"}</th>
                <th className="py-3 px-5">Roll No</th>
                <th className="py-3 px-5">Class Group</th>
                <th className="py-3 px-5 text-center">Status Flag Selector</th>
                <th className="py-3 px-5">Remarks Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {filteredRecords.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-gray-900">{row.name}</td>
                  <td className="py-3.5 px-5 font-mono text-gray-500">{row.rollNo}</td>
                  <td className="py-3.5 px-5 text-gray-600">{row.class}</td>
                  
                  {/* Status Toggle Button Bar */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-100 p-1 rounded-xl w-fit mx-auto">
                      {[
                        { name: "Present", style: "bg-emerald-50 border-emerald-200 text-emerald-700", label: "✓ Present" },
                        { name: "Absent", style: "bg-rose-50 border-rose-200 text-rose-700", label: "✕ Absent" },
                        { name: "Late", style: "bg-amber-50 border-amber-200 text-amber-700", label: "🕒 Late" }
                      ].map((btn) => {
                        const isCurrent = row.status === btn.name;
                        return (
                          <button
                            key={btn.name}
                            onClick={() => handleStatusChange(row.id, btn.name)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all border ${isCurrent ? `${btn.style} shadow-sm scale-[1.02]` : "bg-white border-gray-200 text-gray-500 hover:text-gray-800"}`}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Remarks Input Text Field */}
                  <td className="py-3.5 px-5">
                    <input
                      type="text"
                      value={row.remarks || ""}
                      onChange={(e) => handleRemarkChange(row.id, e.target.value)}
                      placeholder="Add remarks description entry..."
                      className="w-full max-w-[200px] bg-[#F4F9F9] border border-gray-200/60 rounded-lg px-2.5 py-1.5 text-xs font-normal outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-medium bg-gray-50/20">
                    No data found .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;