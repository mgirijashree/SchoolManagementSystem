import React from 'react';
import { Outlet } from 'react-router-dom';


import TeacherSidebar from './TeacherSidebar';
import TeacherTopbar from './TeacherTopbar';


const TeacherDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col">
        <TeacherTopbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboardLayout;