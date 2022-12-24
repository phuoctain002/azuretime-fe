import { AD_LOGIN, AD_LOGOUT } from '../actionTypes/index';

const initialState = {
    isLogin: sessionStorage.getItem('isLogin') ? sessionStorage.getItem('isLogin') : false,
};

const adminAccountReducer = (state = initialState, action) => {
    switch (action.type) {
        case AD_LOGIN: {
            let adminAccount = {
                isLogin: action.payload,
            };
            sessionStorage.setItem('isLogin', true);
            return adminAccount;
        }
        case AD_LOGOUT: {
            let adminAccount = {
                isLogin: false,
            };
            sessionStorage.setItem('isLogin', false);
            return adminAccount;
        }
        default: {
            return state;
        }
    }
};

export default adminAccountReducer;
