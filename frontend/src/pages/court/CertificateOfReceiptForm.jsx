// src/pages/court/CertificateOfReceiptForm.jsx
// Mirrors the real Sri Lankan court receipt form
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import StickyActionBar from '../../components/shared/StickyActionBar';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { courtReceipts, cases, courts, medicalOfficers } from '../../data/mockData';

const ic = (err) => `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] ${err ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
const roIc = 'w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-[#f8fafc] cursor-not-allowed';

function FF({ label, children, error, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default function CertificateOfReceiptForm() {
  const navigate = useNavigate();
  const { id: caseId } = useParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = courtReceipts.find((c) => c.caseId === parseInt(caseId));
  const isRegistrar = user?.role === ROLES.REGISTRAR || user?.role === ROLES.ADMIN;
  const R = !!existing || !isRegistrar;

  const linkedCase = cases.find((c) => c.id === parseInt(caseId));

  const [form, setForm] = useState({
    courtType: existing?.courtType || linkedCase?.court?.name?.split('Court')[0]?.trim() || '',
    courtOf: existing?.courtOf || linkedCase?.court?.name?.split('of')[1]?.trim() || '',
    dateOfTrial: existing?.dateOfTrial || '',
    caseNumber: existing?.caseNumber || linkedCase?.courtCaseNo || '',
    personName: existing?.personName || linkedCase?.parties?.[0]?.name || '',
    reports: existing?.reports || [
      { reportType: 'MLEF', mlefPmNo: '', serialNo: '', examinationDate: '', reportDispatchedOn: '' }
    ],
    registrarSignature: existing?.registrarSignature || '',
    registrarDate: existing?.registrarDate || new Date().toISOString().split('T')[0],
  });

  const h = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const addReport = () => setForm((p) => ({ ...p, reports: [...p.reports, { reportType: 'MLEF', mlefPmNo: '', serialNo: '', examinationDate: '', reportDispatchedOn: '' }] }));
  const removeReport = (i) => setForm((p) => ({ ...p, reports: p.reports.filter((_, idx) => idx !== i) }));
  const updateReport = (i, field, val) => setForm((p) => ({ ...p, reports: p.reports.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const handleSubmit = async () => {
    const e = {};
    if (!form.caseNumber.trim()) e.caseNumber = 'Required';
    if (!form.courtType.trim()) e.courtType = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate('/court-docs'), 1500);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSuccess(true);
  };

  const field = (label, key, type = 'text', opts = {}) => {
    if (R) return <FF label={label}><div className={roIc}>{form[key] || '—'}</div></FF>;
    return <FF label={label} error={errors[key]} required={opts.required}><input type={type} value={form[key]} onChange={(e) => h(key, e.target.value)} className={ic(errors[key])} /></FF>;
  };

  return (
    <div>
      <PageHeader
        title="Certificate of Receipt"
        subtitle="Receipt of Medico-Legal Examination Report / Post Mortem Report"
        breadcrumbs={[
          { label: 'Court Docs', path: '/court-docs' },
          { label: 'New Certificate' },
        ]}
      />

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" /> Certificate of Receipt saved successfully.
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl">
        <FormSection title="Certificate Details" filledByRole="REGISTRAR">
          <p className="text-sm text-gray-500 italic mb-6">
            (To be filled by the Registrar of the Court and sent back to the Judicial Medical Officer)
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">To: The</span>
                {R ? <span className="font-semibold">{form.courtType || '_____'}</span> : (
                  <select value={form.courtType} onChange={(e) => h('courtType', e.target.value)} className={ic(errors.courtType)}>
                    <option value="">Select</option>
                    <option value="Magistrate">Magistrate</option>
                    <option value="District Judge">District Judge</option>
                    <option value="High Court Judge">High Court Judge</option>
                  </select>
                )}
                <span className="text-sm font-medium">Court of</span>
                {R ? <span className="font-semibold">{form.courtOf || '_____'}</span> : (
                  <input type="text" value={form.courtOf} onChange={(e) => h('courtOf', e.target.value)} className={ic()} placeholder="e.g. Kandy" />
                )}
              </div>
            </div>
            <div className="space-y-4">
              {field('Date of Trial (if known)', 'dateOfTrial', 'date')}
              {field('Case Number', 'caseNumber', 'text', { required: true })}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-sm text-gray-800 leading-relaxed">
            I hereby acknowledge the receipt of the Medico-Legal Examination Report / Post Mortem Report of
            <span className="inline-block mx-2 font-semibold min-w-[200px] border-b border-gray-400">
              {R ? (form.personName || '') : <input type="text" value={form.personName} onChange={(e) => h('personName', e.target.value)} className="w-full bg-transparent outline-none" placeholder="Name of Person" />}
            </span>
            examined by Dr.
            <span className="inline-block ml-2 font-semibold min-w-[200px] border-b border-gray-400">
              {linkedCase?.assignedJMO?.fullName || medicalOfficers[0].fullName}
            </span>
            <br className="mb-2" />
            (Judicial Medical Officer / Medical Officer)
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reports Received</label>
              {!R && <button type="button" onClick={addReport} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Report</button>}
            </div>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Report Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">MLEF/PM No.</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Serial No.</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Exam Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Dispatched On</th>
                    {!R && <th className="w-10" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.reports.map((rep, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        {R ? <span>{rep.reportType}</span> : (
                          <select value={rep.reportType} onChange={(e) => updateReport(i, 'reportType', e.target.value)} className={ic()}>
                            <option>MLEF</option><option>PM Report</option>
                          </select>
                        )}
                      </td>
                      <td className="px-3 py-2">{R ? <span>{rep.mlefPmNo || '—'}</span> : <input type="text" value={rep.mlefPmNo} onChange={(e) => updateReport(i, 'mlefPmNo', e.target.value)} className={ic()} />}</td>
                      <td className="px-3 py-2">{R ? <span>{rep.serialNo || '—'}</span> : <input type="text" value={rep.serialNo} onChange={(e) => updateReport(i, 'serialNo', e.target.value)} className={ic()} />}</td>
                      <td className="px-3 py-2">{R ? <span>{rep.examinationDate || '—'}</span> : <input type="date" value={rep.examinationDate} onChange={(e) => updateReport(i, 'examinationDate', e.target.value)} className={ic()} />}</td>
                      <td className="px-3 py-2">{R ? <span>{rep.reportDispatchedOn || '—'}</span> : <input type="date" value={rep.reportDispatchedOn} onChange={(e) => updateReport(i, 'reportDispatchedOn', e.target.value)} className={ic()} />}</td>
                      {!R && <td className="px-2"><button type="button" onClick={() => removeReport(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-gray-200">
            <div className="p-3 border border-dashed border-gray-300 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Registrar & Seal</p>
              <div className="h-16 mt-1 border-b border-gray-200 flex items-end justify-center">
                {R && <span className="font-serif italic text-gray-700">{form.registrarSignature}</span>}
              </div>
            </div>
            <div className="flex flex-col justify-end">
              {field('Date', 'registrarDate', 'date')}
            </div>
          </div>
        </FormSection>

        {!R && (
          <StickyActionBar
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            onCancel={() => navigate('/court-docs')}
            isSubmitting={isSubmitting}
            isSaving={isSaving}
            disabled={success}
          />
        )}
      </form>
    </div>
  );
}
