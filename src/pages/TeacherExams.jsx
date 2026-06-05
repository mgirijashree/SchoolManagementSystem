import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

// Example source data (ensure your structure matches this)
const EXAM_DATA = [
  { id: "STU-001", name: "Emma Watson", math: 92, algebra: 88, stats: 95, class: "Class 10 A" },
  { id: "STU-002", name: "Sophia Chen", math: 85, algebra: 82, stats: 88, class: "Class 10 A" },
  { id: "STU-003", name: "Liam Smith", math: 78, algebra: 75, stats: 80, class: "Class 10 B" }
];

const TeacherExams = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10 A');

  const filteredStudents = EXAM_DATA.filter(s => s.class === selectedClass);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(s => ({
      "Student Name": s.name,
      "Student ID": s.id,
      "Mathematics": s.math,
      "Adv Algebra": s.algebra,
      "Statistics": s.stats
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Marks");
    XLSX.writeFile(workbook, `Exam_Marks_${selectedClass}.xlsx`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Exam Marks</h1>
          <p className="text-gray-500">Enter marks and track student performance</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
        >
          <Download size={20} /> Publish Marks (Excel)
        </button>
      </div>

      <div className="mb-6">
        <select 
          className="border p-3 rounded-xl bg-white w-64" 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="Class 10 A">Class 10 A</option>
          <option value="Class 10 B">Class 10 B</option>
        </select>
      </div>

      <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
        <thead>
          <tr className="text-left text-gray-400 border-b">
            <th className="p-4">STUDENT</th>
            <th>MATHEMATICS</th>
            <th>ADV ALGEBRA</th>
            <th>STATISTICS</th>
            <th>PERFORMANCE</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id} className="border-b">
              <td className="p-4">
                <p className="font-bold">{student.name}</p>
                <p className="text-xs text-gray-400">{student.id}</p>
              </td>
              <td>{student.math}</td>
              <td>{student.algebra}</td>
              <td>{student.stats}</td>
              <td><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-medium">Grade A</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherExams;