// src/pages/specimens/SpecimenForm.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';

const SPECIMEN_TYPES = ['Blood', 'Vitreous', 'Stomach contents', 'Tissue', 'Hair', 'Nails', 'Other'];

export default function SpecimenForm() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    specimenType: '', dateRetained: new Date().toISOString().split('T')[0],
    purpose: '', storageLocation: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.specimenType) newErrors.specimenType = 'Specimen type is required.';
    if (!form.dateRetained) newErrors.dateRetained = 'Date is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/cases/${caseId}`), 1500);
  };

  return (
    <div>
      <PageHeader title="Add Specimen" breadcrumbs={[{ label: 'Cases', path: '/cases' }, { label: `Case ${caseId}`, path: `/cases/${caseId}` }, { label: 'Add Specimen' }]} />
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700"><CheckCircle className="h-4 w-4" /> Specimen recorded.</div>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-3xl">
        <FormSection title="Specimen Details">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Specimen Type *</label><select value={form.specimenType} onChange={(e) => handleChange('specimenType', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.specimenType ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}><option value="">Select type</option>{SPECIMEN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>{errors.specimenType && <p className="text-xs text-red-600 mt-1">{errors.specimenType}</p>}</div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Retained *</label><input type="date" value={form.dateRetained} onChange={(e) => handleChange('dateRetained', e.target.value)} className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] ${errors.dateRetained ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} /></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Purpose</label><textarea value={form.purpose} onChange={(e) => handleChange('purpose', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Storage Location</label><input type="text" value={form.storageLocation} onChange={(e) => handleChange('storageLocation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
        </FormSection>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Specimen</>}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
