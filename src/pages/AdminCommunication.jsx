import React, { useState, useMemo } from "react";
import { 
  Search, Bell, Megaphone, Radio, Plus, User, 
  Calendar, Clock, Mail, MessageSquare, Send, 
  CheckCircle, Info, AlertTriangle, X
} from "lucide-react";
import { getStorageData, setStorageData } from "../data/schoolData";

export default function AdminCommunication() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State initialization
  const [announcements, setAnnouncements] = useState(() => getStorageData("announcements"));
  const [notifications] = useState(() => getStorageData("notifications"));
  const [stats] = useState({ recipients: "512+", sent: 807, email: 3, sms: 1 });
  const [broadcastData, setBroadcastData] = useState({ subject: "", message: "" });
  
  // Form state
  const [formData, setFormData] = useState({ title: "", priority: "Medium", target: "Everyone", content: "" });

  // Corrected: Moved outside of handleCreateAnnouncement
  const handleSendBroadcast = () => {
    if (broadcastData.subject.length < 5) {
      alert("Subject must be at least 5 characters long.");
      return;
    }
    if (broadcastData.message.length < 15 || broadcastData.message.length > 100) {
      alert("Message must be between 15 and 100 characters.");
      return;
    }
    alert("Broadcast Success");
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    const newEntry = {
      ...formData,
      id: Date.now(),
      status: "Published",
      date: new Date().toISOString().split('T')[0],
      author: "Admin User"
    };

    const updated = [newEntry, ...announcements];
    setAnnouncements(updated);
    setStorageData("announcements", updated);
    setIsModalOpen(false);
    setFormData({ title: "", priority: "Medium", target: "Everyone", content: "" });
  };

  const filteredAnnouncements = useMemo(() => 
    announcements.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())), 
  [announcements, searchQuery]);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Communication</h1>
          <p className="text-gray-400 text-xs font-semibold">Announcements, notifications and broadcasts</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-sm transition-all">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-gray-100 w-fit">
        {[
          { id: "announcements", icon: Megaphone, label: "Announcements" },
          { id: "notifications", icon: Bell, label: "Notifications" },
          { id: "broadcast", icon: Radio, label: "Broadcast" }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg capitalize font-bold text-xs transition-all ${activeTab === tab.id ? "bg-slate-100 text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ANNOUNCEMENTS LAYOUT */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          {filteredAnnouncements.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-orange-400">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-black text-gray-900">{item.title}</h3>
                <span className="text-[9px] font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded uppercase">{item.priority}</span>
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{item.status}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{item.content}</p>
              <div className="flex items-center gap-6 mt-4 text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-1.5"><User size={13} /> {item.target}</span>
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {item.date}</span>
                <span>By {item.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. NOTIFICATIONS LAYOUT */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-sm mb-6">Today</h3>
          {notifications.map(n => (
            <div key={n.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info size={16}/></div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-500">{n.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* 3. BROADCAST LAYOUT */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg mb-6">Send Broadcast</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Broadcast channel</label>
                <div className="grid grid-cols-3 gap-4">
                  {[ {icon: Mail, label: "Email"}, {icon: MessageSquare, label: "SMS"}, {icon: Radio, label: "Email & SMS"} ].map((c, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-600 transition-colors">
                      <c.icon className="mb-2 text-gray-500" size={20} />
                      <p className="text-xs font-bold">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-3 block">Recipient Group</label>
                <div className="grid grid-cols-2 gap-4">
                  {["All Students", "All Parents", "All Staff", "Specific class"].map((group, i) => (
                    <div key={i} className="flex justify-between items-center border border-gray-200 rounded-xl p-4">
                      <span className="text-sm font-bold">{group}</span>
                      <span className="text-xs font-bold text-gray-500">512</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <input 
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm" 
                  placeholder="Subject (Min 5 chars)" 
                  value={broadcastData.subject}
                  onChange={(e) => setBroadcastData({...broadcastData, subject: e.target.value})}
                />
                <div className="relative">
                  <textarea 
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm h-32" 
                    placeholder="Write your message (15-100 chars)" 
                    value={broadcastData.message}
                    onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                  />
                  <p className={`text-xs font-bold mt-1 ${broadcastData.message.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                    {broadcastData.message.length}/100 characters
                  </p>
                </div>
              </div>
              <button 
                onClick={handleSendBroadcast}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send Broadcast
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-black text-lg mb-4">Stats Broadcast</h3>
            {[
              { val: "512+", label: "Recipients", color: "border-l-teal-600" },
              { val: "807", label: "Total Sent", color: "border-l-blue-600" },
              { val: "3", label: "Email", color: "border-l-indigo-400" },
              { val: "1", label: "SMS", color: "border-l-amber-500" }
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 ${stat.color}`}>
                <p className="text-2xl font-black">{stat.val}</p>
                <p className="text-xs font-bold text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-sm p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black">Create Announcement</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4 flex-grow">
              <input 
                required 
                className="w-full border rounded-xl p-3 text-sm" 
                placeholder="Title" 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
              <textarea 
                required 
                className="w-full border rounded-xl p-3 text-sm h-32" 
                placeholder="Content" 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
              />
              <button type="submit" className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold">
                Publish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}