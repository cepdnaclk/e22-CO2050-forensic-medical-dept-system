// src/pages/persons/DeceasedPersonForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { hospitals, wards } from '../../data/mockData';

const PLACES_OF_DEATH = ['At Scene', 'Hospital on Admission', 'Hospital during Stay', 'Unknown'];

export default function DeceasedPersonForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    nicNo: '',
    age: '',
    sex: '',
    address: '',
    dateOfDeath: '',
    timeOfDeath: '',
    placeOfDeath: '',
    hospitalName: '',
    ward: '',
    bhtNo: '',
  });

  const showHospitalFields = ['Hospital on Admission', 'Hospital during Stay'].includes(form.placeOfDeath);
  const filteredWards = wards.filter((w) => w.hospitalId === parseInt(form.hospitalName));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateNIC = (nic) => {
    if (!nic) return 'NIC number is required.';
    const old = /^\d{9}[VvXx]$/;
    const newer = /^\d{12}$/;
    if (!old.test(nic) && !newer.test(nic)) return 'Invalid NIC format. Must be 9 digits + V/X or 12 digits.';
    return '';
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    const nicErr = validateNIC(form.nicNo);
    if (nicErr) newErrors.nicNo = nicErr;
    if (!form.age || isNaN(form.age) || parseInt(form.age) < 0) newErrors.age = 'Valid age is required.';
    if (!form.sex) newErrors.sex = 'Sex is required.';
    if (!form.dateOfDeath) newErrors.dateOfDeath = 'Date of death is required.';
    if (form.dateOfDeath && new Date(form.dateOfDeath) > new Date()) newErrors.dateOfDeath = 'Date cannot be in the future.';
    if (!form.placeOfDeath) newErrors.placeOfDeath = 'Place of death is required.';
    if (showHospitalFields && !form.hospitalName) newErrors.hospitalName = 'Hospital name is required.';
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
    setTimeout(() => navigate('/cases'), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Deceased Person Registration"
        breadcrumbs={[
          { label: 'Persons', path: '/cases' },
          { label: 'Deceased' },
          { label: 'New' },
        ]}
      />

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Deceased person record saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-4xl">
        <FormSection title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" error={errors.fullName} required>
              <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Full name of deceased" className={inputClass(errors.fullName)} />
            </FormField>
            <FormField label="NIC Number" error={errors.nicNo} required>
              <input type="text" value={form.nicNo} onChange={(e) => handleChange('nicNo', e.target.value)} placeholder="e.g. 199523456789 or 580345612V" className={inputClass(errors.nicNo)} />
            </FormField>
            <FormField label="Age" error={errors.age} required>
              <input type="number" min="0" max="150" value={form.age} onChange={(e) => handleChange('age', e.target.value)} className={inputClass(errors.age)} />
            </FormField>
            <FormField label="Sex" error={errors.sex} required>
              <select value={form.sex} onChange={(e) => handleChange('sex', e.target.value)} className={inputClass(errors.sex)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Unknown">Unknown</option>
              </select>
            </FormField>
            <div className="col-span-2">
              <FormField label="Address">
                <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} className={inputClass()} placeholder="Full address" />
              </FormField>
            </div>
          </div>
        </FormSection>

        <FormSection title="Death Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date of Death" error={errors.dateOfDeath} required>
              <input type="date" value={form.dateOfDeath} onChange={(e) => handleChange('dateOfDeath', e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputClass(errors.dateOfDeath)} />
            </FormField>
            <FormField label="Time of Death">
              <input type="time" value={form.timeOfDeath} onChange={(e) => handleChange('timeOfDeath', e.target.value)} className={inputClass()} />
            </FormField>
            <FormField label="Place of Death" error={errors.placeOfDeath} required>
              <select value={form.placeOfDeath} onChange={(e) => handleChange('placeOfDeath', e.target.value)} className={inputClass(errors.placeOfDeath)}>
                <option value="">Select</option>
                {PLACES_OF_DEATH.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        {showHospitalFields && (
          <FormSection title="Hospital Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Hospital" error={errors.hospitalName} required>
                <select value={form.hospitalName} onChange={(e) => handleChange('hospitalName', e.target.value)} className={inputClass(errors.hospitalName)}>
                  <option value="">Select hospital</option>
                  {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </FormField>
              <FormField label="Ward">
                <select value={form.ward} onChange={(e) => handleChange('ward', e.target.value)} className={inputClass()} disabled={!form.hospitalName}>
                  <option value="">Select ward</option>
                  {filteredWards.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.type})</option>)}
                </select>
              </FormField>
              <FormField label="BHT Number">
                <input type="text" value={form.bhtNo} onChange={(e) => handleChange('bhtNo', e.target.value)} placeholder="e.g. BHT-2025-14-0887" className={inputClass()} />
              </FormField>
            </div>
          </FormSection>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Record</>}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, children, error, required }) {
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

function inputClass(error) {
  return `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] disabled:bg-gray-50 disabled:text-gray-400 ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;
}
