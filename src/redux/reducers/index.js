import { combineReducers } from 'redux';
import adminAccountReducer from './adminAccount';

const allReducers = combineReducers({
    adminAccountReducer,
});

export default allReducers;
