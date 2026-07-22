// src/pages/autopsy/AutopsyNotificationForm.jsx
// Health 1328 — Autopsy Notification Form
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { autopsyNotifications } from '../../data/mockData';

export default function AutopsyNotificationForm() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = autopsyNotifications.find((a) => a.caseId === parseInt(caseId));
  const R = !!existing;

  const [form, setForm] = useState({
    hospitalName: existing?.hospitalName || '',
    pmSerialNo: existing?.pmSerialNo || '',
    inquirerName: existing?.inquirerName || '',
    inquirerDesignation: existing?.inquirerDesignation || '',
    courtCaseNo: existing?.courtCaseNo || '',
    inquestNo: existing?.inquestNo || '',
    deceasedName: existing?.deceasedName || '',
    deceasedAge: existing?.deceasedAge || '',
    deceasedSex: existing?.deceasedSex || '',
    placeOfDeath: existing?.placeOfDeath || '',
    dateOfDeath: existing?.dateOfDeath || '',
    timeOfDeath: existing?.timeOfDeath || '',
    hospitalOfDeath: existing?.hospitalOfDeath || '',
    bhtNo: existing?.bhtNo || '',
    wardNo: existing?.wardNo || '',
    causeImmediate: existing?.causeOfDeath?.immediate || '',
    causeAntecedentB: existing?.causeOfDeath?.antecedentB || '',
    causeAntecedentC: existing?.causeOfDeath?.antecedentC || '',
    causeAntecedentD: existing?.causeOfDeath?.antecedentD || '',
    causeContributory: existing?.causeOfDeath?.contributory || '',
    approximateInterval: existing?.causeOfDeath?.approximateInterval || '',
    underInvestigation: existing?.underInvestigation ?? null,
    specimensRetained: existing?.specimensRetained ?? null,
    specimensList: existing?.specimensList || '',
    maternalDeath: existing?.maternalDeath ?? null,
    maternalType: existing?.maternalType || '',
    comments: existing?.comments || '',
    conductedByName: existing?.conductedByName || '',
    conductedByDesignation: existing?.conductedByDesignation || '',
    conductedByDate: existing?.conductedByDate || '',
    tentativeReportTime: existing?.tentativeReportTime || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.pmSerialNo.trim()) newErrors.pmSerialNo = 'PM Serial No. is required.';
    if (!form.deceasedName.trim()) newErrors.deceasedName = 'Deceased name is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/cases/${caseId}`), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Autopsy Notification (Health 1328)"
        breadcrumbs={[
          { label: 'Cases', path: '/cases' },
          { label: `Case ${caseId}`, path: `/cases/${caseId}` },
          { label: 'Autopsy Notification' },
        ]}
      />

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" /> Autopsy notification saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-5xl">
        <FormSection title="Institution & Inquirer Details">
          <div className="grid grid-cols-3 gap-4">
            <FF label="Hospital / Institution Name"><input type="text" value={form.hospitalName} onChange={(e) => handleChange('hospitalName', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Post Mortem S/N" error={errors.pmSerialNo} required><input type="text" value={form.pmSerialNo} onChange={(e) => handleChange('pmSerialNo', e.target.value)} className={ic(errors.pmSerialNo)} readOnly={R} /></FF>
            <FF label="Name of Inquirer"><input type="text" value={form.inquirerName} onChange={(e) => handleChange('inquirerName', e.target.value)} className={ic()} readOnly={R} /></FF>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Designation of Inquirer</label>
              <div className="flex gap-4 mt-1">
                {['Magistrate', 'Inquirer into Sudden Deaths', 'Area'].map((d) => (
                  <label key={d} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" name="inquirerDesignation" value={d} checked={form.inquirerDesignation === d} onChange={(e) => handleChange('inquirerDesignation', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> {d}
                  </label>
                ))}
              </div>
            </div>
            <FF label="Court Case No."><input type="text" value={form.courtCaseNo} onChange={(e) => handleChange('courtCaseNo', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Inquest No."><input type="text" value={form.inquestNo} onChange={(e) => handleChange('inquestNo', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="Deceased Details">
          <div className="grid grid-cols-3 gap-4">
            <FF label="Full Name" error={errors.deceasedName} required><input type="text" value={form.deceasedName} onChange={(e) => handleChange('deceasedName', e.target.value)} className={ic(errors.deceasedName)} readOnly={R} /></FF>
            <FF label="Age"><input type="number" min="0" value={form.deceasedAge} onChange={(e) => handleChange('deceasedAge', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Sex">
              <select value={form.deceasedSex} onChange={(e) => handleChange('deceasedSex', e.target.value)} className={ic()} disabled={R}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FF>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Place of Death</label>
              <div className="flex gap-4 mt-1">
                {['At Scene', 'At Hospital on Admission'].map((p) => (
                  <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" name="placeOfDeath" value={p} checked={form.placeOfDeath === p} onChange={(e) => handleChange('placeOfDeath', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> {p}
                  </label>
                ))}
              </div>
            </div>
            <FF label="Date of Death"><input type="date" value={form.dateOfDeath} onChange={(e) => handleChange('dateOfDeath', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Time of Death"><input type="time" value={form.timeOfDeath} onChange={(e) => handleChange('timeOfDeath', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Hospital Name (if at hospital)"><input type="text" value={form.hospitalOfDeath} onChange={(e) => handleChange('hospitalOfDeath', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="BHT No."><input type="text" value={form.bhtNo} onChange={(e) => handleChange('bhtNo', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Ward No."><input type="text" value={form.wardNo} onChange={(e) => handleChange('wardNo', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="Cause of Death">
          <div className="space-y-3 border border-gray-200 rounded p-4 bg-gray-50">
            <FF label="Ia. Immediate Cause"><input type="text" value={form.causeImmediate} onChange={(e) => handleChange('causeImmediate', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Ib. Antecedent Cause"><input type="text" value={form.causeAntecedentB} onChange={(e) => handleChange('causeAntecedentB', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Ic. Antecedent Cause"><input type="text" value={form.causeAntecedentC} onChange={(e) => handleChange('causeAntecedentC', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Id. Antecedent Cause"><input type="text" value={form.causeAntecedentD} onChange={(e) => handleChange('causeAntecedentD', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="II. Contributory Causes"><input type="text" value={form.causeContributory} onChange={(e) => handleChange('causeContributory', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Approximate interval between onset and death"><input type="text" value={form.approximateInterval} onChange={(e) => handleChange('approximateInterval', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="Investigation & Specimens">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">7.1 Is cause of death under investigation?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="underInvestigation" checked={form.underInvestigation === true} onChange={() => handleChange('underInvestigation', true)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> Yes</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="underInvestigation" checked={form.underInvestigation === false} onChange={() => handleChange('underInvestigation', false)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> No</label>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">7.2 If yes, specimens retained for further investigation?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="specimensRetained" checked={form.specimensRetained === true} onChange={() => handleChange('specimensRetained', true)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> Yes</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="specimensRetained" checked={form.specimensRetained === false} onChange={() => handleChange('specimensRetained', false)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> No</label>
              </div>
            </div>
            <FF label="7.3 List specimens retained and institutions referred to"><textarea value={form.specimensList} onChange={(e) => handleChange('specimensList', e.target.value)} rows={3} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="8. Maternal Death">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Is this a maternal death?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="maternalDeath" checked={form.maternalDeath === true} onChange={() => handleChange('maternalDeath', true)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> Yes</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="maternalDeath" checked={form.maternalDeath === false} onChange={() => handleChange('maternalDeath', false)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> No</label>
              </div>
            </div>
            {form.maternalDeath && (
              <div className="ml-4 flex gap-4">
                {['8.1 Direct', '8.2 Indirect', '8.3 Incidental'].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="maternalType" value={t} checked={form.maternalType === t} onChange={(e) => handleChange('maternalType', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> {t}
                  </label>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title="9. Comments & Opinions">
          <textarea value={form.comments} onChange={(e) => handleChange('comments', e.target.value)} rows={4} className={ic()} readOnly={R} placeholder="1. &#10;2. " />
        </FormSection>

        <FormSection title="10. Autopsy Conducted By">
          <div className="grid grid-cols-3 gap-4">
            <FF label="10.1 Name"><input type="text" value={form.conductedByName} onChange={(e) => handleChange('conductedByName', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="10.2 Designation"><input type="text" value={form.conductedByDesignation} onChange={(e) => handleChange('conductedByDesignation', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="10.3 Date"><input type="date" value={form.conductedByDate} onChange={(e) => handleChange('conductedByDate', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 border border-dashed border-gray-300 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature & Official Stamp</p>
              <div className="h-12 mt-1 border-b border-gray-200" />
            </div>
            <FF label="Complete autopsy report will be sent tentatively in">
              <input type="text" value={form.tentativeReportTime} onChange={(e) => handleChange('tentativeReportTime', e.target.value)} placeholder="e.g. 6 weeks" className={ic()} readOnly={R} />
            </FF>
          </div>
        </FormSection>

        {!R && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Notification</>}
            </button>
            <button type="button" onClick={() => navigate(`/cases/${caseId}`)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}

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

function ic(error) {
  return `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] read-only:bg-gray-50 read-only:text-gray-600 disabled:bg-gray-50 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
}
