import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = 'http://localhost:8080';

const handleRequest = async (
  method,
  url,
  isAuthenticated = false,
  data = null,
  options = {}
) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (isAuthenticated) {
    const userToken = JSON.parse(localStorage.getItem('user'))?.token;
    if (userToken) {
      headers.Authorization = `Bearer ${userToken}`;
    }
  }

  try {
    const response = await axios({
      method,
      url: baseURL + url,
      data,
      headers,
      ...options,
    });

    if (response && response.status >= 200 && response.status < 300) {
      if (response.data.message) {
        toast.success(response.data.message);
      }
      return response.data;
    }
    throw new Error('Request failed with status: ' + response.status);
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('Request canceled');
    }

    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error(error.response.data.error || error.response.data.message);
      }
      throw error.response.data.error || error.response.data.message;
    } else if (error.request) {
      toast.error('No response received from server');
      throw { error: 'No response received from server', status: null };
    } else {
      toast.error(error.message);
      throw { error: error.message, status: null };
    }
  }
};

const getCall = async (url, isAuthenticated = false, options = {}) => {
  return handleRequest('GET', url, isAuthenticated, null, options);
};

const postCall = async (url, data, isAuthenticated = false, options = {}) => {
  return handleRequest('POST', url, isAuthenticated, data, options);
};

const putCall = async (url, data, isAuthenticated = false, options = {}) => {
  return handleRequest('PUT', url, isAuthenticated, data, options);
};

const delCall = async (url, isAuthenticated = false, options = {}) => {
  return handleRequest('DELETE', url, isAuthenticated, null, options);
};

export { getCall, postCall, putCall, delCall };
