import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Award,
  LayoutGrid,
  Plus,
  Trash2,
  X
} from "lucide-react";

// 1. pulling mock data arrays now
import { getStorageData, setStorageData, INITIAL_CLASSES, ACADEMIC_CLASSES_DATA, ACADEMIC_SUBJECTS_DATA, ACADEMIC_EXAMS_DATA } from "../data/schoolData";



const AdminAcademic = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("All Grade");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- STATE INITIALIZATION WITH LOCALSTORAGE CORES ---
  const [searchTerm, setSearchTerm] = useState("");
const [selectedGrade, setSelectedGrade] = useState("All");

// Helper to filter data based on both Search and Grade

const filterData = (data) => {
  return data.filter((item) => {
    // 1. Search Filter (Case insensitive)
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Grade Filter Logic
    let matchesGrade = true; // Default to true if "All" is selected

    if (selectedGrade !== "All") {
      if (activeTab === "classes") {
        matchesGrade = item.label === selectedGrade;
      } 
      else if (activeTab === "subjects") {
        matchesGrade = item.grade === selectedGrade;
      } 
      else if (activeTab === "exams") {
        // EXAM FIX: Extract the grade part from the "details" string 
        // e.g., "Grade 6 . English" -> "Grade 6"
        const extractedGrade = item.details.split(" . ")[0];
        matchesGrade = extractedGrade === selectedGrade;
      }
      else if (activeTab === "timetable") {
        // Timetable doesn't have a grade, so keep visible or filter as needed
        matchesGrade = true; 
      }
    }

    return matchesSearch && matchesGrade;
  });
};


  const [classesData, setClassesData] = useState(() => getStorageData("classes") || INITIAL_CLASSES);
  const [subjectsData, setSubjectsData] = useState(() => {  const data = getStorageData("subjects");
  // Only use localStorage if it actually contains items
  return (data && data.length > 0) ? data : ACADEMIC_SUBJECTS_DATA;
});
  const [examsData, setExamsData] = useState(() => getStorageData("exams") || ACADEMIC_EXAMS_DATA);
  const [timetableData, setTimetableData] = useState(() => getStorageData("timetable") || []);


  // --- PERSISTENCE WRAPPERS ---
  useEffect(() => { setStorageData("classes", classesData); }, [classesData]);
  useEffect(() => { setStorageData("subjects", subjectsData); }, [subjectsData]);
  useEffect(() => { setStorageData("exams", examsData); }, [examsData]);
  useEffect(() => { setStorageData("timetable", timetableData); }, [timetableData]);

  // --- EXTRACTION ENGINE FOR ALL LIVE LOOKUPS ---
  const uniqueGrades = [...new Set(classesData.map(item => item.label))
  ].filter(Boolean).sort();
  const uniqueTeachers = [...new Set([
    ...classesData.map(item => item.teacher),
    ...subjectsData.map(item => item.teacher),
    ...timetableData.map(item => item.teacher)
  ])].filter(Boolean).sort();

  const uniqueSubjectNames = [...new Set([
    ...subjectsData.map(item => item.name),
    ...timetableData.map(item => item.subject)
  ])].filter(Boolean).sort();

  const uniqueRooms = [...new Set([
    ...classesData.map(item => item.room),
    ...timetableData.map(item => item.room)
  ])].filter(Boolean).sort();

  const uniqueExamNames = [...new Set(examsData.map(item => item.name))].sort();
  const uniqueSections = [...new Set(classesData.map(item => item.section))].sort();

  // --- FORM STATE CONTAINER STRUCTURES ---
  const [classForm, setClassForm] = useState({ grade: "", section: "", room: "", count: "", teacher: "", time: "Mon - Fri 8:00-15:00" });
  const [subjectForm, setSubjectForm] = useState({ id: "", name: "", teacher: "", hours: "", grade: "" });
  const [examForm, setExamForm] = useState({ name: "", status: "Scheduled", date: "", grade: "", subject: "", tracking: "0 Passed" });
  const [timetableForm, setTimetableForm] = useState({ day: "Monday", time: "08:00 AM", subject: "", teacher: "", room: "" });

  // --- AUTO-POPULATE CONTROL MATRIX HOOK ---
  useEffect(() => {
    if (isModalOpen) {
      setClassForm(prev => ({
        ...prev,
        grade: prev.grade || uniqueGrades[0] || "Grade 1",
        section: prev.section || uniqueSections[0] || "Section A",
        room: prev.room || uniqueRooms[0] || "Room 101",
        teacher: prev.teacher || uniqueTeachers[0] || "Girijashree M"
      }));

      setSubjectForm(prev => ({
        ...prev,
        name: prev.name || uniqueSubjectNames[0] || "Mathematics",
        teacher: prev.teacher || uniqueTeachers[0] || "Girijashree M",
        grade: prev.grade || uniqueGrades[0] || "Grade 1"
      }));

      setTimetableForm(prev => ({
        ...prev,
        subject: prev.subject || uniqueSubjectNames[0] || "Mathematics",
        teacher: prev.teacher || uniqueTeachers[0] || "Girijashree M",
        room: prev.room || uniqueRooms[0] || "Room 101"
      }));

      setExamForm(prev => ({
        ...prev,
        name: prev.name || uniqueExamNames[0] || "Quarterly Examination",
        grade: prev.grade || uniqueGrades[0] || "Grade 1",
        subject: prev.subject || uniqueSubjectNames[0] || "Mathematics"
      }));
    }
  }, [isModalOpen, classesData, subjectsData, examsData]);


  const menuTabs = [
    { id: "classes", label: "Classes & sections", icon: <LayoutGrid size={16} /> },
    { id: "subjects", label: "Subjects", icon: <BookOpen size={16} /> },
    { id: "timetable", label: "Timetable", icon: <Calendar size={16} /> },
    { id: "exams", label: "Exams & Results", icon: <Award size={16} /> },
  ];

  // --- SUBMIT HANDLING PILLARS ---
  const handleAddClass = (e) => {
    e.preventDefault();
    const newClass = {
      ...classForm,
      id: Date.now(),
      name: `${classForm.grade} - ${classForm.section}`,
      label: classForm.grade,
      schedule: classForm.time,                            // ← maps time → schedule
      count: parseInt(classForm.count, 10) || 0,
      badgeColor: classForm.grade
    };
    setClassesData([...classesData, newClass]);
    setIsModalOpen(false);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const newSub = { ...subjectForm, hours: `${subjectForm.hours}h` };
    setSubjectsData([...subjectsData, newSub]);
    setIsModalOpen(false);
  };

  const handleAddTimetable = (e) => {
    e.preventDefault();
    const newSlot = { ...timetableForm, id: Date.now() };
    setTimetableData([...timetableData, newSlot]);
    setIsModalOpen(false);
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    const newExam = {
      id: Date.now(),
      name: examForm.name,
      status: examForm.status,
      date: examForm.date,
      details: `${examForm.grade} . ${examForm.subject}`,
      tracking: examForm.tracking
    };
    setExamsData([...examsData, newExam]);
    setIsModalOpen(false);
  };

  const getTimetableCell = (day, timeSlot) => {
    const match = timetableData.find(t => t.day === day && t.time === timeSlot);
    if (!match) return null;
    return (
      <div className="bg-blue-50/60 border-l-4 border-blue-500 p-3 rounded-r-xl text-left">
        <h4 className="font-extrabold text-blue-900 text-sm">{match.subject}</h4>
        <p className="text-gray-400 text-[11px] mt-0.5">👤 {match.teacher}</p>
        <p className="text-gray-400 text-[11px]">📍 {match.room}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">

      {/* ACTION BAR HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Academic Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Classes, subject, Timetable and exams</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3B4FEB] hover:bg-[#2A3DB5] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={16} strokeWidth={3} />
          {activeTab === "classes" && "Add Class"}
          {activeTab === "subjects" && "Add Subject"}
          {activeTab === "timetable" && "Add Period"}
          {activeTab === "exams" && "Add Exam"}
        </button>
      </div>

      {/* NAVIGATION TABS PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        {menuTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 border ${isSelected ? "bg-[#E6F5F5] text-gray-900 border-[#BCE3E3]" : "bg-white text-gray-600 hover:bg-gray-50 border-gray-100 shadow-sm"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

     {/* SEARCH & FILTER BAR - Aligned Left and Right */}
<div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
  
  {/* Search Input - Left Aligned */}
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          className="w-full sm:w-64 p-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#3B4FEB] shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown - Right Aligned */}
        <select 
          className="w-full sm:w-auto p-2.5 rounded-xl border border-gray-200 text-sm font-bold bg-white outline-none focus:border-[#3B4FEB] cursor-pointer"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="All">All Grades</option>
          {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>


      {/* VIEW 1: CLASSES SECTION GRID */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterData(classesData).map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><LayoutGrid size={20} /></div>
                <button onClick={() => setClassesData(classesData.filter(c => c.id !== item.id))} className="p-1.5 text-rose-400 hover:text-rose-600 transition"><Trash2 size={16} /></button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">{item.room}</p>
              </div>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                <div className="text-gray-500 font-bold text-xs">👤 {item.count} Students</div>
                {/* Access item.label or item.grade depending on your desired display */}
                <span className="bg-[#B0A2F1]/20 text-[#6C56E0] font-bold text-[11px] px-3 py-1 rounded-full">{item.label}</span>
              </div>
              <div className="mt-4 space-y-1 bg-gray-50/50 p-3 rounded-xl text-xs font-medium text-gray-600">
                <p><span className="text-gray-400">Class Teacher:</span> {item.teacher}</p>
                <p><span className="text-gray-400">Schedule:</span> {item.schedule}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: SUBJECTS LIST TABLE */}
      {activeTab === "subjects" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EBF5F5]/60 text-gray-800 text-xs font-black uppercase border-b border-gray-100">
                <th className="p-4">Subject Name</th>
                <th className="p-4">Code</th>
                <th className="p-4">Teacher</th>
                <th className="p-4">Hrs/Wk</th>
                <th className="p-4">Grade</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
              {filterData(subjectsData).map((sub, idx) => (
                <tr key={sub.id || idx}> 
                  <td className="p-4 text-sm font-extrabold text-gray-900">{sub.name}</td>

                  {/* FIX: was bg-gray-100/80 — opacity making text invisible */}
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[11px] font-mono font-semibold">
                      {sub.id}
                    </span>
                  </td>

                  {/* FIX: was bg-indigo-50/80 text-indigo-900 — washed out */}
                  <td className="p-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[11px] font-semibold">
                      {sub.teacher}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="bg-emerald-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px]">
                      ● {sub.hours}
                    </span>
                  </td>

                  {/* FIX: was plain text but rendering blank — ensure color is set */}
                  <td className="p-4 text-gray-700 font-semibold">{sub.grade}</td>

                  <td className="p-4 flex justify-center items-center">
                    <button
                      onClick={() => setSubjectsData(subjectsData.filter(s => s.id !== sub.id))}
                      className="p-1 text-rose-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* VIEW 3: TIMETABLE PERIOD SCHEDULER MATRIX */}
      {activeTab === "timetable" && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="text-gray-400 font-bold text-[11px] uppercase tracking-wider border-b border-gray-100">
                <th className="p-3 text-left w-24">Time</th>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => <th key={d} className="p-3 text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-center">
              {["08:00 AM", "09:00 AM", "10:30 AM"].map((slot) => (
                <tr key={slot}>
                  <td className="p-3 py-6 text-xs font-bold text-gray-400 text-left">{slot}</td>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                    <td key={day} className="p-2">
                      {getTimetableCell(day, slot) || (
                        <div onClick={() => { setTimetableForm({ ...timetableForm, day, time: slot }); setIsModalOpen(true); }} className="border border-dashed border-gray-200 rounded-xl p-4 text-gray-300 hover:bg-gray-50 cursor-pointer transition text-xs font-bold">+ Empty</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 4: EXAMS LIST TRACKS */}
      {activeTab === "exams" && (
        <div className="space-y-4">
          {filterData(examsData).map((exam) => (
            <div key={exam.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 transition hover:shadow-md">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0"><Award size={22} /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-gray-900 text-base leading-tight">{exam.name}</h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${exam.status === "Completed" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{exam.status}</span>
                  </div>
                  <p className="text-gray-400 text-xs font-semibold mt-1">{exam.date} <span className="mx-1.5 text-gray-200">|</span> {exam.details}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-gray-50">
                <span className="text-emerald-600 text-xs font-black tracking-wide bg-emerald-50 px-3 py-1.5 rounded-xl">{exam.tracking}</span>
                <button onClick={() => setExamsData(examsData.filter(e => e.id !== exam.id))} className="p-1.5 text-rose-400 hover:text-rose-600"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}




      {/* --- BACKDROP MODAL DISPATCH SYSTEM COMPONENT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative border border-gray-100 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-900 capitalize">Create New {activeTab} Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition"><X size={16} /></button>
            </div>

            {/* --- FORMS SUB-ENGINE 1: CLASSES MATRIX --- */}
            {activeTab === "classes" && (
              <form onSubmit={handleAddClass} className="space-y-3 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1 text-gray-500">Grade / Form Level</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white outline-none text-xs" value={classForm.grade} onChange={e => setClassForm({ ...classForm, grade: e.target.value })}>
                    {uniqueGrades.length > 0 ? uniqueGrades.map(g => <option key={g} value={g}>{g}</option>) : ["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Section Name</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white outline-none text-xs" value={classForm.section} onChange={e => setClassForm({ ...classForm, section: e.target.value })}>
                    {uniqueSections.length > 0 ? uniqueSections.map(s => <option key={s} value={s}>{s}</option>) : ["Section A", "Section B", "Section C"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Room Allocation</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white outline-none text-xs" value={classForm.room} onChange={e => setClassForm({ ...classForm, room: e.target.value })}>
                    {uniqueRooms.length > 0 ? uniqueRooms.map(r => <option key={r} value={r}>{r}</option>) : ["Room 101", "Room 103", "Room 205"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block mb-1 text-gray-500">Student Capacity</label><input required type="number" placeholder="30" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none text-xs" value={classForm.count} onChange={e => setClassForm({ ...classForm, count: e.target.value })} /></div>
                  <div>
                    <label className="block mb-1 text-gray-500">Primary Teacher</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white outline-none text-xs" value={classForm.teacher} onChange={e => setClassForm({ ...classForm, teacher: e.target.value })}>
                      {uniqueTeachers.length > 0 ? uniqueTeachers.map(t => <option key={t} value={t}>{t}</option>) : ["Girijashree M", "Karthik Raja"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#3B4FEB] text-white p-3 rounded-xl font-black mt-4 text-xs tracking-wide">Save Dynamic Class Card</button>
              </form>
            )}

            {/* --- FORMS SUB-ENGINE 2: SUBJECTS MATRIX --- */}
            {activeTab === "subjects" && (
              <form onSubmit={handleAddSubject} className="space-y-3 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1 text-gray-500">Subject Title</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}>
                    {uniqueSubjectNames.length > 0 ? uniqueSubjectNames.map(s => <option key={s} value={s}>{s}</option>) : ["Mathematics", "Science", "English", "History", "Arts"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block mb-1 text-gray-500">Unique Code Index</label><input required type="text" placeholder="e.g., CHEM102" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none" value={subjectForm.id} onChange={e => setSubjectForm({ ...subjectForm, id: e.target.value })} /></div>
                <div>
                  <label className="block mb-1 text-gray-500">Assigned Educator</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={subjectForm.teacher} onChange={e => setSubjectForm({ ...subjectForm, teacher: e.target.value })}>
                    {uniqueTeachers.length > 0 ? uniqueTeachers.map(t => <option key={t} value={t}>{t}</option>) : ["Girijashree M", "Karthik Raja"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block mb-1 text-gray-500">Hours per Week</label><input required type="number" placeholder="5" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none" value={subjectForm.hours} onChange={e => setSubjectForm({ ...subjectForm, hours: e.target.value })} /></div>
                  <div>
                    <label className="block mb-1 text-gray-500">Target Grade</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={subjectForm.grade} onChange={e => setSubjectForm({ ...subjectForm, grade: e.target.value })}>
                      {uniqueGrades.length > 0 ? uniqueGrades.map(g => <option key={g} value={g}>{g}</option>) : ["Grade 5", "Grade 6"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#3B4FEB] text-white p-3 rounded-xl font-black mt-4 text-xs">Register Subject</button>
              </form>
            )}

            {/* --- FORMS SUB-ENGINE 3: WEEKLY TIMETABLE MATRIX --- */}
            {activeTab === "timetable" && (
              <form onSubmit={handleAddTimetable} className="space-y-3 text-xs font-bold text-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block mb-1 text-gray-500">Target Weekday</label><select className="w-full border border-gray-200 rounded-xl p-2.5 text-xs bg-white" value={timetableForm.day} onChange={e => setTimetableForm({ ...timetableForm, day: e.target.value })}>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(d => <option key={d}>{d}</option>)}</select></div>
                  <div><label className="block mb-1 text-gray-500">Time Window Slot</label><select className="w-full border border-gray-200 rounded-xl p-2.5 text-xs bg-white" value={timetableForm.time} onChange={e => setTimetableForm({ ...timetableForm, time: e.target.value })}>{["08:00 AM", "09:00 AM", "10:30 AM"].map(t => <option key={t}>{t}</option>)}</select></div>
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Subject Name</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={timetableForm.subject} onChange={e => setTimetableForm({ ...timetableForm, subject: e.target.value })}>
                    {uniqueSubjectNames.length > 0 ? uniqueSubjectNames.map(s => <option key={s} value={s}>{s}</option>) : ["Mathematics", "Science"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Teacher Name</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={timetableForm.teacher} onChange={e => setTimetableForm({ ...timetableForm, teacher: e.target.value })}>
                    {uniqueTeachers.length > 0 ? uniqueTeachers.map(t => <option key={t} value={t}>{t}</option>) : ["Girijashree M", "Karthik Raja"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-500">Location Room</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={timetableForm.room} onChange={e => setTimetableForm({ ...timetableForm, room: e.target.value })}>
                    {uniqueRooms.length > 0 ? uniqueRooms.map(r => <option key={r} value={r}>{r}</option>) : ["Room 101", "Room 205"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#3B4FEB] text-white p-3 rounded-xl font-black mt-4 text-xs">Publish Period Block</button>
              </form>
            )}

            {/* --- FORMS SUB-ENGINE 4: EXAM RESULTS MATRIX --- */}
            {activeTab === "exams" && (
              <form onSubmit={handleAddExam} className="space-y-3 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1 text-gray-500">Assessment Name</label>
                  <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={examForm.name} onChange={e => setExamForm({ ...examForm, name: e.target.value })}>
                    {uniqueExamNames.length > 0 ? uniqueExamNames.map(eName => <option key={eName} value={eName}>{eName}</option>) : ["English Writing Assessment", "Unit Test Mathematics", "Mid Term Examination"].map(eName => <option key={eName} value={eName}>{eName}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-gray-500">Target Grade</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={examForm.grade} onChange={e => setExamForm({ ...examForm, grade: e.target.value })}>
                      {uniqueGrades.length > 0 ? uniqueGrades.map(g => <option key={g} value={g}>{g}</option>) : ["Grade 5", "Grade 6"].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-500">Subject Track</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-xs outline-none" value={examForm.subject} onChange={e => setExamForm({ ...examForm, subject: e.target.value })}>
                      {uniqueSubjectNames.length > 0 ? uniqueSubjectNames.map(s => <option key={s} value={s}>{s}</option>) : ["Mathematics", "English"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="block mb-1 text-gray-500">Schedule Date Range</label><input required type="text" placeholder="e.g., June 18-22 2026" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block mb-1 text-gray-500">Current Status</label><select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white outline-none" value={examForm.status} onChange={e => setExamForm({ ...examForm, status: e.target.value })}><option>Scheduled</option><option>Completed</option></select></div>
                  <div><label className="block mb-1 text-gray-500">Pass Matrix Summary</label><input required type="text" placeholder="e.g., 6/8 Passed" className="w-full border border-gray-200 rounded-xl p-2.5 outline-none" value={examForm.tracking} onChange={e => setExamForm({ ...examForm, tracking: e.target.value })} /></div>
                </div>
                <button type="submit" className="w-full bg-[#3B4FEB] text-white p-3 rounded-xl font-black mt-4 text-xs">Append Exam Metric</button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAcademic;