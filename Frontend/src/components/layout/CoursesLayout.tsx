import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const CoursesLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-16'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
