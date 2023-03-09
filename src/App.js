import './App.css';
import './base.css';
import React from 'react';
import { Col, Row } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes, loginRoute } from './routes';
import Sidebar from './user/components/Sidebar';
import Header from './user/components/Header';

import SidebarAdmin from './admin/components/Sidebar';

import { useSelector } from 'react-redux';
function App() {
    const isLogin = useSelector((state) => state.adminAccount.isLogin);
    const LoginPage = loginRoute.component;
    console.log(
        'isLogin-App',
        isLogin,
        useSelector((state) => state.adminAccount.isLogin),
    );
    return (
        <Router>
            <div className="App">
                <Routes>
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                exact
                                key={index}
                                path={route.path}
                                element={
                                    isLogin ? (
                                        <div className="app-admin">
                                            {/* <Sidebar Admin /> */}
                                            <SidebarAdmin className="sidebar-admin" />
                                            <Page />
                                        </div>
                                    ) : (
                                        <Navigate to={loginRoute.path} />
                                    )
                                }
                            />
                        );
                    })}
                    {<Route exact path={loginRoute.path} element={<LoginPage />} />}
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        return (
                            <Route
                                exact
                                key={index}
                                path={route.path}
                                element={
                                    <div className="app-client">
                                        <Header />
                                        <div className="body">
                                            <Sidebar />
                                            <div className="right-content">
                                                <Page />
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
