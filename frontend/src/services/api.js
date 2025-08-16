import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/login" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    // Вам нужно будет реализовать этот endpoint на бэкенде
                    const rs = await api.post("/auth/refresh", { refresh_token: refreshToken });
                    
                    const { access_token } = rs.data;
                    localStorage.setItem("accessToken", access_token);
                    return api(originalConfig);
                } catch (_error) {
                    // При ошибке рефреша - разлогиниваем
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location = '/login';
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

export default api;