// frontend/src/services/auth.service.js

import api from "./api";

const register = (username, email, password) => {
    return api.post("/auth/register", { username, email, password });
};

const login = (username, password) => {
    const loginData = { username, password, email: "user@example.com" }; // email нужен для валидации схемы Pydantic
    return api.post("/auth/login", loginData)
        .then(response => {
            if (response.data.access_token) {
                localStorage.setItem("accessToken", response.data.access_token);
                localStorage.setItem("refreshToken", response.data.refresh_token);
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const getCurrentUser = () => {
    return localStorage.getItem('accessToken');
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;