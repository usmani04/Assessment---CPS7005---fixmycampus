const API_URL = 'http://localhost:5000/api';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthHeader = () => {
  const token = getToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: getAuthHeader(),
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      if (response.status === 401) {
        setToken(null);
        window.location.href = '/';
      }
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const register = (data) => apiCall('/auth/register','POST', data);
export const login = (data) => apiCall('/auth/login', 'POST', data);
export const getProfile = () => apiCall('/auth/profile');

export const createReport = (data) => apiCall('/reports', 'POST', data);
export const getReports = (params) => {
  const query = new URLSearchParams(params).toString();
  return apiCall(`/reports${query ? '?' + query : ''}`);
};
export const getMyReports = () => apiCall('/reports/my-reports');
export const getReportById = (id) => apiCall(`/reports/${id}`);
export const updateReport = (id, data) => apiCall(`/reports/${id}`, 'PUT', data);
