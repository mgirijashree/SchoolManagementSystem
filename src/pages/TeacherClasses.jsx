import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, Eye, CalendarCheck, X } from 'lucide-react';
import { getStorageData, setStorageData, INITIAL_STUDENTS } from '../data/schoolData';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({ name: '', label: '', room: '' });

  useEffect(() => {
    setClasses(getStorageData('classes') || []);
  }, []);

  const handleSaveClass = (e) => {
    e.preventDefault();
    const newClass = {
      id: `CLS-${Math.floor(Math.random() * 1000)}`,
      ...formData,
      count: 0,
      teacher: "Girija",
      schedule: "Mon - Fri 8:00-15:00"
    };
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    setStorageData('classes', updatedClasses);
    setIsModalOpen(false);
    setFormData({ name: '', label: '', room: '' });
  };

  const getStudentsForClass = (label) => {
    return INITIAL_STUDENTS.filter(s => s.grade.startsWith(label));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-500">Manage assigned classes and students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium">
          <Plus className="w-5 h-5" /> New Class
        </button>
      </div>

      {/* Add New Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Class</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveClass} className="space-y-4">
              <input required placeholder="Class Name (e.g. Grade 9 - A)" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Grade Label (e.g. Grade 9)" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, label: e.target.value})} />
              <input required placeholder="Room Number (e.g. 101)" className="w-full p-3 border rounded-xl" onChange={(e) => setFormData({...formData, room: e.target.value})} />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Save Class</button>
            </form>
          </div>
        </div>
      )}

      {/* Student/Attendance Popup */}
      {activeView.type && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold capitalize">{activeView.type} - {activeView.data.name}</h2>
              <button onClick={() => setActiveView({ type: null, data: null })}><X className="w-6 h-6" /></button>
            </div>
            <table className="w-full text-left">
              <thead><tr className="border-b text-gray-500 text-sm"><th>Name</th><th>ID</th><th>Action</th></tr></thead>
              <tbody>
                {getStudentsForClass(activeView.data.label).map(student => (
                  <tr key={student.id} className="border-b">
                    <td className="py-4 font-medium">{student.name}</td>
                    <td className="text-gray-500">{student.id}</td>
                    <td>
                      {activeView.type === 'attendance' ? (
                        <select className="bg-gray-100 p-1 rounded border"><option>Present</option><option>Absent</option></select>
                      ) : (
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full text-xs">{student.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen className="w-8 h-8" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                <p className="text-indigo-600 font-medium">{cls.label}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <p>Students: <span className="font-semibold">{cls.count}</span></p>
              <p>Room: <span className="font-semibold">{cls.room}</span></p>
              <div className="bg-gray-50 px-3 py-1.5 rounded-lg text-xs text-gray-500 inline-block">{cls.schedule}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveView({ type: 'students', data: cls })} className="flex items-center justify-center gap-2 text-sm bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100">
                <Eye className="w-4 h-4" /> View
              </button>
              <button onClick={() => setActiveView({ type: 'attendance', data: cls })} className="flex items-center justify-center gap-2 text-sm bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100">
                <CalendarCheck className="w-4 h-4" /> Attendance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherClasses;