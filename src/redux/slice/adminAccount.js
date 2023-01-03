import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: sessionStorage.getItem('adminAccount')
        ? JSON.parse(sessionStorage.getItem('adminAccount'))?.username
        : '',
    role: sessionStorage.getItem('adminAccount') ? JSON.parse(sessionStorage.getItem('adminAccount'))?.role : '',
    isLogin: sessionStorage.getItem('adminAccount')
        ? Boolean(JSON.parse(sessionStorage.getItem('adminAccount'))?.isLogin)
        : false,
};

const adminAccount = createSlice({
    name: 'adminAccount',
    initialState,
    reducers: {
        ad_login: (state, action) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isLogin = action.payload.isLogin;
            sessionStorage.setItem('adminAccount', JSON.stringify(state));
        },
        ad_logout: (state, action) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.isLogin = action.payload.isLogin;
            sessionStorage.removeItem('adminAccount');
        },
    },
});

export default adminAccount.reducer;
export const { ad_login, ad_logout } = adminAccount.actions;
