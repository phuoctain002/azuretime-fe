// import HeaderAdmin from '../components/Header';

import SidebarAdmin from '../components/Sidebar';
// import ProductTypes from '../components/Content/ProductTypes';

import { Col, Row } from 'antd';
import React from 'react';
import './admin.css';
import Products from '../components/Content/Products';

function Admin() {
    return (
        <div className='app-admin'>
            {/* <HeaderAdmin /> */}
            <Row>
                <Col span={4}>
                    <SidebarAdmin />
                </Col>
                <Col span={18}>
                    {/* <ProductTypes /> */}
                    <Products />
                </Col>
            </Row>
        </div>
    );
}

export default Admin;
