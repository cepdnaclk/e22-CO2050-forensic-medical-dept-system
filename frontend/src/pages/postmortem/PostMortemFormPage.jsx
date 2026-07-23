// src/pages/postmortem/PostMortemFormPage.jsx
// 6-Step Post-Mortem Examination Report
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import StepIndicator from '../../components/shared/StepIndicator';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { postMortemReports, cases, courts, medicalOfficers } from '../../data/mockData';
import { examinationService } from '../../services/api';

const STEPS = ['Header', 'External Exam', 'Identification', 'Internal (Head)', 'Internal (Abdomen)', 'Opinion'];
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

export default function PostMortemFormPage() {
  const { id: caseId, pmId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = pmId ? postMortemReports.find((m) => m.id === parseInt(pmId)) : null;
  const isJMO = user?.role === ROLES.JMO || user?.role === ROLES.ADMIN;
  const R = !!existing || !isJMO;

  // Pre-fill from case
  const linkedCase = cases.find((c) => c.id === parseInt(caseId));
  const linkedMO = medicalOfficers.find((m) => m.userId === user?.id);

  const [form, setForm] = useState({
    selectedCaseId: caseId || '',
    // Step 1 — Header
    inquestNo: existing?.inquestNo || linkedCase?.inquestNo || '',
    court: existing?.court || linkedCase?.court?.name || '',
    caseNo: existing?.caseNo || linkedCase?.courtCaseNo || '',
    reportDate: existing?.examDate || new Date().toISOString().split('T')[0],
    deceasedName: existing?.deceasedName || '',
    dateOfDeath: existing?.dateOfDeath || '',
    timeOfDeath: existing?.timeOfDeath || '',
    examiningOfficer: existing?.examiningOfficer || linkedMO?.fullName || '',
    examDate: existing?.examDate || '',
    examTime: existing?.examTime || '',
    requestedBy: existing?.requestedBy || '',
    district: existing?.district || 'Kandy',
    placeOfExamination: existing?.placeOfExamination || 'Mortuary, Teaching Hospital Peradeniya',
    identifiers: existing?.identifiedBy ? [{ name: existing.identifiedBy }] : [{ name: '' }],
    // Step 2 — External
    locus: existing?.externalExamination?.locus || '',
    clothing: existing?.externalExamination?.clothing || '',
    nourishment: existing?.externalExamination?.nourishment || '',
    colour: existing?.externalExamination?.colour || '',
    marks: existing?.externalExamination?.marks || '',
    productsOfDisease: existing?.externalExamination?.productsOfDisease || '',
    injuries: existing?.externalExamination?.injuries?.map((inj) => ({
      description: inj.description,
      beforeAfter: 'Before',
    })) || [{ description: '', beforeAfter: 'Before' }],
    // Step 3 — Identification
    height: existing?.identificationFields?.height || '',
    estimatedAge: existing?.identificationFields?.estimatedAge || '',
    sex: existing?.identificationFields?.sex || '',
    eyesAndPupils: existing?.identificationFields?.eyesAndPupils || '',
    hair: existing?.identificationFields?.hair || '',
    tongue: existing?.identificationFields?.tongue || '',
    teeth: existing?.identificationFields?.teeth || '',
    primaryFlaccidity: existing?.signsOfDeath?.primaryFlaccidity || '',
    rigorMortis: existing?.signsOfDeath?.rigorMortis || '',
    hypostasis: existing?.signsOfDeath?.hypostasis || '',
    putrefaction: existing?.signsOfDeath?.putrefaction || '',
    handsAndNails: existing?.internalExamination?.handsAndNails || '',
    naturalNose: existing?.internalExamination?.naturalOpenings?.split('. ')[0] || '',
    naturalUrinary: '',
    naturalAnal: '',
    // Step 4 — Internal Head/Neck/Thorax
    neck: existing?.internalExamination?.neck || '',
    headSoftParts: existing?.internalExamination?.head?.softParts || '',
    headBones: existing?.internalExamination?.head?.bonesOfSkull || '',
    headMembranes: existing?.internalExamination?.head?.membranesAndSinuses || '',
    headBrain: existing?.internalExamination?.head?.brainSubstance || '',
    headBloodVessels: existing?.internalExamination?.head?.bloodVessels || '',
    spinalCord: existing?.internalExamination?.spinalCord || '',
    thoraxSoftParts: existing?.internalExamination?.thorax?.softParts || '',
    thoraxBones: existing?.internalExamination?.thorax?.bones || '',
    thoraxChestCavity: existing?.internalExamination?.thorax?.chestCavity || '',
    thoraxPericardium: existing?.internalExamination?.thorax?.pericardium || '',
    thoraxHeart: existing?.internalExamination?.thorax?.heart || '',
    thoraxCoronary: existing?.internalExamination?.thorax?.coronaryVessels || '',
    thoraxLargeVessels: existing?.internalExamination?.thorax?.largeBloodVessels || '',
    thoraxAirway: existing?.internalExamination?.thorax?.airway || '',
    thoraxLungs: existing?.internalExamination?.thorax?.pleuraAndLungs || '',
    thoraxGullet: existing?.internalExamination?.thorax?.gullet || '',
    // Step 5 — Internal Abdomen/Pelvis
    abdContents: existing?.internalExamination?.abdomen?.contentsAndPosition || '',
    abdPeritoneum: existing?.internalExamination?.abdomen?.peritoneum || '',
    abdDiaphragm: existing?.internalExamination?.abdomen?.diaphragm || '',
    abdLiver: existing?.internalExamination?.abdomen?.liverAndGallBladder || '',
    abdSpleen: existing?.internalExamination?.abdomen?.spleen || '',
    abdStomach: existing?.internalExamination?.abdomen?.stomach || '',
    abdSmallIntestine: existing?.internalExamination?.abdomen?.smallIntestine || '',
    abdLargeIntestine: existing?.internalExamination?.abdomen?.largeIntestine || '',
    abdPancreas: existing?.internalExamination?.abdomen?.pancreas || '',
    abdKidneys: existing?.internalExamination?.abdomen?.kidneys || '',
    abdSupraRenal: existing?.internalExamination?.abdomen?.supraRenalGlands || '',
    pelvisBladder: existing?.internalExamination?.pelvis?.urinaryBladder || '',
    pelvisGenerative: existing?.internalExamination?.pelvis?.generativeOrgans || '',
    pelvisVessels: existing?.internalExamination?.pelvis?.bloodVessels || '',
    pelvisBones: existing?.internalExamination?.pelvis?.vertebraeAndBones || '',
    // Step 6 — Opinion
    causeOfDeath: existing?.causeOfDeath || '',
    pmSerialNo: existing?.pmSerialNo || '',
    signatureDate: existing?.examDate || new Date().toISOString().split('T')[0],
    moName: existing?.moSignature || linkedMO?.fullName || '',
    moQualifications: existing?.moQualifications || linkedMO?.qualification || '',
    moDesignation: existing?.moDesignation || linkedMO?.designation || '',
    verdict: existing?.verdict || '',
    verdictDate: '',
    swornDate: '',
    articles: [{ itemNo: 1, description: '', handedTo: '' }],
  });

  const h = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Repeatable rows helpers
  const addIdentifier = () => setForm((p) => ({ ...p, identifiers: [...p.identifiers, { name: '' }] }));
  const removeIdentifier = (i) => setForm((p) => ({ ...p, identifiers: p.identifiers.filter((_, idx) => idx !== i) }));
  const updateIdentifier = (i, val) => setForm((p) => ({ ...p, identifiers: p.identifiers.map((item, idx) => idx === i ? { name: val } : item) }));

  const addInjury = () => setForm((p) => ({ ...p, injuries: [...p.injuries, { description: '', beforeAfter: 'Before' }] }));
  const removeInjury = (i) => setForm((p) => ({ ...p, injuries: p.injuries.filter((_, idx) => idx !== i) }));
  const updateInjury = (i, field, val) => setForm((p) => ({ ...p, injuries: p.injuries.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const addArticle = () => setForm((p) => ({ ...p, articles: [...p.articles, { itemNo: p.articles.length + 1, description: '', handedTo: '' }] }));
  const removeArticle = (i) => setForm((p) => ({ ...p, articles: p.articles.filter((_, idx) => idx !== i) }));
  const updateArticle = (i, field, val) => setForm((p) => ({ ...p, articles: p.articles.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const handleSubmit = async () => {
    const e = {};
    if (!form.deceasedName.trim()) e.deceasedName = 'Required';
    if (!form.causeOfDeath.trim()) e.causeOfDeath = 'Required';
    if (!form.pmSerialNo.trim()) e.pmSerialNo = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) { setCurrentStep(Object.keys(e).includes('causeOfDeath') || Object.keys(e).includes('pmSerialNo') ? 6 : 1); return; }
    setIsSubmitting(true);
    try {
      await examinationService.createPostMortem({
        case_id: parseInt(form.selectedCaseId) || null,
        pm_number: form.pmSerialNo,
        examination_date: form.examDate || null,
        examination_time: form.examTime || null,
        name_of_deceased: form.deceasedName || null,
        age: parseInt(form.estimatedAge) || null,
        sex: form.sex || null,
        magistrate_order_date: form.reportDate || null,
        magistrate_court: form.court || null,
        police_station: form.requestedBy || null,
        identifiers: form.identifiers || null,
        external_exam: {
          locus: form.locus, clothing: form.clothing, nourishment: form.nourishment,
          colour: form.colour, marks: form.marks, productsOfDisease: form.productsOfDisease,
          injuries: form.injuries
        },
        internal_exam_head: { neck: form.neck, softParts: form.headSoftParts, bonesOfSkull: form.headBones, membranes: form.headMembranes, brain: form.headBrain, vessels: form.headBloodVessels, spinalCord: form.spinalCord },
        internal_exam_neck: { mouth: form.mouthPharynx, larynx: form.larynxTrachea },
        internal_exam_chest: { softParts: form.thoraxSoftParts, bones: form.thoraxBones, cavity: form.thoraxChestCavity, pericardium: form.thoraxPericardium, heart: form.heartWeight, lungs: form.lungsWeight },
        internal_exam_abdomen: { cavity: form.abdomenCavity, stomach: form.stomach, intestines: form.intestines, liver: form.liverWeight, pancreas: form.pancreas, spleen: form.spleenWeight, kidneys: form.kidneysWeight, bladder: form.bladder, reproductive: form.reproductive },
        cause_of_death: { cause: form.causeOfDeath, opinion: form.opinionText },
      });
      setSuccess(true);
      setTimeout(() => navigate(caseId ? `/cases/${caseId}` : '/postmortems'), 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.response?.data?.detail || err.message || 'Failed to save PM report.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (label, key, type = 'text', opts = {}) => {
    if (R) return <FF label={label}><div className={roIc + ' min-h-[36px] whitespace-pre-wrap'}>{form[key] || '—'}</div></FF>;
    if (type === 'textarea') return <FF label={label} error={errors[key]} required={opts.required}><textarea value={form[key]} onChange={(e) => h(key, e.target.value)} rows={opts.rows || 2} className={ic(errors[key])} placeholder={opts.placeholder} /></FF>;
    return <FF label={label} error={errors[key]} required={opts.required}><input type={type} value={form[key]} onChange={(e) => h(key, e.target.value)} className={ic(errors[key])} placeholder={opts.placeholder} /></FF>;
  };

  return (
    <div>
      <PageHeader
        title={existing ? `PM Report: ${existing.pmSerialNo}` : 'New Post-Mortem Report'}
        subtitle="Post-Mortem Examination Report"
        breadcrumbs={[
          { label: 'Cases', path: '/cases' },
          caseId ? { label: `Case ${caseId}`, path: `/cases/${caseId}` } : { label: 'PM Reports', path: '/postmortems' },
          { label: existing ? existing.pmSerialNo : 'New PM Report' },
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

      {!R && <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />}

      <form onSubmit={(e) => e.preventDefault()} className="max-w-5xl">

        {/* ── Step 1: Header ── */}
        {currentStep === 1 && (
          <FormSection title="Step 1 — Header Information" filledByRole="JMO">
            <div className="grid grid-cols-3 gap-4">
              {field('Inquest No.', 'inquestNo')}
              <FF label="Court">
                {R ? <div className={roIc}>{form.court || '—'}</div> : (
                  <select value={form.court} onChange={(e) => h('court', e.target.value)} className={ic()}>
                    <option value="">Select Court</option>
                    {courts.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                )}
              </FF>
              {field('Case No.', 'caseNo')}
              {field('Report Date', 'reportDate', 'date')}
              {field('Name of Deceased', 'deceasedName', 'text', { required: true })}
              {field('Date of Death', 'dateOfDeath', 'date')}
              {field('Time of Death', 'timeOfDeath', 'time')}
              {field('Examining Medical Officer', 'examiningOfficer')}
              {field('Date of PM Examination', 'examDate', 'date')}
              {field('Time of PM Examination', 'examTime', 'time')}
              {field('Requested By', 'requestedBy')}
              {field('District', 'district')}
              {field('Place of Examination', 'placeOfExamination')}
            </div>
            {/* Identification persons */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Persons who identified the body</label>
                {!R && <button type="button" onClick={addIdentifier} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add</button>}
              </div>
              {form.identifiers.map((ident, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  {R ? <div className={roIc}>{ident.name || '—'}</div> : (
                    <input type="text" value={ident.name} onChange={(e) => updateIdentifier(i, e.target.value)} className={ic()} placeholder="Name, NIC, Address" />
                  )}
                  {!R && form.identifiers.length > 1 && (
                    <button type="button" onClick={() => removeIdentifier(i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </FormSection>
        )}

        {/* ── Step 2: External Examination ── */}
        {currentStep === 2 && (
          <FormSection title="Step 2 — External Examination" filledByRole="JMO">
            {field('1. Examination of Locus — Site and Position of Body', 'locus', 'textarea', { rows: 3 })}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">2. External Examination of Body</p>
            <div className="grid grid-cols-2 gap-4">
              {field('Clothing', 'clothing', 'textarea')}
              {field('Nourishment', 'nourishment')}
              {field('Colour', 'colour')}
              {field('Marks', 'marks', 'textarea')}
              {field('Products of Disease', 'productsOfDisease', 'textarea')}
            </div>
            {/* Injuries table */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">3. Injuries Inflicted Before or After Death</label>
                {!R && <button type="button" onClick={addInjury} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Injury</button>}
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b"><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-12">No.</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Nature, Size, Shape, Disposition and Site</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-40">Before/After</th>{!R && <th className="w-10" />}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {form.injuries.map((inj, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2">{R ? <span className="text-gray-700">{inj.description || '—'}</span> : <textarea value={inj.description} onChange={(e) => updateInjury(i, 'description', e.target.value)} rows={2} className={ic()} />}</td>
                        <td className="px-3 py-2">{R ? <span>{inj.beforeAfter}</span> : (
                          <div className="flex gap-3">
                            {['Before', 'After'].map((v) => (
                              <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                                <input type="radio" name={`injury-${i}`} value={v} checked={inj.beforeAfter === v} onChange={() => updateInjury(i, 'beforeAfter', v)} className="border-gray-300 text-[#1e3a5f]" /> {v}
                              </label>
                            ))}
                          </div>
                        )}</td>
                        {!R && <td className="px-2"><button type="button" onClick={() => removeInjury(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FormSection>
        )}

        {/* ── Step 3: Identification & Signs of Death ── */}
        {currentStep === 3 && (
          <FormSection title="Step 3 — Identification and Signs of Death" filledByRole="JMO">
            <div className="grid grid-cols-3 gap-4">
              {field('Height (cm)', 'height')}
              {field('Age Estimated', 'estimatedAge')}
              <FF label="Sex">
                {R ? <div className={roIc}>{form.sex || '—'}</div> : (
                  <div className="flex gap-4 mt-1">
                    {['Male', 'Female'].map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="pmSex" value={s} checked={form.sex === s} onChange={(e) => h('sex', e.target.value)} className="border-gray-300 text-[#1e3a5f]" /> {s}
                      </label>
                    ))}
                  </div>
                )}
              </FF>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {field('Eyes and Pupils', 'eyesAndPupils', 'textarea')}
              {field('Hair — Length, Colour, Condition', 'hair', 'textarea')}
              {field('Tongue — Position and Condition', 'tongue', 'textarea')}
              {field('Teeth — Complete/Incomplete/Peculiarities', 'teeth')}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Signs of Death</p>
            <div className="grid grid-cols-2 gap-4">
              {field('Primary Flaccidity', 'primaryFlaccidity', 'textarea')}
              {field('Rigor Mortis', 'rigorMortis', 'textarea')}
              {field('Hypostasis', 'hypostasis', 'textarea')}
              {field('Putrefaction', 'putrefaction', 'textarea')}
            </div>
            <div className="mt-4">
              {field('12. Condition and Contents of Hands and Nails', 'handsAndNails', 'textarea')}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">13. Natural Openings</p>
            <div className="grid grid-cols-3 gap-4">
              {field('Nose, Mouth and Ears', 'naturalNose', 'textarea')}
              {field('Urinary and Sexual', 'naturalUrinary', 'textarea')}
              {field('Anal', 'naturalAnal', 'textarea')}
            </div>
          </FormSection>
        )}

        {/* ── Step 4: Internal (Head, Neck, Thorax) ── */}
        {currentStep === 4 && (
          <FormSection title="Step 4 — Internal Examination (Head, Neck, Thorax)" filledByRole="JMO">
            {field('14. Neck — Soft tissues, blood vessels, cervical vertebrae', 'neck', 'textarea', { rows: 3 })}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">15. Head</p>
            <div className="space-y-3">
              {field('i. Soft parts covering it', 'headSoftParts', 'textarea')}
              {field('ii. Bones of skull', 'headBones', 'textarea')}
              {field('iii. Membranes and sinuses of brain', 'headMembranes', 'textarea')}
              {field('iv. Brain substance and ventricles', 'headBrain', 'textarea')}
              {field('v. Blood vessels of brain', 'headBloodVessels', 'textarea')}
            </div>
            {field('16. Spinal Cord', 'spinalCord', 'textarea')}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">17. Thorax</p>
            <div className="space-y-3">
              {field('i. Soft parts covering it', 'thoraxSoftParts', 'textarea')}
              {field('ii. Bones — ribs, sternum, vertebrae', 'thoraxBones', 'textarea')}
              {field('iii. Chest cavity — position of organs, pleural contents', 'thoraxChestCavity', 'textarea')}
              {field('iv. Pericardium and its contents', 'thoraxPericardium', 'textarea')}
              {field('v. Heart — cavities, contents, valves, myocardium', 'thoraxHeart', 'textarea')}
              {field('vi. Coronary vessels', 'thoraxCoronary', 'textarea')}
              {field('vii. Large blood vessels', 'thoraxLargeVessels', 'textarea')}
              {field('viii. Larynx, trachea and bronchi', 'thoraxAirway', 'textarea')}
              {field('ix. Pleura and Lungs', 'thoraxLungs', 'textarea')}
              {field('x. Gullet', 'thoraxGullet', 'textarea')}
            </div>
          </FormSection>
        )}

        {/* ── Step 5: Internal (Abdomen, Pelvis) ── */}
        {currentStep === 5 && (
          <FormSection title="Step 5 — Internal Examination (Abdomen, Pelvis)" filledByRole="JMO">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">18. Abdomen</p>
            <div className="space-y-3">
              {field('i. Contents, vessels and position of organs', 'abdContents', 'textarea')}
              {field('ii. Peritoneum', 'abdPeritoneum', 'textarea')}
              {field('iii. Diaphragm', 'abdDiaphragm', 'textarea')}
              {field('iv. Liver and Gall Bladder', 'abdLiver', 'textarea')}
              {field('v. Spleen', 'abdSpleen', 'textarea')}
              {field('vi. Stomach — condition and contents', 'abdStomach', 'textarea')}
              {field('vii. Small intestines — condition and contents', 'abdSmallIntestine', 'textarea')}
              {field('viii. Large intestines — condition and contents', 'abdLargeIntestine', 'textarea')}
              {field('ix. Pancreas', 'abdPancreas', 'textarea')}
              {field('x. Kidneys', 'abdKidneys', 'textarea')}
              {field('xi. Supra-renal glands', 'abdSupraRenal', 'textarea')}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">19. Pelvis</p>
            <div className="space-y-3">
              {field('i. Urinary bladder/prostate — condition and contents', 'pelvisBladder', 'textarea')}
              {field('ii. Generative organs', 'pelvisGenerative', 'textarea')}
              {field('iii. Blood vessels', 'pelvisVessels', 'textarea')}
              {field('iv. Vertebrae and pelvic bones', 'pelvisBones', 'textarea')}
            </div>
          </FormSection>
        )}

        {/* ── Step 6: Opinion & Conclusion ── */}
        {currentStep === 6 && (
          <FormSection title="Step 6 — Opinion and Conclusion" filledByRole="JMO">
            <FF label="20. Cause of Death and Other Relevant Opinion" error={errors.causeOfDeath} required>
              {R ? <div className={roIc + ' min-h-[80px]'}>{form.causeOfDeath || '—'}</div> : (
                <textarea value={form.causeOfDeath} onChange={(e) => h('causeOfDeath', e.target.value)} rows={4} className={ic(errors.causeOfDeath) + ' font-medium'} placeholder="State the cause of death..." />
              )}
            </FF>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {field('PM Register Serial Number', 'pmSerialNo', 'text', { required: true })}
              {field('Date', 'signatureDate', 'date')}
              {field('Medical Officer Name', 'moName')}
              {field('Qualifications', 'moQualifications')}
              {field('Designation', 'moDesignation')}
            </div>
            <div className="mt-4 p-3 border border-dashed border-gray-300 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Signature of Medical Officer</p>
              <div className="h-12 mt-1 border-b border-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {field('Verdict of the Inquirer/Magistrate', 'verdict', 'textarea')}
              {field('Magistrate/Verdict Date', 'verdictDate', 'date')}
              {field('Sworn/Affirmed Date', 'swornDate', 'date')}
            </div>
            {/* Articles secured */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Articles Secured for Further Examination</label>
                {!R && <button type="button" onClick={addArticle} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Item</button>}
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b"><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-16">No.</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Description</th><th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 w-48">Handed to</th>{!R && <th className="w-10" />}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {form.articles.map((art, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2">{R ? <span>{art.description || '—'}</span> : <input type="text" value={art.description} onChange={(e) => updateArticle(i, 'description', e.target.value)} className={ic()} />}</td>
                        <td className="px-3 py-2">{R ? <span>{art.handedTo || '—'}</span> : <input type="text" value={art.handedTo} onChange={(e) => updateArticle(i, 'handedTo', e.target.value)} className={ic()} />}</td>
                        {!R && <td className="px-2"><button type="button" onClick={() => removeArticle(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FormSection>
        )}

        {/* ── Navigation Buttons ── */}
        {!R && (
          <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 px-6 py-3 -mx-0 mt-6 flex items-center justify-between shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            <button type="button" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="text-xs text-gray-400">Step {currentStep} of {STEPS.length}</div>
            {currentStep < STEPS.length ? (
              <button type="button" onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded hover:bg-[#163050] transition-colors">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting || success}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Save className="h-4 w-4" /> Submit Report</>}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
