import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; 
import AdminTopBar from "../components/AdminTopBar"; 
import {
  Users, BookOpen, IndianRupee, Plus, GraduationCap, TrendingUp, 
  Clock, Check, X, AlertTriangle, Bell } from "lucide-react";

const AdminDashboardLayout = () => {
  return (
    <div className="flex w-full min-h-screen bg-[#F4FAFA]">
      {/* 1. Left Sidebar Navigation Panel */}
      <AdminSidebar />

      {/* 2. Main Work Area View Window */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Global Header Top Bar applied seamlessly across all sub-routes */}
        <AdminTopBar searchPlaceholder="Search school metrics, logs, indices..." />

        {/* Dynamic Workspace: The <Outlet /> component renders sub-pages (Dashboard, Academic, User Management, etc.) */}
        <div className="flex-1">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboardLayout;