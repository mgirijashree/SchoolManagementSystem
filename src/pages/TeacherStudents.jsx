import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getStorageData, INITIAL_STUDENTS, AVAILABLE_GRADES } from '../data/schooldata';

const TeacherStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setStudents(getStorageData('students') || INITIAL_STUDENTS);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All Grades' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getStatusColor = (percent) => {
    if (percent >= 90) return "text-green-600";
    if (percent >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white"
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option>All Grades</option>
          {AVAILABLE_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-6">Student</th>
              <th className="p-6">Section</th>
              <th className="p-6">Attendance %</th>
              <th className="p-6">Performance</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-6 flex items-center gap-4">
                  <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.id}</p>
                  </div>
                </td>
                {/* Fixed Section Display */}
                <td className="p-6">
  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">
    {student.grade.includes('·') 
      ? student.grade.replace(' · ', '-') // Converts "Grade 5 · A" to "Grade 5-A"
      : student.grade}
  </span>
</td>
                <td className="p-6">
                    <span className={`font-bold ${getStatusColor(92)}`}>92%</span> 
                    <span className="ml-2 text-sm text-gray-500">Excellent</span>
                </td>
                <td className="p-6 w-64">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Grade A+</span>
                        <span className="text-gray-500">92/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudents;