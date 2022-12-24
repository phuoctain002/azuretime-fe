import './App.css';
import './base.css';
import React from 'react';
import { Col, Row } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes, loginRoute } from './routes';
import Sidebar from './user/components/Sidebar';
import Header from './user/components/Header';

import SidebarAdmin from './admin/components/Sidebar';
import auth from './routes/auth';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
function App() {
    // redux
    const isLogin = useSelector((state) => state.adminAccountReducer.isLogin);

    const LoginPage = loginRoute.component;
    return (
        <Router>
            <div className="App">
                <Routes>
                    {privateRoutes.map((route, index) => {
                        console.log('appjs', isLogin);
                        const Page = route.component;
                        return (
                            <Route
                                exact
                                key={index}
                                path={route.path}
                                element={
                                    isLogin ? (
                                        <div className="app-admin">
                                            {/* <HeaderAdmin /> */}
                                            <Row>
                                                <Col span={4}>
                                                    <SidebarAdmin  className="sidebar-admin" />
                                                </Col>
                                                <Col span={20}>
                                                    {/* <ProductTypes /> */}
                                                    <Page />
                                                </Col>
                                            </Row>
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
