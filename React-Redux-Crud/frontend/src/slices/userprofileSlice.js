import { createSlice } from "@reduxjs/toolkit";


const userprofileSlice = createSlice({
    name: 'userprofile',
    initialState: {
        userData : {
        username: '',
        profileImage: null,
        },
        newProfileImage: null,
    },
    reducers:{
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setNewProfileImage: (state,action) => {
            state.newProfileImage = action.payload
        },
        resetuserprofile: (state) => {
            state.userData.username = '',
            state.userData.profileImage = null,
            state.newProfileImage = null 
        } 
    }
})

export const {setUserData, setNewProfileImage, resetuserprofile} = userprofileSlice.actions;
export default userprofileSlice.reducer;