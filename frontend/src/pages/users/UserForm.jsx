// src/pages/users/UserForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle, UserPlus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { ROLES } from '../../contexts/AuthContext';

export default function UserForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '', username: '', email: '', role: '', status: 'Active', password: '', confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate('/users'), 1500);
  };

  return (
    <div>
      <PageHeader 
        title="Create System User" 
        breadcrumbs={[{ label: 'System' }, { label: 'Users', path: '/users' }, { label: 'New' }]} 
        icon={UserPlus}
      />
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700"><CheckCircle className="h-4 w-4" /> User created successfully.</div>}
      
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-3xl">
        <FormSection title="User Profile">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username *</label>
              <input type="text" value={form.username} onChange={(e) => handleChange('username', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role *</label>
              <select value={form.role} onChange={(e) => handleChange('role', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.role ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                <option value="">Select Role</option>
                {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Security">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password *</label>
              <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Create User</>}
          </button>
          <button type="button" onClick={() => navigate('/users')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
