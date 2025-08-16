// frontend/src/pages/Login.jsx

import React, { useState, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useNavigate, Link } from "react-router-dom";
import AuthService from '../services/auth.service';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    AuthService.login(username, password).then(
        () => {
            navigate("/todos");
            // Перезагрузка страницы для обновления меню в Layout
            window.location.reload(); 
        },
        (error) => {
            const resMessage = (error.response?.data?.detail) || error.message || error.toString();
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: resMessage, life: 3000 });
            }
        );
    };

    const footer = (
        <span>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </span>
    );

    return (
        <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '80vh' }}>
            <Toast ref={toast} />
            <Card title="Вход в систему" style={{ width: '25rem' }} footer={footer}>
                <form onSubmit={handleLogin} className="p-fluid">
                    <div className="p-field p-mb-3">
                        <span className="p-float-label">
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <label htmlFor="username">Имя пользователя</label>
                        </span>
                    </div>
                    <div className="p-field p-mb-3">
                        <span className="p-float-label">
                            <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask required />
                            <label htmlFor="password">Пароль</label>
                        </span>
                    </div>
                    <Button type="submit" label="Войти" loading={loading} className="p-mt-2" />
                </form>
            </Card>
        </div>
    );
}