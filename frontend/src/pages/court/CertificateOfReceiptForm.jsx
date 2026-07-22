// src/pages/court/CertificateOfReceiptForm.jsx
// Mirrors the real Sri Lankan court receipt form
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { courtReceipts } from '../../data/mockData';

export default function CertificateOfReceiptForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Show existing receipt if available, otherwise new form
  const existing = courtReceipts[0];

  const [form, setForm] = useState({
    courtType: existing?.courtType || '',
    courtOf: existing?.courtOf || '',
    dateOfTrial: existing?.dateOfTrial || '',
    caseNumber: existing?.caseNumber || '',
    personName: existing?.personName || '',
    reportType: existing?.reportType || '',
    mlefPmNo: existing?.mlefPmNo || '',
    serialNo: existing?.serialNo || '',
    examinationDate: existing?.examinationDate || '',
    reportDispatchedOn: existing?.reportDispatchedOn || '',
    registrarSignature: existing?.registrarSignature || '',
    registrarDate: existing?.registrarDate || '',
  });

  const handleChange = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate('/court/receipts'), 1500);
  };

  return (
    <div>
      <PageHeader title="Certificate of Receipt" breadcrumbs={[{ label: 'Court' }, { label: 'Receipts', path: '/court/receipts' }, { label: 'Certificate of Receipt' }]} />
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700"><CheckCircle className="h-4 w-4" /> Certificate saved.</div>}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-4xl">
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-500 italic mb-2">
            "Registrar, please complete and return at your earliest."
          </p>
        </div>

        <FormSection title="Court Details">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Court Type</label>
              <div className="flex gap-3 mt-1">
                {['Magistrate', 'District', 'High'].map((t) => (
                  <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" name="courtType" value={t} checked={form.courtType === t} onChange={(e) => handleChange('courtType', e.target.value)} className="border-gray-300 text-[#1e3a5f]" /> {t}
                  </label>
                ))}
              </div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Court of</label><input type="text" value={form.courtOf} onChange={(e) => handleChange('courtOf', e.target.value)} placeholder="e.g. Kandy" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Trial</label><input type="date" value={form.dateOfTrial} onChange={(e) => handleChange('dateOfTrial', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Case Number</label><input type="text" value={form.caseNumber} onChange={(e) => handleChange('caseNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
        </FormSection>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            <em>"I do hereby certify that the Medico-Legal Report(s) / Post-Mortem Examination Report(s) in respect of:"</em>
          </p>
        </div>

        <FormSection title="Report Details">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name of Injured / Deceased</label><input type="text" value={form.personName} onChange={(e) => handleChange('personName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Report Type</label><input type="text" value={form.reportType} onChange={(e) => handleChange('reportType', e.target.value)} placeholder="e.g. Post-Mortem Examination Report" className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">MLEF / PM No.</label><input type="text" value={form.mlefPmNo} onChange={(e) => handleChange('mlefPmNo', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Serial No.</label><input type="text" value={form.serialNo} onChange={(e) => handleChange('serialNo', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Examination Date</label><input type="date" value={form.examinationDate} onChange={(e) => handleChange('examinationDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Report Dispatched On</label><input type="date" value={form.reportDispatchedOn} onChange={(e) => handleChange('reportDispatchedOn', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
        </FormSection>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <p className="text-sm text-gray-700 italic">
            "Has/have been duly received by this court."
          </p>
        </div>

        <FormSection title="Registrar Confirmation">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Registrar Name</label><input type="text" value={form.registrarSignature} onChange={(e) => handleChange('registrarSignature', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label><input type="date" value={form.registrarDate} onChange={(e) => handleChange('registrarDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" /></div>
          </div>
          <div className="mt-4 p-3 border border-dashed border-gray-300 rounded">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Signature & Seal of Registrar</p>
            <div className="h-12 mt-1 border-b border-gray-200" />
          </div>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Receipt</>}</button>
          <button type="button" onClick={() => navigate('/court/receipts')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
