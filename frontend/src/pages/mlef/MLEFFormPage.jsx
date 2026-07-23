// src/pages/mlef/MLEFFormPage.jsx
// Complete Medico-Legal Examination Form — role-based Part A / Part B
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import StickyActionBar from '../../components/shared/StickyActionBar';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import {
  policeStations, mlefForms, cases, hospitals,
} from '../../data/mockData';
import { examinationService } from '../../services/api';

/* ─── helpers ─── */
const ic = (err) =>
  `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] ${
    err ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;

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

const BODILY_HARM = [
  { key: 'abrasion', label: 'Abrasion', col: 'left' },
  { key: 'contusion', label: 'Contusion', col: 'left' },
  { key: 'cut', label: 'Cut', col: 'left' },
  { key: 'bite', label: 'Bite', col: 'left' },
  { key: 'dislocation', label: 'Dislocation/Subluxation', col: 'left' },
  { key: 'laceration', label: 'Laceration', col: 'right' },
  { key: 'stab', label: 'Stab', col: 'right' },
  { key: 'fracture', label: 'Fracture', col: 'right' },
  { key: 'firearmInjury', label: 'Firearm Inj.', col: 'right' },
  { key: 'burns', label: 'Burns', col: 'right' },
  { key: 'explosiveInjury', label: 'Explosive Inj.', col: 'right' },
  { key: 'none', label: 'None', col: 'right' },
];

const WEAPON_TYPES = ['Blunt', 'Sharp', 'Firearm', 'Explosive Devices', 'Others'];

export default function MLEFFormPage() {
  const { id: caseId, mlefId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = mlefId ? mlefForms.find((m) => m.id === parseInt(mlefId)) : null;

  // Role checks
  const isPolice = user?.role === ROLES.POLICE;
  const isJMO = user?.role === ROLES.JMO;
  const isAdmin = user?.role === ROLES.ADMIN;
  const canEditPartA = isPolice || isAdmin;
  const canEditPartB = isJMO || isAdmin;
  const isReadOnly = !!existing;

  const [form, setForm] = useState({
    selectedCaseId: caseId || existing?.caseId || '',
    // Part A
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
    // Part B — Section 10
    hospital: existing?.hospital || '',
    wardNo: existing?.wardNo || '',
    dateOfAdmission: existing?.dateOfAdmission || '',
    timeOfAdmission: existing?.timeOfAdmission || '',
    bhtNo: existing?.bhtNo || '',
    dateOfExamination: existing?.dateOfExamination || '',
    timeOfExamination: existing?.timeOfExamination || '',
    dateOfDischarge: existing?.dateOfDischarge || '',
    placeOfDischarge: existing?.placeOfDischarge || '',
    // Section 13
    bodilyHarm: existing?.bodilyHarm || {
      abrasion: false, contusion: false, laceration: false, cut: false,
      stab: false, bite: false, fracture: false, firearmInjury: false,
      dislocation: false, burns: false, explosiveInjury: false, none: false,
      internalInjuries: '', others: '',
    },
    // Section 14
    causativeWeapon: existing?.causativeWeapon || '',
    causativeWeaponOther: '',
    // Section 15
    categoryOfHurt: existing?.categoryOfHurt || '',
    endangersLife: existing?.endangersLife ?? null,
    // Section 16
    alcoholBreathing: existing?.alcoholBreathing ?? null,
    alcoholUnderInfluence: existing?.alcoholUnderInfluence || '',
    // Section 17
    drugConsumed: existing?.drugConsumed ?? null,
    drugUnderInfluence: existing?.drugUnderInfluence || '',
    // Section 18
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
    // Doctor signature
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
    const e = {};
    if (!form.selectedCaseId) e.selectedCaseId = 'Case is required.';
    if (!form.mlefSerialNo.trim()) e.mlefSerialNo = 'MLEF Serial No. is required.';
    if (!form.examineeName.trim()) e.examineeName = 'Examinee name is required.';
    if (!form.examineeSex) e.examineeSex = 'Sex is required.';
    if (!form.hospital.trim()) e.hospital = 'Hospital is required.';
    if (!form.doctorName.trim()) e.doctorName = 'Doctor name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await examinationService.createMlef({
        case_id: parseInt(form.selectedCaseId),
        police_station: form.policeStation || null,
        date_of_issue: form.dateOfIssue || null,
        officer_name: form.policeOfficerName || null,
        officer_number: form.policeOfficerRegNo || null,
        examinee_name: form.examineeName || null,
        examinee_age: parseInt(form.examineeAge) || null,
        examinee_gender: form.examineeSex || null,
        examinee_address: form.examineeAddress || null,
        date_of_incident: form.dateOfIncident || null,
        time_of_incident: form.timeOfIncident || null,
        place_of_incident: form.placeOfIncident || null,
        nature_of_incident: form.natureOfIncident || null,
        weapon_used: JSON.stringify(form.weaponTypes || []),
        police_history: form.policeHistory || null,
        patient_history: form.patientHistory || null,
        consent: form.consent === 'Yes',
        bht_number: form.bhtNo || null,
        ward: form.wardNo || null,
        general_exam_clothing: form.generalExamClothing || null,
        general_exam_physique: form.generalExamPhysique || null,
        general_exam_mental: form.generalExamMental || null,
        general_exam_other: form.generalExamOther || null,
        alcohol_smell: form.alcoholSmell || null,
        alcohol_pupils: form.alcoholPupils || null,
        alcohol_speech: form.alcoholSpeech || null,
        sexual_assault_history: form.sexualAssaultHistory || null,
        sexual_assault_exam: form.sexualAssaultExam || null,
        short_report: JSON.stringify(form.bodilyHarm || {}),
        category_of_hurt: form.categoryOfHurt || null,
        jmo_name: form.doctorName || null,
        jmo_designation: form.doctorDesignation || null,
        jmo_date: form.dateOfReport || null,
      });
      setSuccess(true);
      setTimeout(() => navigate(caseId ? `/cases/${caseId}` : '/mlefs'), 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.response?.data?.detail || err.message || 'Failed to save MLEF.' }));
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

  /* Field renderer — returns read-only or editable */
  const renderField = (canEdit, label, inputEl, roValue, error, required) => {
    if (isReadOnly || !canEdit) {
      return (
        <FF label={label} required={required}>
          <div className={roIc}>{roValue || '—'}</div>
        </FF>
      );
    }
    return <FF label={label} error={error} required={required}>{inputEl}</FF>;
  };

  const leftHarm = BODILY_HARM.filter((h) => h.col === 'left');
  const rightHarm = BODILY_HARM.filter((h) => h.col === 'right');

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
          <CheckCircle className="h-4 w-4" /> Action completed successfully.
        </div>
      )}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {/* Case selector if no caseId */}
      {!caseId && !existing && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <FF label="Link to Case" error={errors.selectedCaseId} required>
            <select value={form.selectedCaseId} onChange={(e) => handleChange('selectedCaseId', e.target.value)} className={ic(errors.selectedCaseId)}>
              <option value="">Select a case</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>{c.caseNo} ({c.caseType})</option>
              ))}
            </select>
          </FF>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="max-w-5xl">

        {/* ═══════════════════════════════════════════════
            PART A — POLICE OFFICER SECTION
           ═══════════════════════════════════════════════ */}
        <FormSection title="Part A — Police Officer Section" filledByRole="POLICE">
          <div className="grid grid-cols-3 gap-4">
            {renderField(canEditPartA, 'Police Station',
              <select value={form.policeStation} onChange={(e) => handleChange('policeStation', e.target.value)} className={ic()}>
                <option value="">Select Station</option>
                {policeStations.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>,
              form.policeStation
            )}
            {renderField(canEditPartA, 'Date of Issue',
              <input type="date" value={form.dateOfIssue} onChange={(e) => handleChange('dateOfIssue', e.target.value)} className={ic()} />,
              form.dateOfIssue
            )}
            {renderField(canEditPartA, 'MLEF Serial No.',
              <input type="text" value={form.mlefSerialNo} onChange={(e) => handleChange('mlefSerialNo', e.target.value)} placeholder="e.g. MLEF/KDY/2025/0045" className={ic(errors.mlefSerialNo)} />,
              form.mlefSerialNo, errors.mlefSerialNo, true
            )}
            {renderField(canEditPartA, 'Police Officer Full Name',
              <input type="text" value={form.policeOfficerName} onChange={(e) => handleChange('policeOfficerName', e.target.value)} className={ic()} />,
              form.policeOfficerName
            )}
            {renderField(canEditPartA, 'Badge / Reg No.',
              <input type="text" value={form.policeOfficerRegNo} onChange={(e) => handleChange('policeOfficerRegNo', e.target.value)} className={ic()} />,
              form.policeOfficerRegNo
            )}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Examinee Details</p>
            <div className="grid grid-cols-2 gap-4">
              {renderField(canEditPartA, 'Full Name of Examinee',
                <input type="text" value={form.examineeName} onChange={(e) => handleChange('examineeName', e.target.value)} className={ic(errors.examineeName)} />,
                form.examineeName, errors.examineeName, true
              )}
              {renderField(canEditPartA, 'Address',
                <input type="text" value={form.examineeAddress} onChange={(e) => handleChange('examineeAddress', e.target.value)} className={ic()} />,
                form.examineeAddress
              )}
              {renderField(canEditPartA, 'Date of Birth',
                <input type="date" value={form.examineeDOB} onChange={(e) => handleChange('examineeDOB', e.target.value)} className={ic()} />,
                form.examineeDOB
              )}
              {renderField(canEditPartA, 'Age',
                <input type="number" min="0" value={form.examineeAge} onChange={(e) => handleChange('examineeAge', e.target.value)} className={ic()} />,
                form.examineeAge
              )}
            </div>
            <div className="mt-4">
              <FF label="Sex" error={errors.examineeSex} required>
                {(isReadOnly || !canEditPartA) ? (
                  <div className={roIc}>{form.examineeSex || '—'}</div>
                ) : (
                  <div className="flex gap-6 mt-1">
                    {['Male', 'Female'].map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="examineeSex" value={s} checked={form.examineeSex === s} onChange={(e) => handleChange('examineeSex', e.target.value)} className="border-gray-300 text-[#1e3a5f]" />
                        {s}
                      </label>
                    ))}
                  </div>
                )}
              </FF>
            </div>
            <div className="mt-4">
              {renderField(canEditPartA, 'Reason for Referral',
                <textarea value={form.reasonForReferral} onChange={(e) => handleChange('reasonForReferral', e.target.value)} rows={3} className={ic()} placeholder="Describe the reason for medico-legal referral" />,
                form.reasonForReferral
              )}
            </div>
            {/* Signature placeholder */}
            <div className="mt-4 p-3 border border-dashed border-gray-300 rounded bg-white">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Police Officer</p>
              <div className="h-12 mt-1 border-b border-gray-200" />
            </div>
          </div>
        </FormSection>

        {/* ═══════════════════════════════════════════════
            PART B — MEDICAL OFFICER SECTION
           ═══════════════════════════════════════════════ */}

        {/* Section 10 */}
        <FormSection title="Section 10 — Admission Details" filledByRole="JMO">
          <div className="grid grid-cols-3 gap-4">
            {renderField(canEditPartB, 'Hospital',
              <select value={form.hospital} onChange={(e) => handleChange('hospital', e.target.value)} className={ic(errors.hospital)}>
                <option value="">Select Hospital</option>
                {hospitals.map((h) => <option key={h.id} value={h.name}>{h.name}</option>)}
              </select>,
              form.hospital, errors.hospital, true
            )}
            {renderField(canEditPartB, 'Ward No.',
              <input type="text" value={form.wardNo} onChange={(e) => handleChange('wardNo', e.target.value)} className={ic()} />,
              form.wardNo
            )}
            {renderField(canEditPartB, 'BHT No.',
              <input type="text" value={form.bhtNo} onChange={(e) => handleChange('bhtNo', e.target.value)} className={ic()} />,
              form.bhtNo
            )}
            {renderField(canEditPartB, 'Date of Admission',
              <input type="date" value={form.dateOfAdmission} onChange={(e) => handleChange('dateOfAdmission', e.target.value)} className={ic()} />,
              form.dateOfAdmission
            )}
            {renderField(canEditPartB, 'Time of Admission',
              <input type="time" value={form.timeOfAdmission} onChange={(e) => handleChange('timeOfAdmission', e.target.value)} className={ic()} />,
              form.timeOfAdmission
            )}
            {renderField(canEditPartB, 'Date of Examination',
              <input type="date" value={form.dateOfExamination} onChange={(e) => handleChange('dateOfExamination', e.target.value)} className={ic()} />,
              form.dateOfExamination
            )}
            {renderField(canEditPartB, 'Time of Examination',
              <input type="time" value={form.timeOfExamination} onChange={(e) => handleChange('timeOfExamination', e.target.value)} className={ic()} />,
              form.timeOfExamination
            )}
            {renderField(canEditPartB, 'Date of Discharge',
              <input type="date" value={form.dateOfDischarge} onChange={(e) => handleChange('dateOfDischarge', e.target.value)} className={ic()} />,
              form.dateOfDischarge
            )}
            {renderField(canEditPartB, 'Place of Discharge',
              <input type="text" value={form.placeOfDischarge} onChange={(e) => handleChange('placeOfDischarge', e.target.value)} className={ic()} />,
              form.placeOfDischarge
            )}
          </div>
        </FormSection>

        {/* Section 13 — Nature of Bodily Harm */}
        <FormSection title="Section 13 — Nature of Bodily Harm" filledByRole="JMO">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
            <div className="space-y-2">
              {leftHarm.map((h) => (
                <label key={h.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.bodilyHarm[h.key] || false}
                    onChange={(e) => handleBodilyHarmChange(h.key, e.target.checked)}
                    className="rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    disabled={isReadOnly || !canEditPartB} />
                  {h.label}
                </label>
              ))}
            </div>
            <div className="space-y-2">
              {rightHarm.map((h) => (
                <label key={h.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.bodilyHarm[h.key] || false}
                    onChange={(e) => handleBodilyHarmChange(h.key, e.target.checked)}
                    className="rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    disabled={isReadOnly || !canEditPartB} />
                  {h.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderField(canEditPartB, 'Internal Injuries',
              <textarea value={form.bodilyHarm.internalInjuries} onChange={(e) => handleBodilyHarmChange('internalInjuries', e.target.value)} rows={2} className={ic()} />,
              form.bodilyHarm.internalInjuries
            )}
            {renderField(canEditPartB, 'Others',
              <textarea value={form.bodilyHarm.others} onChange={(e) => handleBodilyHarmChange('others', e.target.value)} rows={2} className={ic()} />,
              form.bodilyHarm.others
            )}
          </div>
        </FormSection>

        {/* Section 14 — Causative Weapon */}
        <FormSection title="Section 14 — Nature of Causative Weapon" filledByRole="JMO">
          {(isReadOnly || !canEditPartB) ? (
            <div className={roIc}>{form.causativeWeapon || '—'}</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4">
                {WEAPON_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="causativeWeapon" value={t}
                      checked={form.causativeWeapon === t}
                      onChange={(e) => handleChange('causativeWeapon', e.target.value)}
                      className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                    {t}
                  </label>
                ))}
              </div>
              {form.causativeWeapon === 'Others' && (
                <div className="mt-3 max-w-md">
                  <FF label="Specify">
                    <input type="text" value={form.causativeWeaponOther} onChange={(e) => handleChange('causativeWeaponOther', e.target.value)} className={ic()} />
                  </FF>
                </div>
              )}
            </>
          )}
        </FormSection>

        {/* Section 15 — Category of Hurt */}
        <FormSection title="Section 15 — Category of Hurt" filledByRole="JMO">
          {(isReadOnly || !canEditPartB) ? (
            <div className={roIc}>
              {form.categoryOfHurt || '—'}
              {form.categoryOfHurt === 'Grievous' && form.endangersLife != null && (
                <span className="ml-2 text-xs">({form.endangersLife ? 'Endangers life' : 'Does not endanger life'})</span>
              )}
            </div>
          ) : (
            <>
              <div className="flex gap-6 mb-3">
                {['Non-Grievous', 'Grievous'].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="categoryOfHurt" value={c} checked={form.categoryOfHurt === c}
                      onChange={(e) => handleChange('categoryOfHurt', e.target.value)}
                      className="border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" />
                    {c}
                  </label>
                ))}
              </div>
              {form.categoryOfHurt === 'Grievous' && (
                <div className="ml-6 mt-2">
                  <p className="text-sm text-gray-600 mb-2">Does it endanger life?</p>
                  <div className="flex gap-4">
                    {[true, false].map((v) => (
                      <label key={String(v)} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="endangersLife" checked={form.endangersLife === v}
                          onChange={() => handleChange('endangersLife', v)}
                          className="border-gray-300 text-[#1e3a5f]" />
                        {v ? 'Yes' : 'No'}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </FormSection>

        {/* Section 16 — Alcohol */}
        <FormSection title="Section 16 — Examination for Consumption of Alcohol" filledByRole="JMO">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 w-48">Breathing/smelling of alcohol?</span>
              {(isReadOnly || !canEditPartB) ? (
                <span className="text-sm text-gray-700">{form.alcoholBreathing == null ? '—' : form.alcoholBreathing ? 'Yes' : 'No'}</span>
              ) : (
                <div className="flex gap-4">
                  {['Yes', 'No', 'Negative'].map((o) => {
                    const val = o === 'Yes' ? true : o === 'No' ? false : 'Negative';
                    return (
                      <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="alcoholBreathing" checked={form.alcoholBreathing === val}
                          onChange={() => handleChange('alcoholBreathing', val)}
                          className="border-gray-300 text-[#1e3a5f]" /> {o}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 w-48">Under influence?</span>
              {(isReadOnly || !canEditPartB) ? (
                <span className="text-sm text-gray-700">{form.alcoholUnderInfluence || '—'}</span>
              ) : (
                <div className="flex gap-4">
                  {['Yes', 'No', 'Negative'].map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="alcoholUnderInfluence" value={o}
                        checked={form.alcoholUnderInfluence === o}
                        onChange={(e) => handleChange('alcoholUnderInfluence', e.target.value)}
                        className="border-gray-300 text-[#1e3a5f]" /> {o}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FormSection>

        {/* Section 17 — Drugs */}
        <FormSection title="Section 17 — Examination for Consumption of Drugs" filledByRole="JMO">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 w-48">Consumed drugs?</span>
              {(isReadOnly || !canEditPartB) ? (
                <span className="text-sm text-gray-700">{form.drugConsumed == null ? '—' : form.drugConsumed ? 'Yes' : 'No'}</span>
              ) : (
                <div className="flex gap-4">
                  {['Yes', 'No', 'Negative'].map((o) => {
                    const val = o === 'Yes' ? true : o === 'No' ? false : 'Negative';
                    return (
                      <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="drugConsumed" checked={form.drugConsumed === val}
                          onChange={() => handleChange('drugConsumed', val)}
                          className="border-gray-300 text-[#1e3a5f]" /> {o}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600 w-48">Under influence?</span>
              {(isReadOnly || !canEditPartB) ? (
                <span className="text-sm text-gray-700">{form.drugUnderInfluence || '—'}</span>
              ) : (
                <div className="flex gap-4">
                  {['Yes', 'No', 'Negative'].map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="drugUnderInfluence" value={o}
                        checked={form.drugUnderInfluence === o}
                        onChange={(e) => handleChange('drugUnderInfluence', e.target.value)}
                        className="border-gray-300 text-[#1e3a5f]" /> {o}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FormSection>

        {/* Section 18 — Sexual Assault */}
        <FormSection title="Section 18 — Examination of Alleged Sexual Assault" filledByRole="JMO" sensitive>
          <div className="mb-4">
            {renderField(canEditPartB, 'a. Brief history given by examinee',
              <textarea value={form.sexualAssault.briefHistory} onChange={(e) => handleSexualAssaultChange('briefHistory', e.target.value)} rows={3} className={ic()} />,
              form.sexualAssault.briefHistory
            )}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">b. Findings of examination relevant to given history</p>
          <div className="space-y-3 ml-4">
            {[
              { key: 'vaginalPenetration', label: 'i. Signs of vaginal/hymen penetration present' },
              { key: 'analPenetration', label: 'ii. Signs of anal penetration present' },
              { key: 'interLabialPenetration', label: 'iii. Signs consistent with inter labial penetration present' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.sexualAssault[key]}
                  onChange={(e) => handleSexualAssaultChange(key, e.target.checked)}
                  className="rounded border-gray-300 text-[#1e3a5f]"
                  disabled={isReadOnly || !canEditPartB} />
                {label}
              </label>
            ))}
          </div>
        </FormSection>

        {/* Sections 19-22 */}
        {[
          { key: 'investigations', title: 'Section 19 — Investigations', placeholder: 'List all investigations ordered or conducted' },
          { key: 'referrals', title: 'Section 20 — Referrals', placeholder: 'List all referrals made' },
          { key: 'opinions', title: 'Section 21 — Other Opinions/Recommendations', placeholder: 'Medical opinions and recommendations' },
          { key: 'remarks', title: 'Section 22 — Remarks', placeholder: 'Additional remarks' },
        ].map(({ key, title, placeholder }) => (
          <FormSection key={key} title={title} filledByRole="JMO">
            {(isReadOnly || !canEditPartB) ? (
              <div className={roIc + ' min-h-[60px] whitespace-pre-wrap'}>{form[key] || '—'}</div>
            ) : (
              <textarea value={form[key]} onChange={(e) => handleChange(key, e.target.value)} rows={3} className={ic()} placeholder={placeholder} />
            )}
          </FormSection>
        ))}

        {/* Doctor Signature */}
        <FormSection title="Medical Officer Signature" filledByRole="JMO">
          <div className="grid grid-cols-2 gap-4">
            {renderField(canEditPartB, 'Full Name',
              <input type="text" value={form.doctorName} onChange={(e) => handleChange('doctorName', e.target.value)} className={ic(errors.doctorName)} />,
              form.doctorName, errors.doctorName, true
            )}
            {renderField(canEditPartB, 'Qualifications',
              <input type="text" value={form.doctorQualifications} onChange={(e) => handleChange('doctorQualifications', e.target.value)} className={ic()} />,
              form.doctorQualifications
            )}
            {renderField(canEditPartB, 'SLMC Registration No.',
              <input type="text" value={form.doctorSLMCRegNo} onChange={(e) => handleChange('doctorSLMCRegNo', e.target.value)} className={ic()} />,
              form.doctorSLMCRegNo
            )}
            {renderField(canEditPartB, 'Designation',
              <input type="text" value={form.doctorDesignation} onChange={(e) => handleChange('doctorDesignation', e.target.value)} className={ic()} />,
              form.doctorDesignation
            )}
            {renderField(canEditPartB, 'Date',
              <input type="date" value={form.doctorDate} onChange={(e) => handleChange('doctorDate', e.target.value)} className={ic()} />,
              form.doctorDate
            )}
          </div>
          <div className="mt-4 p-3 border border-dashed border-gray-300 rounded">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Medical Officer</p>
            <div className="h-12 mt-1 border-b border-gray-200" />
          </div>
        </FormSection>

        {/* Sticky action bar */}
        {!isReadOnly && (
          <StickyActionBar
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            onCancel={() => navigate(caseId ? `/cases/${caseId}` : '/mlefs')}
            isSubmitting={isSubmitting}
            isSaving={isSaving}
            disabled={success}
          />
        )}
      </form>
    </div>
  );
}
