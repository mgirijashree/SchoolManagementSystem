import React, { useState, useMemo } from 'react';
import { CheckCircle, Clock, XCircle, Search, Check, X } from 'lucide-react';

const AdminApprovals = () => {
  const [activeTab, setActiveTab] = useState('All Request');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data 
  const [approvals, setApprovals] = useState([
    { id: 1, name: "Arjun Balakrishnan", role: "Teacher", type: "Medical Leave", date: "2026-06-01", status: "Pending" },
    { id: 2, name: "Kavitha Iyer", role: "Staff", type: "Travel Request", date: "2026-06-02", status: "Approved" },
    { id: 3, name: "Karthik Narayanan", role: "Teacher", type: "Medical Leave", date: "2026-06-03", status: "Pending" },
    { id: 4, name: "Srividya Menon", role: "Staff", type: "Purchase Order", date: "2026-06-04", status: "Pending" },
    { id: 5, name: "Ananya Subramaniam", role: "Teacher", type: "Medical Leave", date: "2026-06-05", status: "Approved" },
    { id: 6, name: "Deepak Ravindran", role: "Staff", type: "IT Support", date: "2026-06-06", status: "Pending" },
    { id: 7, name: "Meera Krishnan", role: "Teacher", type: "Medical Leave", date: "2026-06-07", status: "Approved" },
    { id: 8, name: "Vijay Ranganathan", role: "Staff", type: "Hardware Req.", date: "2026-06-08", status: "Rejected" },
    { id: 9, name: "Lakshmi Priya", role: "Teacher", type: "Medical Leave", date: "2026-06-09", status: "Pending" },
    { id: 10, name: "Suresh Babu", role: "Staff", type: "Maintenance Req.", date: "2026-06-10", status: "Pending" },
  ]);

  // Derived stats for summary cards
  const stats = useMemo(() => ({
    approved: approvals.filter(i => i.status === 'Approved').length,
    pending: approvals.filter(i => i.status === 'Pending').length,
    rejected: approvals.filter(i => i.status === 'Rejected').length,
  }), [approvals]);

  // Action Handlers
  const updateStatus = (id, newStatus) => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  // Filter Logic: Tab (All vs Pending) + Search term
  const filteredData = useMemo(() => {
    return approvals.filter(item => {
      const matchesTab = activeTab === 'All Request' || item.status === 'Pending';
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [approvals, activeTab, searchTerm]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl border shadow-sm">
          <CheckCircle className="text-green-500 mb-2" size={24} />
          <h3 className="text-2xl font-bold">{stats.approved}</h3>
          <p className="text-gray-500 text-sm">Approved this week</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border shadow-sm">
          <Clock className="text-amber-500 mb-2" size={24} />
          <h3 className="text-2xl font-bold">{stats.pending}</h3>
          <p className="text-gray-500 text-sm">Pending review</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border shadow-sm">
          <XCircle className="text-red-500 mb-2" size={24} />
          <h3 className="text-2xl font-bold">{stats.rejected}</h3>
          <p className="text-gray-500 text-sm">Rejected this week</p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex gap-2 mb-6">
        {['All Request', 'Pending'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200" 
          placeholder="Search ......"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border shadow-sm">
        {filteredData.map(item => (
          <div key={item.id} className="flex items-center justify-between p-6 border-b last:border-0">
            <div>
              <h4 className="font-bold">{item.name} <span className="text-gray-400 font-normal">• {item.role}</span></h4>
              <p className="text-sm text-gray-500">{item.type} request</p>
            </div>
            
            <div className="flex items-center gap-6">
              <span className={`px-4 py-1 rounded-full text-xs font-semibold ${item.status === 'Pending' ? 'bg-amber-100 text-amber-700' : item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {item.status}
              </span>
              
              {item.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(item.id, 'Approved')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => updateStatus(item.id, 'Rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovals;