// src/pages/persons/InjuredPersonForm.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { caseService } from '../../services/api';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { hospitals, wards } from '../../data/mockData';

const CURRENT_STATUSES = ['Admitted', 'Under Observation', 'Discharged', 'Transferred', 'Deceased'];

export default function InjuredPersonForm() {
  const navigate = useNavigate();
  const { id: caseId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '', nicNo: '', age: '', sex: '', address: '',
    dateOfAdmission: '', hospital: '', ward: '', bhtNo: '',
    dateOfDischarge: '', currentStatus: '',
  });

  const filteredWards = wards.filter((w) => w.hospitalId === parseInt(form.hospital));

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
    if (!form.age || parseInt(form.age) < 0) newErrors.age = 'Valid age is required.';
    if (!form.sex) newErrors.sex = 'Sex is required.';
    if (!form.dateOfAdmission) newErrors.dateOfAdmission = 'Date of admission is required.';
    if (!form.hospital) newErrors.hospital = 'Hospital is required.';
    if (!form.currentStatus) newErrors.currentStatus = 'Current status is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await caseService.addInjured(caseId, {
        full_name: form.fullName,
        nic: form.nicNo || null,
        age: parseInt(form.age) || null,
        sex: form.sex || null,
        address: form.address || null,
        date_of_incident: form.dateOfIncident || null,
        time_of_incident: form.timeOfIncident || null,
        place_of_incident: form.placeOfIncident || null,
        hospital_name: showHospitalFields ? form.hospitalName : null,
        ward: showHospitalFields ? form.ward : null,
        bht_no: showHospitalFields ? form.bhtNo : null,
      });
      setSuccess(true);
      setTimeout(() => navigate('/cases'), 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.response?.data?.detail || err.message || 'Failed to save record.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Injured Person Registration"
        breadcrumbs={[
          { label: 'Persons', path: '/cases' },
          { label: 'Injured' },
          { label: 'New' },
        ]}
      />

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Injured person record saved successfully.
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-4xl">
        <FormSection title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" error={errors.fullName} required>
              <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} className={inputClass(errors.fullName)} />
            </FormField>
            <FormField label="NIC Number" error={errors.nicNo} required>
              <input type="text" value={form.nicNo} onChange={(e) => handleChange('nicNo', e.target.value)} placeholder="e.g. 199834567890" className={inputClass(errors.nicNo)} />
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
                <textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} className={inputClass()} />
              </FormField>
            </div>
          </div>
        </FormSection>

        <FormSection title="Admission Details">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date of Admission" error={errors.dateOfAdmission} required>
              <input type="date" value={form.dateOfAdmission} onChange={(e) => handleChange('dateOfAdmission', e.target.value)} className={inputClass(errors.dateOfAdmission)} />
            </FormField>
            <FormField label="Hospital" error={errors.hospital} required>
              <select value={form.hospital} onChange={(e) => handleChange('hospital', e.target.value)} className={inputClass(errors.hospital)}>
                <option value="">Select hospital</option>
                {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </FormField>
            <FormField label="Ward">
              <select value={form.ward} onChange={(e) => handleChange('ward', e.target.value)} className={inputClass()} disabled={!form.hospital}>
                <option value="">Select ward</option>
                {filteredWards.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.type})</option>)}
              </select>
            </FormField>
            <FormField label="BHT Number">
              <input type="text" value={form.bhtNo} onChange={(e) => handleChange('bhtNo', e.target.value)} placeholder="e.g. BHT-2025-14-0912" className={inputClass()} />
            </FormField>
            <FormField label="Date of Discharge">
              <input type="date" value={form.dateOfDischarge} onChange={(e) => handleChange('dateOfDischarge', e.target.value)} className={inputClass()} />
            </FormField>
            <FormField label="Current Status" error={errors.currentStatus} required>
              <select value={form.currentStatus} onChange={(e) => handleChange('currentStatus', e.target.value)} className={inputClass(errors.currentStatus)}>
                <option value="">Select status</option>
                {CURRENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isSubmitting || success} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Record</>}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors">Cancel</button>
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
