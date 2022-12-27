// import HeaderAdmin from '../components/Header';
import React from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import auth from '../../../routes/auth';
import '../../pages/admin.css';
import { privateRoutes } from '../../../routes/index';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actLogin } from '../../../redux/actions/adminAccount';
import axios from 'axios';
import { url } from '../../../api/url';
import { urnLogin, urnRefreshToken } from '../../../api/urn';

function AdminLogin() {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(false); //có thể sd ueSelector
    const [account, setAccount] = useState({});

    if (!JSON.parse(sessionStorage.getItem('isLogin'))) {
        sessionStorage.setItem('isLogin', false);
    }

    const handleLogin = () => {
        const action = actLogin(true);
        dispatch(action);
        sessionStorage.setItem('isLogin', true);
        auth.login(() => {
            setIsLogin(true);
        });
    };

    const onFinish = async (values) => {
        console.log(values);
        //login
        await axios.post(url + urnLogin, values).then((res) => {
            if (res.data.result) {
                console.log('login');
                sessionStorage.setItem('accessToken', res.data.accessToken);

                setAccount(res.data.account);
                handleLogin();

                // axios.request({
                //     method: 'POST',
                //     url: url + urnRefreshToken,
                //     headers: {
                //         'X-Authorization': sessionStorage.getItem('accessToken'),
                //     },
                //     data: res.data.refreshToken,
                // });
                // console.log('refresh');
            } else {
                notification.error({ message: `Mật khẩu không đúng!`, duration: 3 });
            }
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
