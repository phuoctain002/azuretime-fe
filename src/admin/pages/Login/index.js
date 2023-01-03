// import HeaderAdmin from '../components/Header';
import React, { useEffect } from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import '../../pages/admin.css';
import { privateRoutes } from '../../../routes/index';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnLogin, urnRefreshToken } from '../../../api/urn';
import { ad_login } from '../../../redux/slice/adminAccount';

function AdminLogin() {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.adminAccount.isLogin); //có thể sd ueSelector
    const [account, setAccount] = useState({});

    // if (!JSON.parse(sessionStorage.getItem('isLogin'))) {
    //     sessionStorage.setItem('isLogin', false);
    // }

    const handleLogin = (username, role) => {
        dispatch(ad_login({ username, role, isLogin: true }));
        sessionStorage.setItem('isLogin', true);
    };

    const onFinish = async (values) => {
        console.log(values);
        //login
        await axios
            .post(url + urnLogin, values)
            .then((res) => {
                if (res.data.result) {
                    sessionStorage.setItem('accessToken', res.data.accessToken);
                    setAccount(res.data.account);
                    handleLogin(values.username, 'Administrator', true);
                } else {
                    notification.error({ message: `Mật khẩu không đúng!`, duration: 3 });
                }
            })
            .catch((error) => {
                notification.error({ message: error.response.data, duration: 3 });
            });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    if (!isLogin) {
        return (
            <>
                <div className="wrap-content-login">
                    <div className="login-box">
                        <div className="login-heading">
                            <h2>Đăng nhập</h2>
                        </div>
                        <div className="login-form">
                            <Form
                                className="login-form-input"
                                name="basic"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                {/* 
                                <Form.Item
                                    name="remember"
                                    valuePropName="checked"
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item> */}

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit" className="login-btn">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Navigate to={privateRoutes[0].path} state={account} />
            </>
        );
    }
}

export default AdminLogin;
