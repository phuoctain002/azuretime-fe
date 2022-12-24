import { AD_LOGIN, AD_LOGOUT } from '../actionTypes/index';

export const actLogin = (isLogin) => {
    return {
        type: AD_LOGIN,
        payload: isLogin,
    };
};

export const actLogout = () => {
    return {
        type: AD_LOGOUT,
    };
};
