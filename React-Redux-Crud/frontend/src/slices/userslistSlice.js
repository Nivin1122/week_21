import { createSlice } from "@reduxjs/toolkit";

const userslistSlice = createSlice({
    name: 'userslist',
    initialState:{
        users: [],
        filteredUsers: [],
        searchTerm: '',
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        setFilteredUsers: (state, action) => {
            state.filteredUsers = action.payload
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        }
    }
})

export const {setUsers, setFilteredUsers, setSearchTerm} = userslistSlice.actions;

export default userslistSlice.reducer;