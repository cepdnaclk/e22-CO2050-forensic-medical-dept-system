import api from '../lib/axios';

export const caseService = {
  getCases: (params) => api.get('/cases', { params }).then(res => res.data),
  getCase: (id) => api.get(`/cases/${id}`).then(res => res.data),
  createCase: (data) => api.post('/cases', data).then(res => res.data),
  updateCase: (id, data) => api.put(`/cases/${id}`, data).then(res => res.data),
  deleteCase: (id) => api.delete(`/cases/${id}`).then(res => res.data),
  addDeceased: (id, data) => api.post(`/cases/${id}/deceased`, data).then(res => res.data),
  addInjured: (id, data) => api.post(`/cases/${id}/injured`, data).then(res => res.data),
};

export const examinationService = {
  getMlefs: () => api.get('/examination/mlefs').then(res => res.data),
  createMlef: (data) => api.post('/examination/mlefs', data).then(res => res.data),
  getPostMortems: () => api.get('/examination/postmortems').then(res => res.data),
  createPostMortem: (data) => api.post('/examination/postmortems', data).then(res => res.data),
  createAutopsyNotification: (data) => api.post('/examination/autopsy-notifications', data).then(res => res.data),
  getCourtCertificates: () => api.get('/examination/court-certificates').then(res => res.data),
  createCourtCertificate: (data) => api.post('/examination/court-certificates', data).then(res => res.data),
};

export const forensicService = {
  getSpecimens: () => api.get('/forensic/specimens').then(res => res.data),
  createSpecimen: (data) => api.post('/forensic/specimens', data).then(res => res.data),
  getInjuries: () => api.get('/forensic/injuries').then(res => res.data),
  createInjury: (data) => api.post('/forensic/injuries', data).then(res => res.data),
};

export const institutionService = {
  getHospitals: () => api.get('/institutions/hospitals').then(res => res.data),
  getPoliceStations: () => api.get('/institutions/police-stations').then(res => res.data),
  getCourts: () => api.get('/institutions/courts').then(res => res.data),
};

export const systemService = {
  getRoles: () => api.get('/system/roles').then(res => res.data),
  getAuditLog: () => api.get('/system/audit-log').then(res => res.data),
  getDashboardStats: () => api.get('/system/dashboard/stats').then(res => res.data),
};

export const authService = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res.data);
  },
  testToken: () => api.post('/auth/test-token').then(res => res.data)
};
