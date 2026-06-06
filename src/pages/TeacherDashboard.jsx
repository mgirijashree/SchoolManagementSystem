import React from 'react';
import { 
  Users, BookOpen, CalendarCheck, ClipboardList, 
  FileText, MessageCircle, CheckCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { getStorageData } from '../data/schoolData';

const TeacherDashboard = () => {
  const schoolData = getStorageData('schoolData') || [];
  const attendanceData = getStorageData('attendance') || [];
  const performanceData = getStorageData('performance') || [];
  const pendingCount = schoolData?.filter(i => i.status === "Pending").length || 0;

  const stats = [
    { title: "Total Classes", value: 4, sub: "This Semester", icon: <BookOpen />, trend: "0%" },
    { title: "Total Students", value: 15, sub: "vs last semester", icon: <Users />, trend: "+5%" },
    { title: "Avg Attendance", value: "86%", sub: "vs last month", icon: <CalendarCheck />, trend: "+3%" },
    { title: "Pending Tasks", value: pendingCount, sub: "Needs Review", icon: <ClipboardList />, trend: "-1%" },
  ];

  const timetable = [
    { time: "8.00AM", duration: "1h", subject: "Mathematics", class: "Class 10-A", room: "Room 201", type: "Lecture" },
    { time: "10.00AM", duration: "1h", subject: "Advanced Algebra", class: "Class 10-c", room: "Room 105", type: "Lab" },
    { time: "12.00AM", duration: "30m", subject: "Lunch Break", type: "Break" },
    { time: "1.00AM", duration: "1h", subject: "Mathematics", class: "Class 10-B", room: "Room 202", type: "Lecture" },
    { time: "3.00AM", duration: "1h", subject: "Statistics", class: "Class 10-D", room: "Room 106", type: "Lecture" },
  ];

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, Girija!</h1>
        <p className="text-gray-500">Today - Saturday, June 6, 2026</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#E59B33]/10 text-[#E59B33] rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-72">
          <h3 className="font-bold text-gray-800 mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={attendanceData}>
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="#E59B33" fill="#E59B33" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm h-72">
          <h3 className="font-bold text-gray-800 mb-4">Class Performance</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={performanceData}>
              <XAxis dataKey="grade" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pass" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fail" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timetable & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timetable */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Today's Timetable</h2>
          <div className="space-y-4">
            {timetable.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-3 border-l-4 border-[#E59B33] bg-gray-50 rounded-r-lg">
                <div className="text-sm font-bold w-16 pt-1">{item.time}<div className="text-[10px] text-gray-400">{item.duration}</div></div>
                <div className="flex-1">
                  <p className="font-semibold">{item.subject}</p>
                  {item.class && <p className="text-xs text-gray-500">{item.class} • {item.room}</p>}
                </div>
                {item.type !== "Break" && <span className="text-xs bg-[#E59B33]/10 text-[#E59B33] px-3 py-1 rounded-full self-center font-medium">{item.type}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Notifications */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3"><FileText className="text-red-500 w-5" /> <div><p className="font-medium">Emma submitted Assignment #1</p><p className="text-xs text-gray-400">10 mins ago</p></div></div>
              <div className="flex gap-3"><CheckCircle className="text-red-500 w-5" /> <div><p className="font-medium">Attendance marked for 10-A</p><p className="text-xs text-gray-400">1 hour ago</p></div></div>
              <div className="flex gap-3"><MessageCircle className="text-blue-500 w-5" /> <div><p className="font-medium">New message from David Johnson</p><p className="text-xs text-gray-400">3 hours ago</p></div></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-orange-50 rounded-lg flex items-center gap-2 text-orange-700">● Isabella Davis attendance low</div>
              <div className="p-2 bg-blue-50 rounded-lg flex items-center gap-2 text-blue-700">● Parent teacher conference Friday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;