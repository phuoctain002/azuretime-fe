import './App.css';
import './base.css';
import React from 'react';
import { Col, Row } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import Sidebar from './user/components/Sidebar';
import Header from './user/components/Header';

import SidebarAdmin from './admin/components/Sidebar';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        const isAdmin = route.path.includes('/admin');
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    !isAdmin ? (
                                        <div className="app-client">
                                            <Header />
                                            <div className="body">
                                                <Sidebar />
                                                <div className="right-content">
                                                    <Page />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="app-admin">
                                            {/* <HeaderAdmin /> */}
                                            <Row>
                                                <Col span={4}>
                                                    <SidebarAdmin className="sidebar-admin" />
                                                </Col>
                                                <Col span={20}>
                                                    {/* <ProductTypes /> */}
                                                    <Page />
                                                </Col>
                                            </Row>
                                        </div>
                                    )
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
