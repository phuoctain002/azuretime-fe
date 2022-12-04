import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18nConfig';

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback="loading">
        <App />
    </Suspense>,
    React.createElement(React.StrictMode, null, React.createElement(App, null)),
);
