import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import AuthService from '../services/auth.service';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);

        AuthService.register(username, email, password).then(
            (response) => {
                toast.current.show({ severity: 'success', summary: 'Успех', detail: "Регистрация прошла успешно! Теперь вы можете войти.", life: 4000 });
                // Перенаправляем на страницу входа
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.detail) || error.message || error.toString();
                setLoading(false);
                toast.current.show({ severity: 'error', summary: 'Ошибка', detail: resMessage, life: 3000 });
            }
        );
    };

    const footer = (
        <span>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
        </span>
    );

    return (
        // Этот div центрирует карточку по вертикали и горизонтали
        <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '80vh' }}>
            <Toast ref={toast} />
            <Card title="Регистрация" style={{ width: '25rem' }} footer={footer}>
                <form onSubmit={handleRegister} className="p-fluid">
                    <div className="p-field p-mb-3">
                        <span className="p-float-label">
                            <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <label htmlFor="username">Имя пользователя</label>
                        </span>
                    </div>
                    <div className="p-field p-mb-3">
                        <span className="p-float-label">
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label htmlFor="email">Email</label>
                        </span>
                    </div>
                    <div className="p-field p-mb-3">
                        <span className="p-float-label">
                            <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} required />
                            <label htmlFor="password">Пароль</label>
                        </span>
                    </div>
                    <Button type="submit" label="Зарегистрироваться" loading={loading} className="p-mt-2" />
                </form>
            </Card>
        </div>
    );
}