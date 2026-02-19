import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Employee APIs ---

export const getEmployees = () => api.get('/employees/');

export const getEmployee = (employeeId) => api.get(`/employees/${employeeId}`);

export const createEmployee = (data) => api.post('/employees/', data);

export const deleteEmployee = (employeeId) => api.delete(`/employees/${employeeId}`);

// --- Attendance APIs ---

export const markAttendance = (data) => api.post('/attendance/', data);

export const getEmployeeAttendance = (employeeId, filterDate) => {
    const params = filterDate ? { date: filterDate } : {};
    return api.get(`/attendance/employee/${employeeId}`, { params });
};

export const getAllAttendance = (filterDate) => {
    const params = filterDate ? { date: filterDate } : {};
    return api.get('/attendance/', { params });
};

export const getPresentCount = (employeeId) =>
    api.get(`/attendance/present-count/${employeeId}`);

// --- Dashboard ---

export const getDashboardStats = () => api.get('/dashboard');

export default api;
