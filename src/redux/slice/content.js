import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cates: [],
};

const content = createSlice({
    name: 'content',
    initialState,
    reducers: {
        catesByBrand: (state, action) => {
            const cate = action.payload;

            state.cates.push(cate);
        },
    },
});

export default content.reducer;
export const { catesByBrand } = content.actions;
