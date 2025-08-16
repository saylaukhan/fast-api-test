// frontend/src/app/App.jsx

import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useState, useEffect } from 'react';

// Импорт страниц и компонентов
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Todos from "../pages/Todos";
import PrivateRoute from "../components/PrivateRoute";
import AuthService from '../services/auth.service';


function Layout({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate('/login');
    }

    const items = [
        { label: 'Home', icon: 'pi pi-fw pi-home', command: () => { navigate('/'); } },
        { label: 'Todos', icon: 'pi pi-fw pi-list', command: () => { navigate('/todos'); } }
    ];

    const end = currentUser ? (
        <Button label="Выйти" icon="pi pi-fw pi-power-off" onClick={handleLogout} />
    ) : (
        <>
            <Button label="Войти" icon="pi pi-fw pi-sign-in" className="p-button-text" onClick={() => navigate('/login')} />
            <Button label="Регистрация" icon="pi pi-fw pi-user-plus" className="p-button-text" onClick={() => navigate('/register')} />
        </>
    );

    return (
        <div>
            <Menubar model={items} end={end} />
            <main className="p-m-2">
                <Card>
                    {children}
                </Card>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    {/* Использование вложенных маршрутов внутри Layout */}
                    <Route path="/*" element={
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/todos" element={<PrivateRoute><Todos /></PrivateRoute>} />
                            </Routes>
                        </Layout>
                    } />
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    );
}