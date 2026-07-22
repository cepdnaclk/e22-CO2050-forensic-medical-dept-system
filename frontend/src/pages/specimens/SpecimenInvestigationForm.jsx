// src/pages/specimens/SpecimenInvestigationForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';

const TEST_TYPES = ['Histology', 'Serology', 'Toxicology', 'Other'];

export default function SpecimenInvestigationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    labName: '', testType: '', result: '', resultDate: '',
  });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(-1), 1500);
  };

  return (
    <div>
      <PageHeader title="Add Lab Investigation" breadcrumbs={[{ label: 'Specimens' }, { label: 'Lab Investigation' }]} />
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700"><CheckCircle className="h-4 w-4" /> Investigation result saved.</div>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-3xl">
        <FormSection title="Investigation Details">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Lab Name</label><input type="text" value={form.labName} onChange={(e) => handleChange('labName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Test Type</label><select value={form.testType} onChange={(e) => handleChange('testType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"><option value="">Select type</option>{TEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Result</label><textarea value={form.result} onChange={(e) => handleChange('result', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Result Date</label><input type="date" value={form.resultDate} onChange={(e) => handleChange('resultDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
        </FormSection>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Result</>}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
