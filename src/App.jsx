import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboardLayout from "./components/AdminDashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminAcademic from "./pages/AdminAcademic";
import AdminAttendance from "./pages/AdminAttendance";
import AdminFee from "./pages/AdminFee"; 
import AdminCommunication from "./pages/AdminCommunication";
import AdminReports from "./pages/AdminReports";
import AdminDocuments from "./pages/AdminDocuments";
import AdminSettings from "./pages/AdminSettings";
import AdminApprovals from "./pages/AdminApprovals";


import TeacherDashboardLayout from "./components/TeacherDashboardLayout";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherClasses from "./pages/TeacherClasses";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherAssignment from "./pages/TeacherAssignment";
import TeacherExams from "./pages/TeacherExams";
import TeacherMessages from "./pages/TeacherMessages";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Access Route */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/" element={<AdminDashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<AdminUserManagement />} />
            <Route path="academic" element={<AdminAcademic />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="fees" element={<AdminFee />} /> 
            <Route path="communication" element={<AdminCommunication />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="approvals" element={<AdminApprovals />} />
          </Route>
        </Route>

        {/* TEACHER PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherDashboardLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="assignment" element={<TeacherAssignment />} />
            <Route path="exams" element={<TeacherExams />} />
            <Route path="messages" element={<TeacherMessages />} />
          </Route>
        </Route>

        {/* Fallbacks */}
        <Route path="/unauthorized" element={<div className="p-8 text-xl font-bold">Access Denied</div>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;