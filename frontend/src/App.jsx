import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/layout/AppShell';

// Auth
import LoginPage from './pages/LoginPage';

// Dashboard
import DashboardRouter from './pages/DashboardRouter';

// Cases
import CaseListPage from './pages/cases/CaseListPage';
import CaseDetailPage from './pages/cases/CaseDetailPage';
import CaseRegistrationForm from './pages/cases/CaseRegistrationForm';

// Persons
import DeceasedPersonForm from './pages/persons/DeceasedPersonForm';
import InjuredPersonForm from './pages/persons/InjuredPersonForm';

// MLEF
import MLEFListPage from './pages/mlef/MLEFListPage';
import MLEFFormPage from './pages/mlef/MLEFFormPage';

// Post Mortem
import PostMortemListPage from './pages/postmortem/PostMortemListPage';
import PostMortemFormPage from './pages/postmortem/PostMortemFormPage';
import AutopsyNotificationForm from './pages/autopsy/AutopsyNotificationForm';

// Specimens
import SpecimenListPage from './pages/specimens/SpecimenListPage';
import SpecimenForm from './pages/specimens/SpecimenForm';
import SpecimenInvestigationForm from './pages/specimens/SpecimenInvestigationForm';

// Court
import CourtCertificateList from './pages/court/CourtCertificateList';
import CourtCertificateForm from './pages/court/CourtCertificateForm';
import CertificateOfReceiptForm from './pages/court/CertificateOfReceiptForm';
import CourtSummonsList from './pages/court/CourtSummonsList';
import CourtSummonsForm from './pages/court/CourtSummonsForm';

// System
import AuditLogList from './pages/audit/AuditLogList';
import UserList from './pages/users/UserList';
import RolesPermissionsPage from './pages/users/RolesPermissionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route index element={<DashboardRouter />} />
            
            {/* Cases */}
            <Route path="cases" element={<CaseListPage />} />
            <Route path="cases/new" element={<CaseRegistrationForm />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />

            {/* Persons */}
            <Route path="cases/:id/deceased/new" element={<DeceasedPersonForm />} />
            <Route path="cases/:id/injured/new" element={<InjuredPersonForm />} />

            {/* Forms */}
            <Route path="mlefs" element={<MLEFListPage />} />
            <Route path="postmortems" element={<PostMortemListPage />} />
            
            <Route path="mlefs/new" element={<MLEFFormPage />} />
            <Route path="postmortems/new" element={<PostMortemFormPage />} />

            <Route path="cases/:id/mlef/new" element={<MLEFFormPage />} />
            <Route path="cases/:id/mlef/:mlefId" element={<MLEFFormPage />} />
            <Route path="cases/:id/post-mortem/new" element={<PostMortemFormPage />} />
            <Route path="cases/:id/postmortem/:pmId" element={<PostMortemFormPage />} />
            <Route path="cases/:id/autopsy-notification/new" element={<AutopsyNotificationForm />} />

            {/* Specimens */}
            <Route path="specimens" element={<SpecimenListPage />} />
            <Route path="cases/:id/specimens/new" element={<SpecimenForm />} />
            <Route path="specimens/:id/investigation/new" element={<SpecimenInvestigationForm />} />

            {/* Court */}
            <Route path="court/certificates" element={<CourtCertificateList />} />
            <Route path="court/certificates/new" element={<CourtCertificateForm />} />
            <Route path="court/receipts" element={<CertificateOfReceiptForm />} />
            <Route path="court/summons" element={<CourtSummonsList />} />
            <Route path="court/summons/new" element={<CourtSummonsForm />} />

            {/* System */}
            <Route path="audit-trail" element={<AuditLogList />} />
            <Route path="users" element={<UserList />} />
            <Route path="roles" element={<RolesPermissionsPage />} />

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
