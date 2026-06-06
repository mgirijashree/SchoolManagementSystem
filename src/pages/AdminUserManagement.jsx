
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getStorageData, setStorageData } from '../data/schoolData';
import { getAllUsers, createUser, updateUser, deleteUser } from '../data/userManagement';

const AdminUserManagement = () => {
  // Tabs & Lists States
  const [activeTab, setActiveTab] = useState('Students'); // 'Students' | 'Staff' | 'Parents'
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [staffTypeFilter, setStaffTypeFilter] = useState('All'); // 'All' | 'Primary Education' | 'Secondary Education'
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', uniqueField: '', guardian: '', relationship: '', status: 'Active'
  });

  // Load initial dataset records
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStudents(getStorageData('students') || []);
    setStaff(getAllUsers() || []);
  };

  const uniqueParentsCount = new Set(students.map(s => s.guardian).filter(Boolean)).size;

  // Reset inner drop-down filters whenever swapping core navigation tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm('');
    setGradeFilter('All');
    setStaffTypeFilter('All');
    setStatusFilter('All');
  };

  const handleExportExcel = () => {
    const dataToExport = filteredItems.map(item => ({
      ID: item.id,
      Name: item.name,
      Email: item.subtitle,
      Category: item.mainField,
      Details: item.details,
      Status: item.status,
      Joined: item.date || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    XLSX.writeFile(workbook, `${activeTab}_Report.xlsx`);
  };
  
  // --- MUTATION HANDLING HANDLERS (CRUD) ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'Students') {
        setFormData({
          name: item.name, email: item.email, uniqueField: item.grade,
          guardian: item.guardian, relationship: item.relationship, status: item.status
        });
      } else {
        setFormData({
          name: item.name, email: item.email, uniqueField: item.department,
          guardian: '', relationship: '', status: item.status
        });
      }
    } else {
      setEditingItem(null);
      setFormData({
        name: '', email: '', 
        uniqueField: activeTab === 'Students' ? 'Grade 5 · A' : 'Primary Education',
        guardian: '', relationship: 'Father', status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return alert('Name and Email are required.');

    if (activeTab === 'Students') {
      let currentStudents = [...students];
      if (editingItem) {
        currentStudents = currentStudents.map(s => s.id === editingItem.id ? { 
          ...s, name: formData.name, email: formData.email, grade: formData.uniqueField,
          guardian: formData.guardian, relationship: formData.relationship, status: formData.status 
        } : s);
      } else {
        const newStu = {
          id: `STU-2400${students.length + 1}`,
          name: formData.name, email: formData.email, grade: formData.uniqueField,
          guardian: formData.guardian, relationship: formData.relationship,
          status: formData.status, date: 'Jun 05, 2026',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
        };
        currentStudents.push(newStu);
      }
      setStorageData('students', currentStudents);
    } else {
      const staffPayload = {
        name: formData.name, email: formData.email, 
        role: 'Teacher', // Primary target roles mapped inside UI view context
        department: formData.uniqueField, status: formData.status
      };
      if (editingItem) {
        updateUser(editingItem.id, staffPayload);
      } else {
        createUser(staffPayload);
      }
    }

    refreshData();
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      if (activeTab === 'Students') {
        const updated = students.filter(s => s.id !== id);
        setStorageData('students', updated);
      } else {
        deleteUser(id);
      }
      refreshData();
    }
  };

  // --- FILTERS & DISPLAY COMPUTATIONS ---
  const getDisplayData = () => {
    if (activeTab === 'Students') {
      return students.map(s => ({ 
        ...s, type: 'student', subtitle: s.email, mainField: s.grade, details: `${s.guardian} (${s.relationship})` 
      }));
    } else if (activeTab === 'Staff') {
      return staff.filter(u => u.role === 'Teacher').map(t => ({ 
        ...t, type: 'staff', subtitle: t.email, mainField: t.department, details: t.role 
      }));
    } else {
      const parentMap = {};
      students.forEach(s => {
        if (s.guardian && !parentMap[s.guardian]) {
          parentMap[s.guardian] = {
            id: `PAR-${s.id.split('-')[1]}`, name: s.guardian, subtitle: `${s.relationship}`,
            mainField: s.grade, details: `Ward: ${s.name}`, status: 'Active', date: s.date
          };
        }
      });
      return Object.values(parentMap);
    }
  };

  const filteredItems = getDisplayData().filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    // Dynamic execution block handling customized sub-tab filters
    let matchesContextFilters = true;
    if (activeTab === 'Students' || activeTab === 'Parents') {
      matchesContextFilters = gradeFilter === 'All' || item.mainField?.includes(gradeFilter);
    } else if (activeTab === 'Staff') {
      matchesContextFilters = staffTypeFilter === 'All' || item.mainField === staffTypeFilter;
    }

    return matchesSearch && matchesStatus && matchesContextFilters;
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* 1. Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>User Management</h1>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Manage Students, Staffs and parents across the school</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
  onClick={handleExportExcel} 
  style={{ 
    padding: '10px 18px', 
    border: '1px solid #cbd5e1', 
    backgroundColor: '#fff', 
    borderRadius: '30px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    fontWeight: '500', 
    color: '#334155' 
  }}
>
  <span>📥</span> Export Excel
</button>
          <button onClick={() => handleOpenModal()} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
            <span style={{ fontSize: '18px' }}>+</span> Add {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* 2. Count Status Segments (Pills) */}
      <div style={{ display: 'flex', gap: '12px', padding: '6px', backgroundColor: '#e2e8f0', borderRadius: '40px', width: 'fit-content', marginBottom: '28px' }}>
        {[
          { id: 'Students', count: students.length, color: '#2563eb' },
          { id: 'Staff', count: staff.filter(u => u.role === 'Teacher').length, color: '#7c3aed' },
          { id: 'Parents', count: uniqueParentsCount, color: '#10b981' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '10px 24px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            {tab.id}
            <span style={{ backgroundColor: activeTab === tab.id ? `${tab.color}20` : '#cbd5e1', color: activeTab === tab.id ? tab.color : '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
              {tab.count < 10 ? `0${tab.count}` : tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Search Bar and Filter System Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Dynamic Dropdown Logic Rendering depends on Tab State */}
          {(activeTab === 'Students' || activeTab === 'Parents') && (
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} style={{ padding: '12px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
              <option value="All">All Grades</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
            </select>
          )}

          {activeTab === 'Staff' && (
            <select value={staffTypeFilter} onChange={(e) => setStaffTypeFilter(e.target.value)} style={{ padding: '12px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
              <option value="All">All Staff Departments</option>
              <option value="Primary Education">Primary Teacher</option>
              <option value="Secondary Education">Higher Education</option>
            </select>
          )}

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '12px 20px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', fontSize: '14px', fontWeight: '500', color: '#334155', cursor: 'pointer' }}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* 4. Layout Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#edf4f4', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
                {activeTab === 'Students' ? 'Student Details' : activeTab === 'Staff' ? 'Staff Details' : 'Parent Name'}
              </th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>ID</th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>{activeTab === 'Staff' ? 'Department' : 'Grade/Class'}</th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>{activeTab === 'Students' ? 'Guardian' : activeTab === 'Staff' ? 'Designation' : 'Ward Link'}</th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Joined Date</th>
              <th style={{ padding: '16px 24px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{item.name}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{item.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px 24px', color: '#475569', fontWeight: '500' }}>{item.id}</td>
                  
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                      {item.mainField || 'N/A'}
                    </span>
                  </td>
                  
                  <td style={{ padding: '16px 24px', color: '#334155' }}>{item.details}</td>
                  
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      backgroundColor: item.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                      color: item.status === 'Active' ? '#166534' : '#64748b'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.status === 'Active' ? '#22c55e' : '#94a3b8' }}></span>
                      {item.status}
                    </span>
                  </td>
                  
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{item.date || 'Oct 15, 2025'}</td>
                  
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                      {item.type !== 'parent' && (
                        <button onClick={() => handleOpenModal(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#64748b' }} title="Edit">✏️</button>
                      )}
                      {item.type !== 'parent' && (
                        <button onClick={() => handleDeleteItem(item.id, item.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ef4444' }} title="Delete">🗑️</button>
                      )}
                      {item.type === 'parent' && <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Managed via Ward</span>}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '15px' }}>
                  Data Not Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Custom Form Modal overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              {editingItem ? `Edit ${activeTab.slice(0, -1)} Profile` : `Add New ${activeTab.slice(0, -1)}`}
            </h3>
            
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}/>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Email Address</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}/>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>
                  {activeTab === 'Students' ? 'Grade/Class Allocation' : 'Department Assignment'}
                </label>
                {activeTab === 'Students' ? (
                  <input type="text" placeholder="e.g. Grade 5 · A" value={formData.uniqueField} onChange={(e) => setFormData({...formData, uniqueField: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}/>
                ) : (
                  <select value={formData.uniqueField} onChange={(e) => setFormData({...formData, uniqueField: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <option value="Primary Education">Primary Education</option>
                    <option value="Secondary Education">Secondary Education</option>
                  </select>
                )}
              </div>

              {activeTab === 'Students' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Guardian Name</label>
                    <input type="text" value={formData.guardian} onChange={(e) => setFormData({...formData, guardian: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}/>
                  </div>
                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Relation</label>
                    <select value={formData.relationship} onChange={(e) => setFormData({...formData, relationship: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' }}>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Account Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Registry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;