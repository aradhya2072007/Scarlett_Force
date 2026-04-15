import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('es_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Users
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const submitPersonality = (answers) => API.post('/users/personality', { answers });
export const toggleSaveEvent = (eventId) => API.post(`/users/save-event/${eventId}`);

// Events
export const getEvents = (params) => API.get('/events', { params });
export const getEvent = (id) => API.get(`/events/${id}`);

// Recommendations
export const getRecommendations = () => API.get('/recommendations');

// Registrations
export const rsvpEvent = (eventId) => API.post(`/registrations/${eventId}`);
export const cancelRSVP = (eventId) => API.delete(`/registrations/${eventId}`);
export const getMyRegistrations = () => API.get('/registrations/my');
export const checkRegistration = (eventId) => API.get(`/registrations/check/${eventId}`);

export default API;
