import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user'                                                        ,
    initialState: {
        isAuthorized: null,
    },
    reducers:{
        setIsAuthorized: (state, action) => {
            state.isAuthorized = action.payload
        },
        resetUser: (state) => {
            state.isAuthorized = null
        },
    }
})

export const {setIsAuthorized, resetUser} = userSlice.actions;
export default userSlice.reducer;