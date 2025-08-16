import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';

import "primereact/resources/themes/saga-blue/theme.css";  // Тема
import "primereact/resources/primereact.min.css";         // Ядро
import "primeicons/primeicons.css";                       // Иконки

        

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);