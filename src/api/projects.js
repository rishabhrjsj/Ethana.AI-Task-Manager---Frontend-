import api from './axios';

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  getMembers: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
  getAllUsers: () => api.get('/projects/users/all'),
};
