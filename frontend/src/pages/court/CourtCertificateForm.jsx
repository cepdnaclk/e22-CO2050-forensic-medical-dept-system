// src/pages/court/CourtCertificateForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { cases, courts, postMortemReports } from '../../data/mockData';

export default function CourtCertificateForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ caseId: '', courtId: '', pmReportId: '', trialDate: '', dispatchDate: '', registrarSignatureRef: '' });

  const handleChange = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate('/court/certificates'), 1500);
  };

  return (
    <div>
      <PageHeader title="New Court Certificate" breadcrumbs={[{ label: 'Court', path: '/court/certificates' }, { label: 'Certificates', path: '/court/certificates' }, { label: 'New' }]} />
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700"><CheckCircle className="h-4 w-4" /> Certificate created.</div>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-3xl">
        <FormSection title="Certificate Details">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Case *</label><select value={form.caseId} onChange={(e) => handleChange('caseId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"><option value="">Select case</option>{cases.map((c) => <option key={c.id} value={c.id}>{c.caseNo}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Court *</label><select value={form.courtId} onChange={(e) => handleChange('courtId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"><option value="">Select court</option>{courts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PM Report</label><select value={form.pmReportId} onChange={(e) => handleChange('pmReportId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"><option value="">Select PM report</option>{postMortemReports.map((pm) => <option key={pm.id} value={pm.id}>{pm.pmSerialNo}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Trial Date *</label><input type="date" value={form.trialDate} onChange={(e) => handleChange('trialDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dispatch Date</label><input type="date" value={form.dispatchDate} onChange={(e) => handleChange('dispatchDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Registrar Signature Ref</label><input type="text" value={form.registrarSignatureRef} onChange={(e) => handleChange('registrarSignatureRef', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
        </FormSection>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Create Certificate</>}</button>
          <button type="button" onClick={() => navigate('/court/certificates')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
