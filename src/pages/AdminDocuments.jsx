
  
  import React, { useState } from 'react';
import { Search, FileText, Upload, Trash2, Filter, ChevronDown, Award, User, File } from 'lucide-react';

const AdminDocuments = () => {
  const [activeTab, setActiveTab] = useState('All documents');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data Structure
  const data = {
    documents: [
      { id: 1, name: "Enrollment Certificate - Liam Smith", meta: "Liam smith . 2026-03-01 . 245KB . By Admin Office", tag: "Certificates" },
      { id: 2, name: "Grade 6 Report Card - Emily Brown", meta: "Emily Brown . 2026-02-28 . 180KB . By Robert Chen", tag: "Report Card" },
    ],
    certificates: [
    { id: 1, name: "Merit Certificate - Arjun Balakrishnan", meta: "Arjun Balakrishnan . 2026-03-15 . 210KB . By Principal", tag: "Certificates", type: "pdf" },
    { id: 2, name: "Attendance Certificate - Kavitha Iyer", meta: "Kavitha Iyer . 2026-03-20 . 195KB . By Admin Office", tag: "Certificates", type: "pdf" },
    { id: 3, name: "Grade 5 Report Card - Karthik Narayanan", meta: "Karthik Narayanan . 2026-02-10 . 165KB . By Srividya Menon", tag: "Report Card", type: "pdf" },
    { id: 4, name: "Staff Attendance Sheet - April", meta: "2026-04-01 . 88KB . By HR Department", tag: "Other", type: "sheet" },
    { id: 5, name: "Fee Receipt - Ananya Subramaniam", meta: "Ananya Subramaniam . 2026-04-05 . 72KB . By Accounts Office", tag: "Other", type: "pdf" },
    { id: 6, name: "Student photo - Deepak Ravindran", meta: "Deepak Ravindran . 2026-02-15 . 312KB . By Admin office", tag: "ID Card", type: "id" }
  ],
  };

  const tabs = [
    { name: 'All documents', icon: <File size={16} /> },
    { name: 'Student records', icon: <User size={16} /> },
    { name: 'Certificates', icon: <Award size={16} /> }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Stats Cards Row */}
      <div className="flex gap-6 mb-8">
        {[ { label: "Total Documents", val: 12 }, { label: "Total Certificates", val: 3 }, { label: "Student Records", val: 9 }, { label: "Other files", val: 4 } ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border w-48 shadow-sm">
            <h3 className="text-3xl font-bold text-blue-700">{stat.val}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border ${activeTab === tab.name ? 'bg-gray-200 font-bold' : 'bg-white'}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Conditional Rendering based on layout */}
      {activeTab === 'Certificates' ? (
        <div className="grid grid-cols-3 gap-6">
          {data.certificates.map(cert => (
            <div key={cert.id} className="bg-white p-6 rounded-2xl border shadow-sm">
              <div className="mb-4">{cert.icon}</div>
              <h4 className="font-bold">{cert.name}</h4>
              <p className="text-sm text-gray-500">{cert.student}</p>
              <p className="text-xs text-gray-400 mb-4">Issued: {cert.date}</p>
              <button className="w-full py-2 bg-gray-50 rounded-lg text-sm font-semibold">Download Certificate</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border">
          {data.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-lg text-red-500"><FileText /></div>
                <div>
                  <h4 className="font-bold">{doc.name}</h4>
                  <p className="text-sm text-gray-400">{doc.meta}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gray-100">{doc.tag}</span>
                <Upload size={18} className="cursor-pointer text-gray-400" />
                <Trash2 size={18} className="cursor-pointer text-red-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;