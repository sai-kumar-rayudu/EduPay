import axios from 'axios';

// Force local development URL for debugging
const baseURL = 'http://localhost:5001/api';

console.log('API Base URL (Forced):', baseURL);

const api = axios.create({
    baseURL,
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const token = JSON.parse(userInfo).token;
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Skip auto-logout for login endpoint failures
        if (error.config && error.config.url && error.config.url.endsWith('/auth/login')) {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401) {
            // Token expired or invalid user -> Auto logout
            // Avoid executing this if we are already on the login page to prevent loops/reloads
            if (window.location.pathname !== '/login') {
                console.warn('Session expired or unauthorized. Logging out...');
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
