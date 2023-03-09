import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mainMenu: {
        index: 0,
        idMenu: 0,
        nameMenu: 'WRIST WATCHES',
    },
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
        clickMainMenu: (state, action) => {
            state.mainMenu = action.payload;
            state.brand = {
                index: -1,
                idBrand: -1,
                nameBrand: '',
            };
            state.cate = {
                index: -1,
                idCate: -1,
                nameCate: '',
            };
            state.idGender = -1;
        },
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
export const { clickBrand, clickCate, clickMainMenu } = sidebar.actions;
