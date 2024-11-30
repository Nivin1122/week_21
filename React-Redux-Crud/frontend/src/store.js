import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/FormSlice';
import adminDataReducer from './slices/adminSlice';
import userReducer from './slices/userSlice'
import userprofileReducer from './slices/userprofileSlice'
import userslistReducer from './slices/userslistSlice'

const store = configureStore({
  reducer: {
    form: formReducer,
    admin: adminDataReducer,
    user: userReducer,
    userprofile: userprofileReducer,
    userslist: userslistReducer,
  },
});

export default store;
