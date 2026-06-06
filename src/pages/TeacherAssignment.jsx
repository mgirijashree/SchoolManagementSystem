import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStorageData, setStorageData, INITIAL_CLASSES } from '../data/schoolData';

const TeacherAssignment = () => {
    const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All Classes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal State
  const [newAssignment, setNewAssignment] = useState({ title: '', maxScore: '', class: '', date: '' });

  useEffect(() => {
    // Assuming you have an assignments key in storage, otherwise fallback to empty
    setAssignments(getStorageData('assignments') || []);
  }, []);

  const filteredData = assignments.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass === 'All Classes' || item.class === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateAssignment = () => {
    const updated = [...assignments, { ...newAssignment, id: Date.now(), status: 'Active' }];
    setAssignments(updated);
    setStorageData('assignments', updated);
    setIsModalOpen(false);
    setNewAssignment({ title: '', maxScore: '', class: '', date: '' });
  };

  return (
    <div className="p-8">
      {/* Search and Dropdowns */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            className="w-full pl-10 p-2 border rounded-xl"
            placeholder="Search assignments..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="border p-2 rounded-xl" onChange={(e) => setFilterClass(e.target.value)}>
          <option>All Classes</option>
          {INITIAL_CLASSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={20} /> Create Assignment
        </button>
      </div>

      {/* Assignment Table */}
      <table className="w-full bg-white rounded-2xl shadow-sm">
        {/* Table Headings... */}
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-4">{item.title}</td>
              <td>{item.class}</td>
              <td>{item.date}</td>
              <td>
                <button className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Grade</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96">
            <h2 className="text-xl font-bold mb-4">Create New Assignment</h2>
            <input placeholder="Title" className="w-full border p-2 mb-2 rounded" onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
            <input type="date" className="w-full border p-2 mb-4 rounded" onChange={e => setNewAssignment({...newAssignment, date: e.target.value})} />
            <div className="flex gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
              <button onClick={handleCreateAssignment} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Create Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignment;