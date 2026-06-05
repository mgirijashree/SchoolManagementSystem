import React, { useState } from 'react';
import { Building, Shield, Calendar, Link as LinkIcon, Download, Save, Eye, EyeOff, Search } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('School Profile');

  const tabs = [
    { name: 'School Profile', icon: <Building size={18} /> },
    { name: 'Roles & permission', icon: <Shield size={18} /> },
    { name: 'Academic Year', icon: <Calendar size={18} /> },
    { name: 'Integration', icon: <LinkIcon size={18} /> },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-500 mb-6">Configure school profile, permission and integration</p>

      <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl w-fit border shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        {activeTab === 'School Profile' && <SchoolProfileLayout />}
        {activeTab === 'Roles & permission' && <RolesPermissionsLayout />}
        {activeTab === 'Academic Year' && <AcademicYearLayout />}
        {activeTab === 'Integration' && <IntegrationLayout />}
      </div>
    </div>
  );
};

// 1. School Profile
const SchoolProfileLayout = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', website: '' });
  const handleSave = () => alert("Profile Saved: " + JSON.stringify(formData));
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">School Profile</h2>
      <div className="flex items-center gap-4 p-4 border rounded-lg mb-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🏫</div>
        <button className="flex items-center gap-2 text-blue-600 font-semibold"><Download size={16}/> Upload Logo</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {['name', 'email', 'phone', 'website'].map((field) => (
          <input 
            key={field} 
            className="p-3 border rounded-lg" 
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          />
        ))}
      </div>
      <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"><Save size={16}/> Save Changes</button>
    </div>
  );
};

// 2. Roles & Permissions
const RolesPermissionsLayout = () => {
  const modules = ["Dashboard", "User Management", "Academic", "Attendance", "Fees", "Reports", "Documents", "Settings"];
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
      <table className="w-full text-left">
        <thead><tr className="text-gray-500 border-b">
          <th className="pb-3">MODULES</th><th>ADMIN</th><th>TEACHER</th><th>STAFF</th><th>PARENT</th>
        </tr></thead>
        <tbody>
          {modules.map((m) => (
            <tr key={m} className="border-b">
              <td className="py-4 font-medium">{m}</td>
              {[1, 2, 3, 4].map(i => <td key={i}><input type="checkbox" className="w-4 h-4 accent-blue-600" /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 3. Academic Year
const AcademicYearLayout = () => {
  const years = [{ name: "2025-2026", status: "Current" }, { name: "2024-2025", status: "Past" }];
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={16}/><input className="pl-10 pr-4 py-2 border rounded-lg" placeholder="Search years..."/></div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Year</button>
      </div>
      {years.map(y => (
        <div key={y.name} className="flex justify-between p-4 border rounded-xl mb-2 items-center">
          <span className="font-bold">{y.name}</span>
          <span className={`px-3 py-1 rounded-full text-xs ${y.status === 'Current' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{y.status}</span>
        </div>
      ))}
    </div>
  );
};

// 4. Integration with Validations
const IntegrationLayout = () => {
  const [creds, setCreds] = useState({ stripe: '', razorpay: '' });
  const [errors, setErrors] = useState({});

  const handleSave = (key) => {
    if (!creds[key]) setErrors({...errors, [key]: 'Field is required'});
    else alert(`${key} saved!`);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {['stripe', 'razorpay'].map((provider) => (
        <div key={provider} className="p-6 border rounded-2xl">
          <h3 className="font-bold capitalize mb-4">{provider}</h3>
          <input 
            className={`w-full p-2 border rounded mb-1 ${errors[provider] ? 'border-red-500' : ''}`}
            placeholder="Secret Key" 
            type="password"
            onChange={(e) => setCreds({...creds, [provider]: e.target.value})}
          />
          {errors[provider] && <p className="text-red-500 text-xs mb-2">{errors[provider]}</p>}
          <button onClick={() => handleSave(provider)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save size={16}/> Save</button>
        </div>
      ))}
    </div>
  );
};

export default AdminSettings;