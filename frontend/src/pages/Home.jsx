import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="p-d-flex p-jc-center p-mt-6">
            <Card title="Добро пожаловать!" style={{ width: '25rem', textAlign: 'center' }}>
                <p className="p-m-0">Это стартовая страница нашего приложения. Вы можете войти или зарегистрироваться.</p>
                <div className="p-d-flex p-jc-center p-mt-4">
                    <Button label="Войти" icon="pi pi-sign-in" className="p-mr-2" onClick={() => navigate('/login')} />
                    <Button label="Регистрация" icon="pi pi-user-plus" className="p-button-secondary" onClick={() => navigate('/register')} />
                </div>
            </Card>
        </div>
    );
}