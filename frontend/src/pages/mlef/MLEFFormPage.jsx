// src/pages/mlef/MLEFFormPage.jsx
// Complete Medico-Legal Examination Form (MLEF) — 2024/09 revision
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { policeStations, policeOfficers, hospitals, wards, medicalOfficers, mlefForms, cases } from '../../data/mockData';

const BODILY_HARM_OPTIONS = [
  'Abrasion', 'Contusion', 'Laceration', 'Cut', 'Stab', 'Bite',
  'Fracture', 'Firearm Inj.', 'Dislocation/Subluxation', 'Burns', 'Explosive Inj.', 'None',
];

const WEAPON_TYPES = ['Blunt', 'Sharp', 'Firearm', 'Explosive Devices', 'Others'];

export default function MLEFFormPage() {
  const { id: caseId, mlefId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // If editing, load existing data
  const existing = mlefId ? mlefForms.find((m) => m.id === parseInt(mlefId)) : null;

  const [form, setForm] = useState({
    selectedCaseId: caseId || existing?.caseId || '',
    // Part A — Police Section
    policeStation: existing?.policeStation || '',
    dateOfIssue: existing?.dateOfIssue || new Date().toISOString().split('T')[0],
    mlefSerialNo: existing?.mlefSerialNo || '',
    policeOfficerName: existing?.policeOfficerName || '',
    policeOfficerRegNo: existing?.policeOfficerRegNo || '',
    examineeName: existing?.examineeName || '',
    examineeAddress: existing?.examineeAddress || '',
    examineeDOB: existing?.examineeDOB || '',
    examineeAge: existing?.examineeAge || '',
    examineeSex: existing?.examineeSex || '',
    reasonForReferral: existing?.reasonForReferral || '',

    // Part B — Section 10: Admission Details
    hospital: existing?.hospital || '',
    wardNo: existing?.wardNo || '',
    dateTimeAdmission: existing?.dateTimeAdmission || '',
    bhtNo: existing?.bhtNo || '',
    dateTimeExamination: existing?.dateTimeExamination || '',
    dateOfDischarge: existing?.dateOfDischarge || '',
    placeOfDischarge: existing?.placeOfDischarge || '',

    // Section 13: Nature of Bodily Harm
    bodilyHarm: existing?.bodilyHarm || {
      abrasion: false, contusion: false, laceration: false, cut: false,
      stab: false, bite: false, fracture: false, firearmInjury: false,
      dislocation: false, burns: false, explosiveInjury: false, none: false,
      internalInjuries: '', others: '',
    },

    // Section 14: Causative Weapon
    causativeWeapon: existing?.causativeWeapon || '',
    causativeWeaponOther: '',

    // Section 15: Category of Hurt
    categoryOfHurt: existing?.categoryOfHurt || '',
    endangersLife: existing?.endangersLife ?? null,

    // Section 16: Alcohol
    alcoholBreathing: existing?.alcoholBreathing ?? null,
    alcoholUnderInfluence: existing?.alcoholUnderInfluence || '',

    // Section 17: Drug
    drugConsumed: existing?.drugConsumed ?? null,
    drugUnderInfluence: existing?.drugUnderInfluence || '',

    // Section 18: Sexual Assault
    sexualAssault: existing?.sexualAssault || {
      briefHistory: '',
      vaginalPenetration: false,
      analPenetration: false,
      interLabialPenetration: false,
    },

    // Sections 19-22
    investigations: existing?.investigations || '',
    referrals: existing?.referrals || '',
    opinions: existing?.opinions || '',
    remarks: existing?.remarks || '',

    // Doctor Signature
    doctorName: existing?.doctorName || '',
    doctorQualifications: existing?.doctorQualifications || '',
    doctorSLMCRegNo: existing?.doctorSLMCRegNo || '',
    doctorDesignation: existing?.doctorDesignation || '',
    doctorDate: existing?.doctorDate || new Date().toISOString().split('T')[0],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBodilyHarmChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      bodilyHarm: { ...prev.bodilyHarm, [key]: value },
    }));
  };

  const handleSexualAssaultChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      sexualAssault: { ...prev.sexualAssault, [key]: value },
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.selectedCaseId) newErrors.selectedCaseId = 'Case selection is required.';
    if (!form.mlefSerialNo.trim()) newErrors.mlefSerialNo = 'MLEF Serial No. is required.';
    if (!form.examineeName.trim()) newErrors.examineeName = 'Examinee name is required.';
    if (!form.examineeSex) newErrors.examineeSex = 'Sex is required.';
    if (!form.hospital.trim()) newErrors.hospital = 'Hospital is required.';
    if (!form.doctorName.trim()) newErrors.doctorName = 'Doctor name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/cases/${form.selectedCaseId}`), 1500);
  };

  const isReadOnly = !!existing;

  return (
    <div>
      <PageHeader
        title={existing ? `MLEF: ${existing.mlefSerialNo}` : 'New MLEF Form'}
        subtitle="Medico-Legal Examination Form — Health Form 2024/09 Revision"
        breadcrumbs={[
          { label: 'Cases', path: '/cases' },
          caseId ? { label: `Case ${caseId}`, path: `/cases/${caseId}` } : { label: 'MLEF Forms', path: '/mlefs' },
          { label: existing ? existing.mlefSerialNo : 'New MLEF' },
        ]}
      />

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" /> MLEF form saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-5xl">
        {!caseId && !existing && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Link to Case</h2>
            <FF label="Select Case" error={errors.selectedCaseId} required>
              <select value={form.selectedCaseId} onChange={(e) => handleChange('selectedCaseId', e.target.value)} className={ic(errors.selectedCaseId)}>
                <option value="">Select a case to attach this form to</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>{c.caseNo} ({c.caseType})</option>
                ))}
              </select>
            </FF>
          </div>
        )}

        {/* ─── PART A — POLICE SECTION ─── */}
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
            Part A — To be filled by Police Officer
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <FF label="Police Station" error={errors.policeStation}>
              <input type="text" value={form.policeStation} onChange={(e) => handleChange('policeStation', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Date of Issue">
              <input type="date" value={form.dateOfIssue} onChange={(e) => handleChange('dateOfIssue', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="MLEF Serial No." error={errors.mlefSerialNo} required>
              <input type="text" value={form.mlefSerialNo} onChange={(e) => handleChange('mlefSerialNo', e.target.value)} placeholder="e.g. MLEF/KDY/2025/0045" className={ic(errors.mlefSerialNo)} readOnly={isReadOnly} />
            </FF>
            <FF label="Police Officer Name">
              <input type="text" value={form.policeOfficerName} onChange={(e) => handleChange('policeOfficerName', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Badge / Reg No.">
              <input type="text" value={form.policeOfficerRegNo} onChange={(e) => handleChange('policeOfficerRegNo', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Examinee Details</p>
            <div className="grid grid-cols-2 gap-4">
              <FF label="Full Name of Examinee" error={errors.examineeName} required>
                <input type="text" value={form.examineeName} onChange={(e) => handleChange('examineeName', e.target.value)} className={ic(errors.examineeName)} readOnly={isReadOnly} />
              </FF>
              <FF label="Address">
                <input type="text" value={form.examineeAddress} onChange={(e) => handleChange('examineeAddress', e.target.value)} className={ic()} readOnly={isReadOnly} />
              </FF>
              <FF label="Date of Birth">
                <input type="date" value={form.examineeDOB} onChange={(e) => handleChange('examineeDOB', e.target.value)} className={ic()} readOnly={isReadOnly} />
              </FF>
              <FF label="Age">
                <input type="number" min="0" value={form.examineeAge} onChange={(e) => handleChange('examineeAge', e.target.value)} className={ic()} readOnly={isReadOnly} />
              </FF>
              <FF label="Sex" error={errors.examineeSex} required>
                <select value={form.examineeSex} onChange={(e) => handleChange('examineeSex', e.target.value)} className={ic(errors.examineeSex)} disabled={isReadOnly}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FF>
            </div>
            <div className="mt-4">
              <FF label="Reason for Referral">
                <textarea value={form.reasonForReferral} onChange={(e) => handleChange('reasonForReferral', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} placeholder="Describe the reason for medico-legal referral" />
              </FF>
            </div>
            <div className="mt-4 p-3 border border-dashed border-gray-300 rounded bg-white">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Police Officer</p>
              <div className="h-12 mt-1 border-b border-gray-200" />
            </div>
          </div>
        </div>

        {/* ─── PART B — MEDICAL OFFICER SECTION ─── */}
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b-2 border-[#1e3a5f] pb-2">
          Part B — To be filled by Medical Officer
        </h2>

        {/* Section 10 — Admission Details */}
        <FormSection title="Section 10 — Admission Details">
          <div className="grid grid-cols-3 gap-4">
            <FF label="Hospital" error={errors.hospital} required>
              <input type="text" value={form.hospital} onChange={(e) => handleChange('hospital', e.target.value)} className={ic(errors.hospital)} readOnly={isReadOnly} />
            </FF>
            <FF label="Ward No.">
              <input type="text" value={form.wardNo} onChange={(e) => handleChange('wardNo', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="BHT No.">
              <input type="text" value={form.bhtNo} onChange={(e) => handleChange('bhtNo', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Date & Time of Admission">
              <input type="datetime-local" value={form.dateTimeAdmission} onChange={(e) => handleChange('dateTimeAdmission', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Date & Time of Examination">
              <input type="datetime-local" value={form.dateTimeExamination} onChange={(e) => handleChange('dateTimeExamination', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Date of Discharge">
              <input type="date" value={form.dateOfDischarge} onChange={(e) => handleChange('dateOfDischarge', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Place of Discharge">
              <input type="text" value={form.placeOfDischarge} onChange={(e) => handleChange('placeOfDischarge', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
          </div>
        </FormSection>

        {/* Section 13 — Nature of Bodily Harm */}
        <FormSection title="Section 13 — Nature of Bodily Harm">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {BODILY_HARM_OPTIONS.map((option) => {
              const key = option.toLowerCase().replace(/[\s/.]/g, '').replace('inj', 'Injury').replace('subluxation', '');
              const mappedKey = {
                'abrasion': 'abrasion', 'contusion': 'contusion', 'laceration': 'laceration',
                'cut': 'cut', 'stab': 'stab', 'bite': 'bite', 'fracture': 'fracture',
                'firearmInjury': 'firearmInjury', 'dislocation': 'dislocation',
                'burns': 'burns', 'explosiveInjury': 'explosiveInjury', 'none': 'none',
              };
              const formKey = mappedKey[key] || key;
              return (
                <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bodilyHarm[formKey] || false}
                    onChange={(e) => handleBodilyHarmChange(formKey, e.target.checked)}
                    className="rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    disabled={isReadOnly}
                  />
                  {option}
                </label>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FF label="Internal Injuries">
              <textarea value={form.bodilyHarm.internalInjuries} onChange={(e) => handleBodilyHarmChange('internalInjuries', e.target.value)} rows={2} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Others">
              <textarea value={form.bodilyHarm.others} onChange={(e) => handleBodilyHarmChange('others', e.target.value)} rows={2} className={ic()} readOnly={isReadOnly} />
            </FF>
          </div>
        </FormSection>

        {/* Section 14 — Nature of Causative Weapon */}
        <FormSection title="Section 14 — Nature of Causative Weapon">
          <div className="flex flex-wrap gap-4">
            {WEAPON_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="causativeWeapon"
                  value={type}
                  checked={form.causativeWeapon === type}
                  onChange={(e) => handleChange('causativeWeapon', e.target.value)}
                  className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                  disabled={isReadOnly}
                />
                {type}
              </label>
            ))}
          </div>
          {form.causativeWeapon === 'Others' && (
            <div className="mt-3 max-w-md">
              <FF label="Specify">
                <input type="text" value={form.causativeWeaponOther} onChange={(e) => handleChange('causativeWeaponOther', e.target.value)} className={ic()} readOnly={isReadOnly} />
              </FF>
            </div>
          )}
        </FormSection>

        {/* Section 15 — Category of Hurt */}
        <FormSection title="Section 15 — Category of Hurt">
          <div className="flex gap-6 mb-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name="categoryOfHurt" value="Non-Grievous" checked={form.categoryOfHurt === 'Non-Grievous'} onChange={(e) => handleChange('categoryOfHurt', e.target.value)} className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" disabled={isReadOnly} />
              Non-Grievous
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="radio" name="categoryOfHurt" value="Grievous" checked={form.categoryOfHurt === 'Grievous'} onChange={(e) => handleChange('categoryOfHurt', e.target.value)} className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" disabled={isReadOnly} />
              Grievous
            </label>
          </div>
          {form.categoryOfHurt === 'Grievous' && (
            <div className="ml-6">
              <p className="text-sm text-gray-600 mb-2">Does it endanger life?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="endangersLife" checked={form.endangersLife === true} onChange={() => handleChange('endangersLife', true)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="endangersLife" checked={form.endangersLife === false} onChange={() => handleChange('endangersLife', false)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> No
                </label>
              </div>
            </div>
          )}
        </FormSection>

        {/* Section 16 — Alcohol Examination */}
        <FormSection title="Section 16 — Alcohol Examination">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Breathing/smelling of alcohol?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="alcoholBreathing" checked={form.alcoholBreathing === true} onChange={() => handleChange('alcoholBreathing', true)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="alcoholBreathing" checked={form.alcoholBreathing === false} onChange={() => handleChange('alcoholBreathing', false)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> No
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Under influence?</p>
              <div className="flex gap-4">
                {['Yes', 'No', 'Negative'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="alcoholUnderInfluence" value={opt} checked={form.alcoholUnderInfluence === opt} onChange={(e) => handleChange('alcoholUnderInfluence', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        {/* Section 17 — Drug Examination */}
        <FormSection title="Section 17 — Drug Examination">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Consumed drugs?</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="drugConsumed" checked={form.drugConsumed === true} onChange={() => handleChange('drugConsumed', true)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="drugConsumed" checked={form.drugConsumed === false} onChange={() => handleChange('drugConsumed', false)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> No
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Under influence?</p>
              <div className="flex gap-4">
                {['Yes', 'No', 'Negative'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="drugUnderInfluence" value={opt} checked={form.drugUnderInfluence === opt} onChange={(e) => handleChange('drugUnderInfluence', e.target.value)} className="border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} /> {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        {/* Section 18 — Sexual Assault Examination */}
        <FormSection title="Section 18 — Examination of Alleged Sexual Assault">
          <div className="mb-4">
            <FF label="a. Brief history given by examinee">
              <textarea value={form.sexualAssault.briefHistory} onChange={(e) => handleSexualAssaultChange('briefHistory', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} />
            </FF>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            b. Findings of examination relevant to history
          </p>
          <div className="space-y-3 ml-4">
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.sexualAssault.vaginalPenetration} onChange={(e) => handleSexualAssaultChange('vaginalPenetration', e.target.checked)} className="rounded border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} />
              i. Signs of vaginal/hymen penetration present
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.sexualAssault.analPenetration} onChange={(e) => handleSexualAssaultChange('analPenetration', e.target.checked)} className="rounded border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} />
              ii. Signs of anal penetration present
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.sexualAssault.interLabialPenetration} onChange={(e) => handleSexualAssaultChange('interLabialPenetration', e.target.checked)} className="rounded border-gray-300 text-[#1e3a5f]" disabled={isReadOnly} />
              iii. Signs consistent with inter labial penetration
            </label>
          </div>
        </FormSection>

        {/* Sections 19-22 */}
        <FormSection title="Section 19 — Investigations">
          <textarea value={form.investigations} onChange={(e) => handleChange('investigations', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} placeholder="List all investigations ordered or conducted" />
        </FormSection>

        <FormSection title="Section 20 — Referrals">
          <textarea value={form.referrals} onChange={(e) => handleChange('referrals', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} placeholder="List all referrals made" />
        </FormSection>

        <FormSection title="Section 21 — Other Opinions / Recommendations">
          <textarea value={form.opinions} onChange={(e) => handleChange('opinions', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} placeholder="Medical opinions and recommendations" />
        </FormSection>

        <FormSection title="Section 22 — Remarks">
          <textarea value={form.remarks} onChange={(e) => handleChange('remarks', e.target.value)} rows={3} className={ic()} readOnly={isReadOnly} placeholder="Additional remarks" />
        </FormSection>

        {/* Doctor Signature Block */}
        <FormSection title="Medical Officer Signature">
          <div className="grid grid-cols-2 gap-4">
            <FF label="Full Name" error={errors.doctorName} required>
              <input type="text" value={form.doctorName} onChange={(e) => handleChange('doctorName', e.target.value)} className={ic(errors.doctorName)} readOnly={isReadOnly} />
            </FF>
            <FF label="Qualifications">
              <input type="text" value={form.doctorQualifications} onChange={(e) => handleChange('doctorQualifications', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="SLMC Registration No.">
              <input type="text" value={form.doctorSLMCRegNo} onChange={(e) => handleChange('doctorSLMCRegNo', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Designation">
              <input type="text" value={form.doctorDesignation} onChange={(e) => handleChange('doctorDesignation', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
            <FF label="Date">
              <input type="date" value={form.doctorDate} onChange={(e) => handleChange('doctorDate', e.target.value)} className={ic()} readOnly={isReadOnly} />
            </FF>
          </div>
          <div className="mt-4 p-3 border border-dashed border-gray-300 rounded">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Medical Officer</p>
            <div className="h-12 mt-1 border-b border-gray-200" />
          </div>
        </FormSection>

        {/* Submit */}
        {!isReadOnly && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save MLEF Form</>}
            </button>
            <button type="button" onClick={() => navigate(caseId ? `/cases/${caseId}` : '/mlefs')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
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
