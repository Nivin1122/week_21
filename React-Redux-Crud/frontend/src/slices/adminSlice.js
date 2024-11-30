import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSuperuser: localStorage.getItem('isSuperuser') === 'true', 
    isActive: localStorage.getItem('isActive') === 'true',
};

const adminSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { isSuperuser, isActive } = action.payload;
            state.isSuperuser = isSuperuser;
            state.isActive = isActive;
            localStorage.setItem('isSuperuser', isSuperuser);
            localStorage.setItem('isActive', isActive);
        },
        resetAdmin: (state) => {
            state.isSuperuser = false;
            state.isActive = false;
            localStorage.removeItem('isSuperuser');
            localStorage.removeItem('isActive');
        },
    },
});

export const { setUser, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
