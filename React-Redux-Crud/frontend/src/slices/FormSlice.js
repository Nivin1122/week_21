import { createSlice } from '@reduxjs/toolkit';
        

const formSlice = createSlice({
  name: 'form',
  initialState: {
    username: '',
    password: '',
    image: null, 
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setImage: (state, action) => { 
      state.image = action.payload;
    },
    resetForm: (state) => {
      state.username = '';
      state.password = '';
      state.image = null; 
    },
  },
});

export const { setUsername, setPassword, setImage, resetForm } = formSlice.actions; 
export default formSlice.reducer;
