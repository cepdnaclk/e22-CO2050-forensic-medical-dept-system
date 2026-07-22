// src/pages/postmortem/PostMortemFormPage.jsx
// Complete Post-Mortem Report mirroring the real Sri Lankan PM booklet
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { postMortemReports, cases } from '../../data/mockData';

export default function PostMortemFormPage() {
  const { id: caseId, pmId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const existing = pmId ? postMortemReports.find((pm) => pm.id === parseInt(pmId)) : null;
  const isReadOnly = !!existing;

  const [form, setForm] = useState({
    selectedCaseId: caseId || existing?.caseId || '',
    // Header
    inquestNo: existing?.inquestNo || '',
    court: existing?.court || '',
    caseNo: existing?.caseNo || '',
    deceasedName: existing?.deceasedName || '',
    dateOfDeath: existing?.dateOfDeath || '',
    timeOfDeath: existing?.timeOfDeath || '',
    examiningOfficer: existing?.examiningOfficer || '',
    examDate: existing?.examDate || '',
    examTime: existing?.examTime || '',
    requestedBy: existing?.requestedBy || '',
    district: existing?.district || '',
    placeOfExamination: existing?.placeOfExamination || '',
    identifiedBy: existing?.identifiedBy || '',
    pmSerialNo: existing?.pmSerialNo || '',

    // External Examination
    locus: existing?.externalExamination?.locus || '',
    clothing: existing?.externalExamination?.clothing || '',
    nourishment: existing?.externalExamination?.nourishment || '',
    colour: existing?.externalExamination?.colour || '',
    marks: existing?.externalExamination?.marks || '',
    productsOfDisease: existing?.externalExamination?.productsOfDisease || '',
    injuries: existing?.externalExamination?.injuries || [{ no: 1, description: '' }],

    // Identification
    height: existing?.identificationFields?.height || '',
    estimatedAge: existing?.identificationFields?.estimatedAge || '',
    sex: existing?.identificationFields?.sex || '',
    eyesAndPupils: existing?.identificationFields?.eyesAndPupils || '',
    hair: existing?.identificationFields?.hair || '',
    tongue: existing?.identificationFields?.tongue || '',
    teeth: existing?.identificationFields?.teeth || '',

    // Signs of Death
    primaryFlaccidity: existing?.signsOfDeath?.primaryFlaccidity || '',
    rigorMortis: existing?.signsOfDeath?.rigorMortis || '',
    hypostasis: existing?.signsOfDeath?.hypostasis || '',
    putrefaction: existing?.signsOfDeath?.putrefaction || '',

    // Internal Examination
    handsAndNails: existing?.internalExamination?.handsAndNails || '',
    naturalOpenings: existing?.internalExamination?.naturalOpenings || '',
    neck: existing?.internalExamination?.neck || '',

    // Head
    headSoftParts: existing?.internalExamination?.head?.softParts || '',
    headBones: existing?.internalExamination?.head?.bonesOfSkull || '',
    headMembranes: existing?.internalExamination?.head?.membranesAndSinuses || '',
    headBrain: existing?.internalExamination?.head?.brainSubstance || '',
    headBloodVessels: existing?.internalExamination?.head?.bloodVessels || '',

    spinalCord: existing?.internalExamination?.spinalCord || '',

    // Thorax
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

    // Abdomen
    abdomenContents: existing?.internalExamination?.abdomen?.contentsAndPosition || '',
    abdomenPeritoneum: existing?.internalExamination?.abdomen?.peritoneum || '',
    abdomenDiaphragm: existing?.internalExamination?.abdomen?.diaphragm || '',
    abdomenLiver: existing?.internalExamination?.abdomen?.liverAndGallBladder || '',
    abdomenSpleen: existing?.internalExamination?.abdomen?.spleen || '',
    abdomenStomach: existing?.internalExamination?.abdomen?.stomach || '',
    abdomenSmallIntestine: existing?.internalExamination?.abdomen?.smallIntestine || '',
    abdomenLargeIntestine: existing?.internalExamination?.abdomen?.largeIntestine || '',
    abdomenPancreas: existing?.internalExamination?.abdomen?.pancreas || '',
    abdomenKidneys: existing?.internalExamination?.abdomen?.kidneys || '',
    abdomenSupraRenal: existing?.internalExamination?.abdomen?.supraRenalGlands || '',

    // Pelvis
    pelvisBladder: existing?.internalExamination?.pelvis?.urinaryBladder || '',
    pelvisGenerative: existing?.internalExamination?.pelvis?.generativeOrgans || '',
    pelvisBloodVessels: existing?.internalExamination?.pelvis?.bloodVessels || '',
    pelvisBones: existing?.internalExamination?.pelvis?.vertebraeAndBones || '',

    // Cause of Death
    causeOfDeath: existing?.causeOfDeath || '',
    verdict: existing?.verdict || '',
    articlesSecured: existing?.articlesSecured || '',

    // Signature
    moSignature: existing?.moSignature || '',
    moQualifications: existing?.moQualifications || '',
    moDesignation: existing?.moDesignation || '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addInjury = () => {
    setForm((prev) => ({
      ...prev,
      injuries: [...prev.injuries, { no: prev.injuries.length + 1, description: '' }],
    }));
  };

  const updateInjury = (idx, desc) => {
    setForm((prev) => ({
      ...prev,
      injuries: prev.injuries.map((inj, i) => (i === idx ? { ...inj, description: desc } : inj)),
    }));
  };

  const removeInjury = (idx) => {
    setForm((prev) => ({
      ...prev,
      injuries: prev.injuries.filter((_, i) => i !== idx).map((inj, i) => ({ ...inj, no: i + 1 })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.selectedCaseId) newErrors.selectedCaseId = 'Case selection is required.';
    if (!form.pmSerialNo.trim()) newErrors.pmSerialNo = 'PM Serial No. is required.';
    if (!form.deceasedName.trim()) newErrors.deceasedName = 'Deceased name is required.';
    if (!form.causeOfDeath.trim()) newErrors.causeOfDeath = 'Cause of death is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(`/cases/${form.selectedCaseId}`), 1500);
  };

  const R = isReadOnly;

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
          <CheckCircle className="h-4 w-4" /> Post-mortem report saved successfully.
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

        {/* Header Section */}
        <FormSection title="Report Header">
          <div className="grid grid-cols-3 gap-4">
            <FF label="PM Serial No." error={errors.pmSerialNo} required>
              <input type="text" value={form.pmSerialNo} onChange={(e) => handleChange('pmSerialNo', e.target.value)} placeholder="e.g. KDY/PM/2025/034" className={ic(errors.pmSerialNo)} readOnly={R} />
            </FF>
            <FF label="Inquest No.">
              <input type="text" value={form.inquestNo} onChange={(e) => handleChange('inquestNo', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Place (Court)">
              <input type="text" value={form.court} onChange={(e) => handleChange('court', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Case No.">
              <input type="text" value={form.caseNo} onChange={(e) => handleChange('caseNo', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Name of Deceased" error={errors.deceasedName} required>
              <input type="text" value={form.deceasedName} onChange={(e) => handleChange('deceasedName', e.target.value)} className={ic(errors.deceasedName)} readOnly={R} />
            </FF>
            <FF label="Date of Death">
              <input type="date" value={form.dateOfDeath} onChange={(e) => handleChange('dateOfDeath', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Time of Death">
              <input type="time" value={form.timeOfDeath} onChange={(e) => handleChange('timeOfDeath', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Examining Officer">
              <input type="text" value={form.examiningOfficer} onChange={(e) => handleChange('examiningOfficer', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Date of PM Examination">
              <input type="date" value={form.examDate} onChange={(e) => handleChange('examDate', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Time of PM Examination">
              <input type="time" value={form.examTime} onChange={(e) => handleChange('examTime', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="Requested By">
              <input type="text" value={form.requestedBy} onChange={(e) => handleChange('requestedBy', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <FF label="District">
              <input type="text" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className={ic()} readOnly={R} />
            </FF>
            <div className="col-span-2">
              <FF label="Place of Examination">
                <input type="text" value={form.placeOfExamination} onChange={(e) => handleChange('placeOfExamination', e.target.value)} className={ic()} readOnly={R} />
              </FF>
            </div>
            <div className="col-span-3">
              <FF label="Person(s) who identified the body (name and address)">
                <textarea value={form.identifiedBy} onChange={(e) => handleChange('identifiedBy', e.target.value)} rows={2} className={ic()} readOnly={R} />
              </FF>
            </div>
          </div>
        </FormSection>

        {/* External Examination */}
        <FormSection title="External Examination">
          <FF label="1. Examination of locus (site and position of body)">
            <textarea value={form.locus} onChange={(e) => handleChange('locus', e.target.value)} rows={3} className={ic()} readOnly={R} />
          </FF>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-3">
            2. External examination of body
          </p>
          <div className="grid grid-cols-2 gap-4 ml-4">
            <FF label="Clothing"><textarea value={form.clothing} onChange={(e) => handleChange('clothing', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="Nourishment"><input type="text" value={form.nourishment} onChange={(e) => handleChange('nourishment', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Colour"><input type="text" value={form.colour} onChange={(e) => handleChange('colour', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Marks"><textarea value={form.marks} onChange={(e) => handleChange('marks', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="Products of Disease"><input type="text" value={form.productsOfDisease} onChange={(e) => handleChange('productsOfDisease', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                3. Injuries inflicted before or after death
              </p>
              {!R && (
                <button type="button" onClick={addInjury} className="text-xs text-[#1e3a5f] hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Injury
                </button>
              )}
            </div>
            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-16">No.</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Nature/Size/Shape/Disposition/Site of Injury</th>
                    {!R && <th className="w-10"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {form.injuries.map((inj, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-gray-600">{inj.no}</td>
                      <td className="px-3 py-1">
                        <textarea value={inj.description} onChange={(e) => updateInjury(idx, e.target.value)} rows={2} className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" readOnly={R} />
                      </td>
                      {!R && (
                        <td className="px-2">
                          {form.injuries.length > 1 && (
                            <button type="button" onClick={() => removeInjury(idx)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FormSection>

        {/* Identification Fields */}
        <FormSection title="Identification">
          <div className="grid grid-cols-3 gap-4">
            <FF label="Height"><input type="text" value={form.height} onChange={(e) => handleChange('height', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Age (estimated)"><input type="text" value={form.estimatedAge} onChange={(e) => handleChange('estimatedAge', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Sex"><input type="text" value={form.sex} onChange={(e) => handleChange('sex', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Eyes and Pupils"><input type="text" value={form.eyesAndPupils} onChange={(e) => handleChange('eyesAndPupils', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Hair (length/colour/condition)"><input type="text" value={form.hair} onChange={(e) => handleChange('hair', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Tongue (position/condition)"><input type="text" value={form.tongue} onChange={(e) => handleChange('tongue', e.target.value)} className={ic()} readOnly={R} /></FF>
            <div className="col-span-3">
              <FF label="Teeth (complete/incomplete/peculiarities)"><input type="text" value={form.teeth} onChange={(e) => handleChange('teeth', e.target.value)} className={ic()} readOnly={R} /></FF>
            </div>
          </div>
        </FormSection>

        {/* Signs of Death */}
        <FormSection title="Signs of Death">
          <div className="grid grid-cols-2 gap-4">
            <FF label="Primary Flaccidity"><input type="text" value={form.primaryFlaccidity} onChange={(e) => handleChange('primaryFlaccidity', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Rigor Mortis"><input type="text" value={form.rigorMortis} onChange={(e) => handleChange('rigorMortis', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Hypostasis"><input type="text" value={form.hypostasis} onChange={(e) => handleChange('hypostasis', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Putrefaction"><input type="text" value={form.putrefaction} onChange={(e) => handleChange('putrefaction', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        {/* Internal Examination */}
        <FormSection title="Internal Examination">
          <FF label="12. Condition and contents of hands and nails"><textarea value={form.handsAndNails} onChange={(e) => handleChange('handsAndNails', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
          <FF label="13. Natural openings (nose/mouth/ears, urinary/sexual, anal)"><textarea value={form.naturalOpenings} onChange={(e) => handleChange('naturalOpenings', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
          <FF label="14. Neck — soft tissues, blood vessels, cervical vertebrae"><textarea value={form.neck} onChange={(e) => handleChange('neck', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
        </FormSection>

        <FormSection title="15. Head">
          <div className="space-y-3 ml-4">
            <FF label="i. Soft parts covering it"><textarea value={form.headSoftParts} onChange={(e) => handleChange('headSoftParts', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ii. Bones of skull"><textarea value={form.headBones} onChange={(e) => handleChange('headBones', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iii. Membranes and sinuses of brain"><textarea value={form.headMembranes} onChange={(e) => handleChange('headMembranes', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iv. Brain substance and ventricles"><textarea value={form.headBrain} onChange={(e) => handleChange('headBrain', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="v. Blood vessels of brain"><textarea value={form.headBloodVessels} onChange={(e) => handleChange('headBloodVessels', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="16. Spinal Cord">
          <textarea value={form.spinalCord} onChange={(e) => handleChange('spinalCord', e.target.value)} rows={2} className={ic()} readOnly={R} />
        </FormSection>

        <FormSection title="17. Thorax">
          <div className="space-y-3 ml-4">
            <FF label="i. Soft parts"><textarea value={form.thoraxSoftParts} onChange={(e) => handleChange('thoraxSoftParts', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ii. Bones (ribs, sternum, vertebrae)"><textarea value={form.thoraxBones} onChange={(e) => handleChange('thoraxBones', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iii. Chest cavity (position of organs, contents of pleural cavities)"><textarea value={form.thoraxChestCavity} onChange={(e) => handleChange('thoraxChestCavity', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iv. Pericardium and its contents"><textarea value={form.thoraxPericardium} onChange={(e) => handleChange('thoraxPericardium', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="v. Heart (cavities and contents, valves, myocardium)"><textarea value={form.thoraxHeart} onChange={(e) => handleChange('thoraxHeart', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="vi. Coronary vessels"><textarea value={form.thoraxCoronary} onChange={(e) => handleChange('thoraxCoronary', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="vii. Large blood vessels"><textarea value={form.thoraxLargeVessels} onChange={(e) => handleChange('thoraxLargeVessels', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="viii. Larynx, trachea and bronchi (condition and contents)"><textarea value={form.thoraxAirway} onChange={(e) => handleChange('thoraxAirway', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ix. Pleura and Lungs"><textarea value={form.thoraxLungs} onChange={(e) => handleChange('thoraxLungs', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="x. Gullet"><textarea value={form.thoraxGullet} onChange={(e) => handleChange('thoraxGullet', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="18. Abdomen">
          <div className="space-y-3 ml-4">
            <FF label="i. Contents, vessels, position of organs"><textarea value={form.abdomenContents} onChange={(e) => handleChange('abdomenContents', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ii. Peritoneum"><textarea value={form.abdomenPeritoneum} onChange={(e) => handleChange('abdomenPeritoneum', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iii. Diaphragm"><input type="text" value={form.abdomenDiaphragm} onChange={(e) => handleChange('abdomenDiaphragm', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="iv. Liver and Gall Bladder"><textarea value={form.abdomenLiver} onChange={(e) => handleChange('abdomenLiver', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="v. Spleen"><input type="text" value={form.abdomenSpleen} onChange={(e) => handleChange('abdomenSpleen', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="vi. Stomach (condition and contents)"><textarea value={form.abdomenStomach} onChange={(e) => handleChange('abdomenStomach', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="vii. Duodenum, jejunum, ileum"><textarea value={form.abdomenSmallIntestine} onChange={(e) => handleChange('abdomenSmallIntestine', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="viii. Large intestines"><textarea value={form.abdomenLargeIntestine} onChange={(e) => handleChange('abdomenLargeIntestine', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ix. Pancreas"><input type="text" value={form.abdomenPancreas} onChange={(e) => handleChange('abdomenPancreas', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="x. Kidneys"><textarea value={form.abdomenKidneys} onChange={(e) => handleChange('abdomenKidneys', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="xi. Supra-renal glands"><input type="text" value={form.abdomenSupraRenal} onChange={(e) => handleChange('abdomenSupraRenal', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        <FormSection title="19. Pelvis">
          <div className="space-y-3 ml-4">
            <FF label="i. Urinary bladder / Prostate"><textarea value={form.pelvisBladder} onChange={(e) => handleChange('pelvisBladder', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="ii. Generative organs"><textarea value={form.pelvisGenerative} onChange={(e) => handleChange('pelvisGenerative', e.target.value)} rows={2} className={ic()} readOnly={R} /></FF>
            <FF label="iii. Blood vessels"><input type="text" value={form.pelvisBloodVessels} onChange={(e) => handleChange('pelvisBloodVessels', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="iv. Vertebrae and pelvic bones"><input type="text" value={form.pelvisBones} onChange={(e) => handleChange('pelvisBones', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
        </FormSection>

        {/* Cause of Death */}
        <FormSection title="20. Cause of Death and Other Relevant Opinion">
          <div className="bg-amber-50 border border-amber-200 rounded p-4">
            <FF label="Cause of Death" error={errors.causeOfDeath} required>
              <textarea value={form.causeOfDeath} onChange={(e) => handleChange('causeOfDeath', e.target.value)} rows={3} className={`${ic(errors.causeOfDeath)} font-medium`} readOnly={R} placeholder="State the cause of death clearly" />
            </FF>
          </div>
        </FormSection>

        {/* Footer */}
        <FormSection title="Report Footer">
          <div className="grid grid-cols-2 gap-4">
            <FF label="Verdict of the Inquirer/Magistrate">
              <textarea value={form.verdict} onChange={(e) => handleChange('verdict', e.target.value)} rows={2} className={ic()} readOnly={R} />
            </FF>
            <FF label="Articles secured for further examination">
              <textarea value={form.articlesSecured} onChange={(e) => handleChange('articlesSecured', e.target.value)} rows={2} className={ic()} readOnly={R} />
            </FF>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <FF label="Medical Officer Name"><input type="text" value={form.moSignature} onChange={(e) => handleChange('moSignature', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Qualifications"><input type="text" value={form.moQualifications} onChange={(e) => handleChange('moQualifications', e.target.value)} className={ic()} readOnly={R} /></FF>
            <FF label="Designation"><input type="text" value={form.moDesignation} onChange={(e) => handleChange('moDesignation', e.target.value)} className={ic()} readOnly={R} /></FF>
          </div>
          <div className="mt-4 p-3 border border-dashed border-gray-300 rounded">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Signature & Official Stamp</p>
            <div className="h-12 mt-1 border-b border-gray-200" />
          </div>
        </FormSection>

        {!R && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Report</>}
            </button>
            <button type="button" onClick={() => navigate(caseId ? `/cases/${caseId}` : '/postmortems')} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}

function FF({ label, children, error, required }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function ic(error) {
  return `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] read-only:bg-gray-50 read-only:text-gray-600 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
}
