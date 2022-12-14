import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    brand: {
        index: -1,
        idBrand: -1,
        nameBrand: '',
    },
    cate: {
        index: -1,
        idCate: -1,
        nameCate: '',
    },
    idGender: -1,
};

const sidebar = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        clickBrand: (state, action) => {
            state.brand = action.payload;
            state.cate = {
                index: -1,
                idCate: -1,
                nameCate: '',
            };
            state.idGender = -1;
        },
        clickCate: (state, action) => {
            state.cate = action.payload;
            state.idGender = 0;
        },
    },
});

export default sidebar.reducer;
export const { clickBrand, clickCate } = sidebar.actions;
