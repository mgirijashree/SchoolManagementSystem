import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { getStorageData, setStorageData, INITIAL_STUDENTS, INITIAL_CLASSES } from '../data/schooldata';

const TeacherAttendance = () => {
  const [attendance, setAttendance] = useState({});
  const [selectedClass, setSelectedClass] = useState(INITIAL_CLASSES[0]?.name || "");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Force a fetch from the source of truth
    const data = getStorageData('students') || INITIAL_STUDENTS;
    setStudents(data);
  }, []);

  // Robust Filter: Normalizes strings to ignore special characters and spaces
  const normalize = (str) => String(str).toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredStudents = students.filter((student) => {
    // 1. Extract grade from student (e.g., "Grade 5 · A" -> "Grade 5")
    const studentGrade = student.grade.split('·')[0].trim();
    
    // 2. Extract grade from the selected class (e.g., "Grade 5 - Section A" -> "Grade 5")
    const classGrade = selectedClass.split('-')[0].trim();
    
    // 3. Direct comparison
    return studentGrade === classGrade;
  });

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const attendanceData = {
      date: new Date().toISOString().split('T')[0],
      class: selectedClass,
      records: attendance
    };
    setStorageData('attendance_records', attendanceData);
    alert(`Attendance for ${selectedClass} saved!`);
  };

  const getButtonClass = (status, currentSelection) => {
    const base = "px-4 py-2 rounded-lg text-sm font-medium transition border";
    if (currentSelection !== status) return `${base} bg-gray-50 hover:bg-gray-100 text-gray-600`;

    switch (status) {
      case 'Present': return `${base} bg-green-100 text-green-700 border-green-500`;
      case 'Absent': return `${base} bg-red-100 text-red-700 border-red-500`;
      case 'Late': return `${base} bg-yellow-100 text-yellow-700 border-yellow-500`;
      default: return base;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Marking</h1>
          <p className="text-gray-500">Mark daily attendance for your students</p>
        </div>
        <button 
          onClick={handleSaveAttendance}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium"
        >
          <Save className="w-5 h-5" /> Save Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex gap-4 mb-6">
            <select 
  className="border p-3 rounded-xl flex-1 bg-white" 
  value={selectedClass}
  onChange={(e) => setSelectedClass(e.target.value)}
>
  {INITIAL_CLASSES.map(cls => (
    <option key={cls.id} value={cls.name}>
      {cls.name.split(' - ')[0]} 
    </option>
  ))}
</select>
            <input type="date" className="border p-3 rounded-xl" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="space-y-4">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">ID: {student.id}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {['Present', 'Absent', 'Late'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => handleStatusChange(student.id, status)}
                      className={getButtonClass(status, attendance[student.id])}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No students found for this class.</p>
                <p className="text-xs text-gray-400 mt-2">Check if "Grade" in students matches the Class name.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm self-start">
          <h3 className="font-bold text-lg mb-6">Monthly Analytics</h3>
          <div className="space-y-6">
            {INITIAL_CLASSES.slice(0, 4).map((cls) => (
              <div key={cls.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{cls.name}</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;