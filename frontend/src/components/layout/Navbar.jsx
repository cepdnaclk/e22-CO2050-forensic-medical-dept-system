// src/components/layout/Navbar.jsx
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../data/mockData';
import { roleColors } from '../../config/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-14 bg-[#1e3a5f] border-b border-[#163050] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      {/* Left — Department name */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">FM</span>
        </div>
        <div className="hidden md:block">
          <p className="text-white text-sm font-medium leading-tight">
            Department of Forensic Medicine
          </p>
          <p className="text-white/60 text-xs leading-tight">
            Faculty of Medicine, University of Peradeniya
          </p>
        </div>
      </div>

      {/* Center — Role badge */}
      <div className="hidden sm:flex items-center">
        {user && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border rounded ${
              roleColors[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {ROLE_LABELS[user.role] || user.role}
          </span>
        )}
      </div>

      {/* Right — User info and logout */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 text-white/80">
            <User className="h-4 w-4" />
            <span className="text-sm hidden md:inline">{user.fullName}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm px-2 py-1 rounded hover:bg-white/10 transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
