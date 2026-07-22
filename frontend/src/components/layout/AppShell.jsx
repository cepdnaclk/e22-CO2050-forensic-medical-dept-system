// src/components/layout/AppShell.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-3 mt-auto">
          <p className="text-xs text-gray-400 text-center">
            FMDIS v1.0 — Department of Forensic Medicine, University of Peradeniya
          </p>
        </footer>
      </main>
    </div>
  );
}
