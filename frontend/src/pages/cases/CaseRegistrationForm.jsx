// src/pages/cases/CaseRegistrationForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import FormSection from '../../components/shared/FormSection';
import { caseService } from '../../services/api';
import {
  CASE_TYPES, CASE_STATUSES, medicalOfficers, policeStations,
  policeOfficers, courts, magistrates
} from '../../data/mockData';

export default function CaseRegistrationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    caseType: '',
    inquestNo: '',
    courtCaseNo: '',
    openedDate: new Date().toISOString().split('T')[0],
    status: 'Open',
    assignedJMO: '',
    policeStation: '',
    policeOfficer: '',
    court: '',
    magistrate: '',
  });

  const filteredOfficers = policeOfficers.filter(
    (o) => o.stationId === parseInt(form.policeStation)
  );

  const filteredMagistrates = magistrates.filter(
    (m) => m.courtId === parseInt(form.court)
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // Reset dependent fields
    if (field === 'policeStation') {
      setForm((prev) => ({ ...prev, policeOfficer: '' }));
    }
    if (field === 'court') {
      setForm((prev) => ({ ...prev, magistrate: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.caseType) newErrors.caseType = 'Case type is required.';
    if (!form.inquestNo.trim()) newErrors.inquestNo = 'Inquest number is required.';
    if (!form.openedDate) newErrors.openedDate = 'Opened date is required.';
    if (new Date(form.openedDate) > new Date()) newErrors.openedDate = 'Date cannot be in the future.';
    // JMO, Police Station, Court are optional — DB does not yet have those FK rows
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await caseService.createCase({
        case_number: form.inquestNo,
        opened_date: form.openedDate,
        status: form.status.toUpperCase(),
        case_type_id: parseInt(form.caseType) || null,
        assigned_jmo_id: parseInt(form.assignedJMO) || null,
        police_station_id: parseInt(form.policeStation) || null,
        court_id: parseInt(form.court) || null,
        court_case_no: form.courtCaseNo || null
      });
      setSuccess(true);
      setTimeout(() => navigate('/cases'), 1500);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.response?.data?.detail || err.message || 'Failed to register case.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Register New Case"
        breadcrumbs={[
          { label: 'Cases', path: '/cases' },
          { label: 'Register New Case' },
        ]}
      />

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {apiError}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Case registered successfully. Redirecting...
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-md p-6 max-w-4xl">
        {/* Section 1 — Case Information */}
        <FormSection title="Section 1 — Case Information">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Case Type"
              error={errors.caseType}
              required
            >
              <select
                value={form.caseType}
                onChange={(e) => handleChange('caseType', e.target.value)}
                className={inputClass(errors.caseType)}
              >
                <option value="">Select case type</option>
                {CASE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Inquest Number" error={errors.inquestNo} required>
              <input
                type="text"
                value={form.inquestNo}
                onChange={(e) => handleChange('inquestNo', e.target.value)}
                placeholder="e.g. INQ/KDY/2025/0087"
                className={inputClass(errors.inquestNo)}
              />
            </FormField>

            <FormField label="Court Case Number">
              <input
                type="text"
                value={form.courtCaseNo}
                onChange={(e) => handleChange('courtCaseNo', e.target.value)}
                placeholder="e.g. MC/KDY/2025/1124"
                className={inputClass()}
              />
            </FormField>

            <FormField label="Opened Date" error={errors.openedDate} required>
              <input
                type="date"
                value={form.openedDate}
                onChange={(e) => handleChange('openedDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={inputClass(errors.openedDate)}
              />
            </FormField>

            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={inputClass()}
              >
                {CASE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        {/* Section 2 — Assigned Personnel */}
        <FormSection title="Section 2 — Assigned Personnel">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assigned JMO">
              <select
                value={form.assignedJMO}
                onChange={(e) => handleChange('assignedJMO', e.target.value)}
                className={inputClass(errors.assignedJMO)}
              >
                <option value="">Select JMO</option>
                {medicalOfficers.map((mo) => (
                  <option key={mo.id} value={mo.id}>
                    {mo.fullName} — {mo.slmcRegNo}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Police Station">
              <select
                value={form.policeStation}
                onChange={(e) => handleChange('policeStation', e.target.value)}
                className={inputClass(errors.policeStation)}
              >
                <option value="">Select police station</option>
                {policeStations.map((ps) => (
                  <option key={ps.id} value={ps.id}>{ps.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Police Officer">
              <select
                value={form.policeOfficer}
                onChange={(e) => handleChange('policeOfficer', e.target.value)}
                className={inputClass()}
                disabled={!form.policeStation}
              >
                <option value="">Select officer</option>
                {filteredOfficers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.rank} — {o.regNo})
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        {/* Section 3 — Linked Court */}
        <FormSection title="Section 3 — Linked Court">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Court">
              <select
                value={form.court}
                onChange={(e) => handleChange('court', e.target.value)}
                className={inputClass(errors.court)}
              >
                <option value="">Select court</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Magistrate">
              <select
                value={form.magistrate}
                onChange={(e) => handleChange('magistrate', e.target.value)}
                className={inputClass()}
                disabled={!form.court}
              >
                <option value="">Select magistrate</option>
                {filteredMagistrates.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Registering...</>
            ) : (
              <><Save className="h-4 w-4" /> Register Case</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, children, error, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full px-3 py-2 border rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] focus:border-[#1e3a5f] disabled:bg-gray-50 disabled:text-gray-400 ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;
}
