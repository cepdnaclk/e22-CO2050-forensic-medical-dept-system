// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { navigationConfig } from '../../config/navigation';

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = navigationConfig[user.role] || [];

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 bg-white border-r border-gray-200 z-40 transition-all duration-200 flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((item, idx) => {
          if (item.type === 'divider') {
            return (
              <div key={idx} className="mt-4 mb-2 px-2">
                {!collapsed && (
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {item.label}
                  </p>
                )}
                <div className="border-t border-gray-100 mt-1" />
              </div>
            );
          }

          const Icon = item.icon;

          return (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                  isActive
                    ? 'bg-[#1e3a5f] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
