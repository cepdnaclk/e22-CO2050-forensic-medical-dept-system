// src/pages/autopsy/AutopsyNotificationForm.jsx
// Health 1328 — Autopsy Notification Form — JMO only
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import StickyActionBar from '../../components/shared/StickyActionBar';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { autopsyNotifications, medicalOfficers } from '../../data/mockData';
import { examinationService } from '../../services/api';

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

export default function AutopsyNotificationForm() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = autopsyNotifications.find((a) => a.caseId === parseInt(caseId));
  const isJMO = user?.role === ROLES.JMO || user?.role === ROLES.ADMIN;
  const R = !!existing || !isJMO;
  const linkedMO = medicalOfficers.find((m) => m.userId === user?.id);

  const [form, setForm] = useState({
    hospitalName: existing?.hospitalName || '',
    pmSerialNo: existing?.pmSerialNo || '',
    inquirerName: existing?.inquirerName || '',
    inquirerTypes: existing?.inquirerDesignation ? [existing.inquirerDesignation] : [],
    courtCaseNo: existing?.courtCaseNo || '',
    inquestNo: existing?.inquestNo || '',
    deceasedName: existing?.deceasedName || '',
    deceasedAge: existing?.deceasedAge || '',
    deceasedSex: existing?.deceasedSex || '',
    placeOfDeath: existing?.placeOfDeath || '',
    hospitalOfDeath: existing?.hospitalOfDeath || '',
    bhtNo: existing?.bhtNo || '',
    wardNo: existing?.wardNo || '',
    deathDD: existing?.dateOfDeath?.split('-')[2] || '',
    deathMM: existing?.dateOfDeath?.split('-')[1] || '',
    deathYY1: existing?.dateOfDeath?.substring(0, 2) || '20',
    deathYY2: existing?.dateOfDeath?.substring(2, 4) || '25',
    deathHH: existing?.timeOfDeath?.split(':')[0] || '',
    deathMin: existing?.timeOfDeath?.split(':')[1] || '',
    deathAMPM: 'AM',
    causeImmediate: existing?.causeOfDeath?.immediate || '',
    causeIntervalIa: existing?.causeOfDeath?.approximateInterval || '',
    causeAntecedentB: existing?.causeOfDeath?.antecedentB || '',
    causeIntervalIb: '',
    causeAntecedentC: existing?.causeOfDeath?.antecedentC || '',
    causeIntervalIc: '',
    causeAntecedentD: existing?.causeOfDeath?.antecedentD || '',
    causeIntervalId: '',
    causeContributory: existing?.causeOfDeath?.contributory || '',
    underInvestigation: existing?.underInvestigation ?? null,
    specimensRetained: existing?.specimensRetained ?? null,
    specimensList: existing?.specimensList || '',
    maternalDeath: existing?.maternalDeath ?? null,
    maternalType: existing?.maternalType || '',
    comment1: existing?.comments?.split('\n')[0]?.replace(/^1\.\s*/, '') || '',
    comment2: existing?.comments?.split('\n')[1]?.replace(/^2\.\s*/, '') || '',
    conductedByName: existing?.conductedByName || linkedMO?.fullName || '',
    conductedByDesignation: existing?.conductedByDesignation || linkedMO?.designation || '',
    conductedDD: existing?.conductedByDate?.split('-')[2] || '',
    conductedMM: existing?.conductedByDate?.split('-')[1] || '',
    conductedYY1: existing?.conductedByDate?.substring(0, 2) || '20',
    conductedYY2: existing?.conductedByDate?.substring(2, 4) || '25',
    tentativeReportTime: existing?.tentativeReportTime || '',
  });

  const h = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleInquirerType = (type) => {
    setForm((prev) => ({
      ...prev,
      inquirerTypes: prev.inquirerTypes.includes(type)
        ? prev.inquirerTypes.filter((t) => t !== type)
        : [...prev.inquirerTypes, type],
    }));
  };

  const handleSubmit = async () => {
    const e = {};
    if (!form.pmSerialNo.trim()) e.pmSerialNo = 'Required';
    if (!form.deceasedName.trim()) e.deceasedName = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setIsSubmitting(true);
    try {
      await examinationService.createAutopsyNotification({
        case_id: parseInt(caseId) || null,
        pm_serial_no: form.pmSerialNo,
        hospital_name: form.hospitalName || null,
        inquirer_name: form.inquirerName || null,
        inquirer_designation: form.inquirerTypes.join(', ') || null,
        court_case_no: form.courtCaseNo || null,
        inquest_no: form.inquestNo || null,
        name_of_deceased: form.deceasedName || null,
        age: parseInt(form.deceasedAge) || null,
        sex: form.deceasedSex || null,
        date_of_death: `${form.deathYY1}${form.deathYY2}-${form.deathMM}-${form.deathDD}` || null,
        time_of_death: `${form.deathHH}:${form.deathMin} ${form.deathAMPM}` || null,
        place_of_death: form.placeOfDeath || null,
        hospital_of_death: form.hospitalOfDeath || null,
        bht_number: form.bhtNo || null,
        ward: form.wardNo || null,
        cause_of_death: {
          immediate: form.causeImmediate, antecedentB: form.causeAntecedentB,
          antecedentC: form.causeAntecedentC, antecedentD: form.causeAntecedentD,
          contributory: form.causeContributory, approximateInterval: form.causeIntervalIa
        },
        under_investigation: form.underInvestigation,
        specimens_retained: form.specimensRetained,
        specimens_list: form.specimensList || null,
        maternal_death: form.maternalDeath,
        maternal_type: form.maternalType || null,
        comments: `1. ${form.comment1}\n2. ${form.comment2}`,
        conducted_by_name: form.conductedByName || null,
        conducted_by_designation: form.conductedByDesignation || null,
        conducted_date: `${form.conductedYY1}${form.conductedYY2}-${form.conductedMM}-${form.conductedDD}` || null,
        tentative_report_time: form.tentativeReportTime || null,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/cases/${caseId}`), 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.response?.data?.detail || err.message || 'Failed to save notification.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSuccess(true);
  };

  const isHospital = form.placeOfDeath === 'At the Hospital on Admission' || form.placeOfDeath === 'At the Hospital during Stay';
  const smallInput = 'w-12 px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]';

  const field = (label, key, type = 'text', opts = {}) => {
    if (R) return <FF label={label}><div className={roIc}>{form[key] || '—'}</div></FF>;
    if (type === 'textarea') return <FF label={label} error={errors[key]} required={opts.required}><textarea value={form[key]} onChange={(e) => h(key, e.target.value)} rows={opts.rows || 2} className={ic(errors[key])} /></FF>;
    return <FF label={label} error={errors[key]} required={opts.required}><input type={type} value={form[key]} onChange={(e) => h(key, e.target.value)} className={ic(errors[key])} /></FF>;
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
          <CheckCircle className="h-4 w-4" /> Action completed successfully.
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="max-w-5xl">
        {/* Institution & Inquirer */}
        <FormSection title="Institution & Inquirer Details" filledByRole="JMO">
          <div className="grid grid-cols-3 gap-4">
            {field('Hospital / Institution Name', 'hospitalName')}
            {field('Post Mortem S/N', 'pmSerialNo', 'text', { required: true })}
            {field('Name of Inquirer', 'inquirerName')}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inquirer Type (tick appropriate)</label>
            <div className="flex gap-6">
              {['Magistrate', 'Inquirer into Sudden Deaths', 'Area'].map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.inquirerTypes.includes(t)}
                    onChange={() => !R && toggleInquirerType(t)}
                    className="rounded border-gray-300 text-[#1e3a5f]" disabled={R} />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {field('Court Case No. / Inquest No.', 'courtCaseNo')}
            {field('Inquest No.', 'inquestNo')}
          </div>
        </FormSection>

        {/* Deceased Details */}
        <FormSection title="Details of Deceased" filledByRole="JMO">
          <div className="grid grid-cols-3 gap-4">
            {field('Full Name', 'deceasedName', 'text', { required: true })}
            {field('Age', 'deceasedAge', 'number')}
            <FF label="Sex">
              {R ? <div className={roIc}>{form.deceasedSex || '—'}</div> : (
                <div className="flex gap-4 mt-1">
                  {['Male', 'Female'].map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="deceasedSex" value={s} checked={form.deceasedSex === s} onChange={(e) => h('deceasedSex', e.target.value)} className="border-gray-300 text-[#1e3a5f]" /> {s}
                    </label>
                  ))}
                </div>
              )}
            </FF>
          </div>

          {/* Place of Death */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Place of Death</label>
            <div className="flex flex-wrap gap-4">
              {['At the Scene', 'At the Hospital on Admission', 'At the Hospital during Stay'].map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="placeOfDeath" value={p} checked={form.placeOfDeath === p}
                    onChange={(e) => h('placeOfDeath', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> {p}
                </label>
              ))}
            </div>
          </div>

          {/* Conditional hospital fields */}
          {isHospital && (
            <div className="grid grid-cols-3 gap-4 mt-3 pl-6 border-l-2 border-blue-200">
              {field('Hospital Name', 'hospitalOfDeath')}
              {field('BHT No.', 'bhtNo')}
              {field('Ward No.', 'wardNo')}
            </div>
          )}

          {/* Date of Death — DD MM YYYY */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date of Death</label>
            {R ? <div className={roIc}>{`${form.deathDD}/${form.deathMM}/${form.deathYY1}${form.deathYY2}` || '—'}</div> : (
              <div className="flex items-center gap-2">
                <input type="text" maxLength={2} value={form.deathDD} onChange={(e) => h('deathDD', e.target.value)} className={smallInput} placeholder="DD" />
                <span className="text-gray-400">/</span>
                <input type="text" maxLength={2} value={form.deathMM} onChange={(e) => h('deathMM', e.target.value)} className={smallInput} placeholder="MM" />
                <span className="text-gray-400">/</span>
                <input type="text" maxLength={2} value={form.deathYY1} onChange={(e) => h('deathYY1', e.target.value)} className={smallInput} placeholder="YY" />
                <input type="text" maxLength={2} value={form.deathYY2} onChange={(e) => h('deathYY2', e.target.value)} className={smallInput} placeholder="YY" />
              </div>
            )}
          </div>

          {/* Time of Death */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time of Death</label>
            {R ? <div className={roIc}>{`${form.deathHH}:${form.deathMin} ${form.deathAMPM}` || '—'}</div> : (
              <div className="flex items-center gap-2">
                <input type="text" maxLength={2} value={form.deathHH} onChange={(e) => h('deathHH', e.target.value)} className={smallInput} placeholder="HH" />
                <span className="text-gray-400">:</span>
                <input type="text" maxLength={2} value={form.deathMin} onChange={(e) => h('deathMin', e.target.value)} className={smallInput} placeholder="MM" />
                <select value={form.deathAMPM} onChange={(e) => h('deathAMPM', e.target.value)} className="px-2 py-2 border border-gray-300 rounded text-sm">
                  <option>AM</option><option>PM</option>
                </select>
              </div>
            )}
          </div>
        </FormSection>

        {/* Cause of Death Table */}
        <FormSection title="Cause of Death" filledByRole="JMO">
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b"><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-40">Label</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Description</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-40">Approx. Interval</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: 'Immediate Cause (Ia)', key: 'causeImmediate', intKey: 'causeIntervalIa' },
                  { label: 'Antecedent Causes (Ib)', key: 'causeAntecedentB', intKey: 'causeIntervalIb' },
                  { label: '(Ic)', key: 'causeAntecedentC', intKey: 'causeIntervalIc' },
                  { label: '(Id)', key: 'causeAntecedentD', intKey: 'causeIntervalId' },
                  { label: 'Contributory Causes (II)', key: 'causeContributory', intKey: null },
                ].map((row) => (
                  <tr key={row.key}>
                    <td className="px-3 py-2 text-gray-700 font-medium">{row.label}</td>
                    <td className="px-3 py-2">{R ? <span>{form[row.key] || '—'}</span> : <textarea value={form[row.key]} onChange={(e) => h(row.key, e.target.value)} rows={1} className={ic()} />}</td>
                    <td className="px-3 py-2">{row.intKey ? (R ? <span>{form[row.intKey] || '—'}</span> : <input type="text" value={form[row.intKey]} onChange={(e) => h(row.intKey, e.target.value)} className={ic()} placeholder="e.g. Minutes" />) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormSection>

        {/* Investigation & Specimens */}
        <FormSection title="Investigation & Specimens" filledByRole="JMO">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">7.1 Is cause of death under investigation?</p>
              <div className="flex gap-4">
                {[true, false].map((v) => (
                  <label key={String(v)} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="underInvestigation" checked={form.underInvestigation === v}
                      onChange={() => h('underInvestigation', v)} className="border-gray-300 text-[#1e3a5f]" disabled={R} />
                    {v ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>
            {form.underInvestigation === true && (
              <div className="ml-6 border-l-2 border-blue-200 pl-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">7.2 Specimens retained for further investigation?</p>
                <div className="flex gap-4">
                  {[true, false].map((v) => (
                    <label key={String(v)} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="specimensRetained" checked={form.specimensRetained === v}
                        onChange={() => h('specimensRetained', v)} className="border-gray-300 text-[#1e3a5f]" disabled={R} />
                      {v ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
                {form.specimensRetained === true && (
                  <div className="mt-3">
                    {field('7.3 List specimens retained and institutions referred to', 'specimensList', 'textarea', { rows: 3 })}
                  </div>
                )}
              </div>
            )}
          </div>
        </FormSection>

        {/* Maternal Death */}
        <FormSection title="8. Maternal Death" filledByRole="JMO">
          <div className="space-y-3">
            <div className="flex gap-4">
              {[true, false].map((v) => (
                <label key={String(v)} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="maternalDeath" checked={form.maternalDeath === v}
                    onChange={() => h('maternalDeath', v)} className="border-gray-300 text-[#1e3a5f]" disabled={R} />
                  {v ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
            {form.maternalDeath === true && (
              <div className="ml-6 flex gap-4 border-l-2 border-blue-200 pl-4">
                {['8.1 Direct', '8.2 Indirect', '8.3 Incidental'].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="maternalType" value={t} checked={form.maternalType === t}
                      onChange={(e) => h('maternalType', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={R} /> {t}
                  </label>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        {/* Comments & Opinions */}
        <FormSection title="9. Comments and Opinions" filledByRole="JMO">
          <div className="space-y-3">
            <FF label="① Comment 1">
              {R ? <div className={roIc}>{form.comment1 || '—'}</div> : (
                <textarea value={form.comment1} onChange={(e) => h('comment1', e.target.value)} rows={2} className={ic()} />
              )}
            </FF>
            <FF label="② Comment 2">
              {R ? <div className={roIc}>{form.comment2 || '—'}</div> : (
                <textarea value={form.comment2} onChange={(e) => h('comment2', e.target.value)} rows={2} className={ic()} />
              )}
            </FF>
          </div>
        </FormSection>

        {/* Conducted By */}
        <FormSection title="10. Autopsy Conducted By" filledByRole="JMO">
          <div className="grid grid-cols-3 gap-4">
            {field('10.1 Name', 'conductedByName')}
            {field('10.2 Designation', 'conductedByDesignation')}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">10.3 Date</label>
              {R ? <div className={roIc}>{`${form.conductedDD}/${form.conductedMM}/${form.conductedYY1}${form.conductedYY2}` || '—'}</div> : (
                <div className="flex items-center gap-2">
                  <input type="text" maxLength={2} value={form.conductedDD} onChange={(e) => h('conductedDD', e.target.value)} className={smallInput} placeholder="DD" />
                  <span className="text-gray-400">/</span>
                  <input type="text" maxLength={2} value={form.conductedMM} onChange={(e) => h('conductedMM', e.target.value)} className={smallInput} placeholder="MM" />
                  <span className="text-gray-400">/</span>
                  <input type="text" maxLength={2} value={form.conductedYY1} onChange={(e) => h('conductedYY1', e.target.value)} className={smallInput} placeholder="YY" />
                  <input type="text" maxLength={2} value={form.conductedYY2} onChange={(e) => h('conductedYY2', e.target.value)} className={smallInput} placeholder="YY" />
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 border border-dashed border-gray-300 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature & Official Stamp</p>
              <div className="h-12 mt-1 border-b border-gray-200" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-sm text-amber-800 italic">
                "The complete autopsy report will be sent to court/ISD tentatively in{' '}
                {R ? <strong>{form.tentativeReportTime || '___'}</strong> : (
                  <input type="text" value={form.tentativeReportTime} onChange={(e) => h('tentativeReportTime', e.target.value)}
                    className="inline-block w-24 px-2 py-0.5 border border-amber-300 rounded text-sm mx-1" placeholder="6 weeks" />
                )}
                {' '}weeks/months."
              </p>
            </div>
          </div>
        </FormSection>

        {/* Sticky Action Bar */}
        {!R && (
          <StickyActionBar
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            onCancel={() => navigate(`/cases/${caseId}`)}
            isSubmitting={isSubmitting}
            isSaving={isSaving}
            disabled={success}
          />
        )}
      </form>
    </div>
  );
}
