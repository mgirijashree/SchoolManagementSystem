import React, { useState, useEffect } from "react";
import {
  Users, BookOpen, IndianRupee, Plus, GraduationCap, TrendingUp, 
  Clock, Check, X, AlertTriangle, Bell
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from "recharts";
import { getStorageData, setStorageData, ATTENDANCE_CHART_DATA, FEE_CHART_DATA } from "../data/schoolData";


const AdminDashboard = ({ onNavigate }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");
  const [showAnnounceBox, setShowAnnounceBox] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "", email: "", grade: "Grade 5", section: "A", guardian: "", relationship: "Father", status: "Active"
  });


  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    try {
      setStudents(getStorageData("students") ?? []);
      setClasses(getStorageData("classes") ?? []);
      setActivities(getStorageData("activities") ?? []);
      setAlerts(getStorageData("alerts") ?? []);
      setApprovals(getStorageData("approvals") ?? []);

      
    } catch (error) {
      console.error("Storage Load Error:", error);
    }
  }, []);

  const handleApprovalAction = (id, action) => {
    const target = approvals.find(i => i.id === id);
    if (!target) return;

    const freshApprovals = approvals.filter(item => item.id !== id);
    setApprovals(freshApprovals);
    setStorageData("approvals", freshApprovals);

    const log = {
      id: Date.now(),
      title: `${action === 'approve' ? 'Approved' : 'Rejected'} action request from ${target.name}`,
      user: "Admin Shree", time: "Just now", initials: "AS"
    };
    
    const updatedLogs = [log, ...activities];
    setActivities(updatedLogs);
    setStorageData("activities", updatedLogs);
  };

  const submitAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newLog = {
      id: Date.now(),
      title: `Broadcast: "${announcementText}"`,
      user: "Admin Shree", time: "Just now", initials: "AS"
    };

    const updatedActivities = [newLog, ...activities];
    setActivities(updatedActivities);
    setStorageData("activities", updatedActivities);
    setAnnouncementText("");
    setShowAnnounceBox(false);
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.guardian) {
      alert("Please populate all required field paths before saving.");
      return;
    }

    // Fixed ID evaluation layout cleanly matching your pipeline logic
    const nextNum = students.length > 0
      ? Math.max(...students.map((s) => Number(s.id?.replace("STU-", "")) || 24000)) + 1
      : 24001;
      
    const computedId = `STU-${nextNum}`;

    const studentPayload = {
      id: computedId,
      name: newStudent.name,
      email: newStudent.email,
      grade: `${newStudent.grade} · ${newStudent.section}`,
      guardian: newStudent.guardian,
      relationship: newStudent.relationship,
      status: newStudent.status,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newStudent.name)}&background=E59B33&color=fff`
    };

    const updatedStudentsList = [studentPayload, ...students];
    setStudents(updatedStudentsList);
    setStorageData("students", updatedStudentsList);

    const systemActivityLog = {
      id: Date.now(),
      title: `${newStudent.name} admitted to ${newStudent.grade} · ${newStudent.section}`,
      user: "Admin Shree", time: "3 minutes ago", initials: "AS"
    };
    const refreshedActivities = [systemActivityLog, ...activities];
    setActivities(refreshedActivities);
    setStorageData("activities", refreshedActivities);

    setNewStudent({
      name: "", email: "", grade: "Grade 5", section: "A", guardian: "", relationship: "Father", status: "Active"
    });
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 bg-[#F4F9F9] min-h-screen relative">
      
      

      {/* Workspace Panel Container */}
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Title Block Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, <span className="text-[#E59B33] font-bold">Admin</span>. Here's What's happening today.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button onClick={() => setShowAddModal(true)} className="flex-1 sm:flex-initial bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full shadow-sm hover:bg-gray-50 font-bold text-sm flex items-center justify-center gap-2 transition">
              <Plus size={16} /> Add Student
            </button>
            <button onClick={() => setShowAnnounceBox(!showAnnounceBox)} className="flex-1 sm:flex-initial bg-[#E59B33] hover:bg-[#c98322] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition">
              New Announcement
            </button>
          </div>
        </div>

        {/* Announcement Dispatch Area */}
        {showAnnounceBox && (
          <form onSubmit={submitAnnouncement} className="p-4 bg-white border border-[#E59B33]/20 rounded-2xl shadow-sm space-y-3">
            <label className="block text-sm font-bold text-gray-700">Broadcast Announcement to Notice Board Activity Feed</label>
            <input 
              type="text" 
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Type urgent notices here..." 
              className="w-full bg-[#F4F9F9] border p-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#E59B33]"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAnnounceBox(false)} className="px-4 py-1.5 text-xs font-bold text-gray-500">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-[#E59B33] text-white text-xs font-bold rounded-lg">Publish Notice</button>
            </div>
          </form>
        )}

        {/* --- ROW 1: METRICS SUMMARY CARDS --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Total Enrolled", value: students.length, subtitle: "Students this year", icon: <GraduationCap />, growth: "+3.5%" },
            { title: "Total Staff", value: "85", subtitle: "Active employees", icon: <Users />, growth: "+1.2%" },
            { title: "Total Classes", value: classes.length, subtitle: "Across all grades", icon: <BookOpen />, growth: "+0.8%" },
            { title: "Total Revenue", value: "₹152K", subtitle: "Collected this month", icon: <IndianRupee />, growth: "+5.1%" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-[#E59B33]">
              <div className="flex justify-between items-start">
                <div className="bg-amber-50 p-2.5 rounded-xl text-[#E59B33]">{item.icon}</div>
                <span className="bg-green-50 text-green-700 font-bold text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5"><TrendingUp size={12} /> {item.growth}</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mt-3 tracking-tight">{item.value}</h2>
              <h4 className="text-gray-700 font-bold text-sm mt-1">{item.title}</h4>
              <p className="text-gray-400 text-xs mt-0.5">{item.subtitle}</p>
            </div>
          ))}
        </section>

        {/* --- ROW 2: CHARTS VISUALISATIONS --- */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
  {/* Attendance Chart Card */}
  <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900">Attendance overview</h3>
      <p className="text-gray-400 text-sm mt-0.5">Last 7 days across all classes</p>
    </div>
    
    {/* Layout container wrapper holding safe dimensions */}
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-4">
      {isMounted && (
        <ResponsiveContainer width="100%" aspect={1.85}>
          <AreaChart data={ATTENDANCE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="day" 
              tickLine={false} 
              axisLine={{ stroke: '#000000', strokeWidth: 1.5 }} 
              tick={{ fill: '#000000', fontWeight: 'bold', fontSize: 12 }} 
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 25, 50, 75, 100]} 
              tickFormatter={(v) => `${v}%`} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#000000', fontWeight: 'bold', fontSize: 11 }} 
            />
            <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
            <Area 
              type="monotone" 
              dataKey="attendance" 
              stroke="#E59B33" 
              strokeWidth={3} 
              fill="none" 
              dot={{ fill: '#E59B33', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }} 
              activeDot={{ r: 7 }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

  {/* Fee Chart Card */}
  <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900">Fee collection</h3>
      <p className="text-gray-400 text-sm mt-0.5">Monthly collection K</p>
    </div>
    
    {/* Layout container wrapper holding safe dimensions */}
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-4">
      {isMounted && (
        <ResponsiveContainer width="100%" aspect={1.85}>
          <BarChart data={FEE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={{ stroke: '#9CA3AF' }} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <YAxis 
              domain={[0, 100]} 
              ticks={[0, 20, 40, 60, 80, 100]} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip />
            <Bar dataKey="Collected" barSize={32} radius={[16, 16, 16, 16]} background={{ fill: '#F4F5FA', radius: 16 }}>
              {FEE_CHART_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#F0C285" /> 
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div className="flex justify-center items-center gap-2 mt-4">
        <div className="w-2.5 h-2.5 bg-[#F0C285] rounded-xs" />
        <span className="text-xs font-bold text-gray-600">Collected</span>
      </div>
    </div>
  </div>

</section>

        {/* --- ROW 3: DETAILED OPERATIONAL FLOW LISTS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Logs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity Logs</h3>
            <div className="space-y-4 flex-1 max-h-[320px] overflow-y-auto pr-1">
              {activities.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {item.initials || "AS"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm leading-snug">{item.title}</h4>
                    <p className="text-gray-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <Clock size={12} /> {item.user || "Admin Shree"} · {item.time || "Just now"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Notifications</h3>
            <div className="space-y-3 flex-1 max-h-[320px] overflow-y-auto pr-1">
              {alerts.map((item) => {
                const isWarning = item.variant === "warning";
                return (
                  <div key={item.id} className={`border rounded-xl p-3.5 flex gap-3 items-start ${isWarning ? "bg-amber-50/50 border-amber-200" : "bg-gray-50/70 border-gray-100"}`}>
                    <div className={`p-2 rounded-full flex-shrink-0 ${isWarning ? "bg-amber-100 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
                      {isWarning ? <AlertTriangle size={14} /> : <Bell size={14} />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isWarning ? "text-amber-900" : "text-gray-900"}`}>{item.title}</h4>
                      <p className={`text-xs mt-0.5 leading-normal ${isWarning ? "text-amber-700" : "text-gray-500"}`}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Verifications ({approvals.length})</h3>
            <div className="space-y-3 flex-1 max-h-[320px] overflow-y-auto pr-1">
              {approvals.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-xl p-3 bg-white space-y-3 shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{item.name}</h4>
                      <p className="text-gray-400 text-[11px] mt-0.5">{item.request}</p>
                    </div>
                    <span className="bg-amber-50 text-[#c98322] border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      {item.badge}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprovalAction(item.id, 'approve')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1.5 rounded-lg font-bold flex items-center justify-center gap-0.5 transition">
                      <Check size={12} strokeWidth={3} /> Approve
                    </button>
                    <button onClick={() => handleApprovalAction(item.id, 'reject')} className="flex-1 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] py-1.5 rounded-lg font-bold flex items-center justify-center gap-0.5 transition">
                      <X size={12} strokeWidth={3} /> Reject
                    </button>
                  </div>
                </div>
              ))}
              {approvals.length === 0 && (
                <div className="text-center text-xs text-gray-400 font-medium py-10">All pipeline verifications cleared.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* --- ADD STUDENT OVERLAY MODAL WINDOW --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 transform transition-all animate-scale-up">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Add New Student</h3>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">Register data matrix profile into school indices</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Student Full Name *</label>
                <input type="text" required placeholder="e.g. Rahul Subramanian" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 focus:border-[#E59B33] transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Institutional Email Address *</label>
                <input type="email" required placeholder="e.g. rahul.s@edusmart.in" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 focus:border-[#E59B33] transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Grade Level</label>
                  <select value={newStudent.grade} onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 transition-all font-semibold text-gray-800">
                    {["Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Section Room</label>
                  <select value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 transition-all font-semibold text-gray-800">
                    {["A", "B", "C"].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Guardian Name *</label>
                  <input type="text" required placeholder="e.g. Ramesh Subramanian" value={newStudent.guardian} onChange={(e) => setNewStudent({...newStudent, guardian: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 focus:border-[#E59B33] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Relation</label>
                  <select value={newStudent.relationship} onChange={(e) => setNewStudent({...newStudent, relationship: e.target.value})} className="w-full bg-[#F4F9F9] border border-gray-200/60 rounded-xl px-2 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#E59B33]/20 transition-all font-semibold text-gray-800">
                    {["Father", "Mother", "Guardian"].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Status Flag</label>
                <div className="flex gap-4 bg-[#F4F9F9] p-2.5 rounded-xl border border-gray-200/40">
                  {["Active", "Inactive"].map(st => (
                    <label key={st} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                      <input type="radio" name="status" value={st} checked={newStudent.status === st} onChange={() => setNewStudent({...newStudent, status: st})} className="accent-[#E59B33] w-4 h-4" />
                      {st}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="bg-[#E59B33] hover:bg-[#c98322] text-white px-6 py-2 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-1.5"><Plus size={14} strokeWidth={3} /> Save Student Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;