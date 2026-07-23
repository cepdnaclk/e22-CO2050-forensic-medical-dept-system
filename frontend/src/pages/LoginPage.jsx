// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [localError, setLocalError] = useState('');

  const sessionMessage = location.state?.message;

  // Check if username requires MFA
  const mfaUsernames = ['admin', 'dr.wickramasinghe', 'dr.silva'];

  const handleUsernameBlur = () => {
    setShowMFA(mfaUsernames.includes(username));
  };

  const handleQuickLogin = (user, pass, mfa) => {
    setUsername(user);
    setPassword(pass);
    if (mfa) {
      setMfaCode(mfa);
      setShowMFA(true);
    } else {
      setMfaCode('');
      setShowMFA(false);
    }
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!username.trim()) {
      setLocalError('Username is required.');
      return;
    }
    if (!password.trim()) {
      setLocalError('Password is required.');
      return;
    }
    if (showMFA && !mfaCode.trim()) {
      setLocalError('MFA code is required for this account.');
      return;
    }

    try {
      await login(username.trim(), password, mfaCode || undefined);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      // Error is handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Institutional Header */}
      <div
        className="py-12 relative bg-[#1e3a5f]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(30, 58, 95, 0.5), rgba(30, 58, 95, 0.75)), url('/images/landscape.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-lg mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center justify-center h-28 w-28 mb-4 bg-white rounded-full shadow-lg ring-4 ring-white/20 overflow-hidden">
            <img src="/images/logo.jpg" alt="University Logo" className="h-full w-full object-cover scale-[1.10]" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide">
            Department of Forensic Medicine
          </h1>
          <p className="text-white/80 text-sm mt-2 font-medium uppercase tracking-wider">
            Faculty of Medicine, University of Peradeniya
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-start justify-center pt-10 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-[#1e3a5f]" />
              <h2 className="text-base font-semibold text-gray-900">Secure Login</h2>
            </div>

            {/* Session expired message */}
            {sessionMessage && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                {sessionMessage}
              </div>
            )}

            {/* Error message */}
            {displayError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={handleUsernameBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>

              {/* MFA Code — conditional */}
              {showMFA && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    MFA Verification Code
                  </label>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Required for Administrator and JMO accounts.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Secure Login
                  </>
                )}
              </button>
            </form>

            {/* Forgot password */}
            <div className="mt-4 text-center">
              <button className="text-xs text-gray-400 hover:text-gray-600">
                Forgot your password? Contact the system administrator.
              </button>
            </div>
          </div>

          {/* Dev Quick Login */}
          <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 text-center">Development Quick Login</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickLogin('admin', 'admin123', '123456')}
                className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded border border-blue-200 transition-colors"
                type="button"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickLogin('dr.wickramasinghe', 'jmo123', '123456')}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-medium rounded border border-emerald-200 transition-colors"
                type="button"
              >
                JMO
              </button>
              <button
                onClick={() => handleQuickLogin('registrar.kandy', 'reg123', '')}
                className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded border border-purple-200 transition-colors"
                type="button"
              >
                Registrar
              </button>
              <button
                onClick={() => handleQuickLogin('si.perera', 'police123', '')}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded border border-amber-200 transition-colors"
                type="button"
              >
                Police
              </button>
              <button
                onClick={() => handleQuickLogin('clerk.fernando', 'clerk123', '')}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded border border-slate-300 transition-colors"
                type="button"
              >
                Records Clerk
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">Click a role to auto-fill credentials, then click Secure Login.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-400">
          FMDIS v1.0 — Department of Forensic Medicine, University of Peradeniya
        </p>
      </footer>
    </div>
  );
}
