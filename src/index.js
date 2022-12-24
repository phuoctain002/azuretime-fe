import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18nConfig';

//  Redux
import { Provider } from 'react-redux';
import store from './redux/store/index';

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Suspense fallback="loading">
            <App />
        </Suspense>
    </Provider>,
    React.createElement(React.StrictMode, null, React.createElement(App, null)),
);
