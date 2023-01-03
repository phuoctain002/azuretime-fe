import { configureStore } from '@reduxjs/toolkit';
import adminAccount from '../slice/adminAccount';
import sidebar from '../slice/sidebar';

const store = configureStore({
    reducer: {
        adminAccount: adminAccount,
        sidebar: sidebar,
    },
});
export default store;
