// src/config/navigation.js
import {
  LayoutDashboard,
  Users,
  Shield,
  ScrollText,
  Settings,
  FolderOpen,
  FileText,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Gavel,
  Building2,
  Send,
  Eye,
  Inbox,
  UserPlus,
  Upload,
  FileSearch,
  Receipt,
  Bell,
} from 'lucide-react';

import { ROLES } from '../data/mockData';

export const navigationConfig = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/users', icon: Users },
    { label: 'Roles & Permissions', path: '/roles', icon: Shield },
    { label: 'Audit Log', path: '/audit-trail', icon: ScrollText },
    { label: 'System Configuration', path: '/system-config', icon: Settings },
    { type: 'divider', label: 'Modules' },
    { label: 'Cases', path: '/cases', icon: FolderOpen },
    { label: 'MLEF Forms', path: '/mlefs', icon: FileText },
    { label: 'Post-Mortem Reports', path: '/postmortems', icon: Stethoscope },
    { label: 'Court Documents', path: '/court/certificates', icon: Gavel },
    { label: 'Specimens', path: '/specimens', icon: FlaskConical },
  ],
  [ROLES.JMO]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Cases', path: '/cases', icon: FolderOpen },
    { label: 'MLEF Forms', path: '/mlefs', icon: FileText },
    { label: 'Post-Mortem Reports', path: '/postmortems', icon: Stethoscope },
    { label: 'Autopsy Notifications', path: '/cases', icon: Bell },
    { label: 'Specimens & Lab Results', path: '/specimens', icon: FlaskConical },
    { label: 'Court Documents', path: '/court/certificates', icon: Gavel },
  ],
  [ROLES.REGISTRAR]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Court Certificates', path: '/court/certificates', icon: ClipboardList },
    { label: 'Court Summons', path: '/court/summons', icon: Gavel },
    { label: 'Certificates of Receipt', path: '/court/receipts', icon: Receipt },
    { label: 'Case Status', path: '/cases', icon: Eye },
  ],
  [ROLES.POLICE]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Cases', path: '/cases', icon: FolderOpen },
    { label: 'Submit MLEF Request', path: '/cases', icon: Send },
    { label: 'Track Report Status', path: '/cases', icon: FileSearch },
    { label: 'Received Reports', path: '/cases', icon: Inbox },
  ],
  [ROLES.RECORDS_CLERK]: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Case Registration', path: '/cases/new', icon: FolderOpen },
    { label: 'Person Registration', path: '/persons/deceased/new', icon: UserPlus },
    { label: 'Document Upload', path: '/cases', icon: Upload },
    { label: 'Case Documents', path: '/cases', icon: FileText },
  ],
};

export const roleColors = {
  [ROLES.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [ROLES.JMO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ROLES.REGISTRAR]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ROLES.POLICE]: 'bg-green-100 text-green-800 border-green-200',
  [ROLES.RECORDS_CLERK]: 'bg-amber-100 text-amber-800 border-amber-200',
};
