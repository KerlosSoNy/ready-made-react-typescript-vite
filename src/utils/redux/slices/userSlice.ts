import { createSlice } from "@reduxjs/toolkit";

const getUser = () => {
    const user = localStorage.getItem("user");
    if(user !== 'undefined' && user !== null){
        JSON.parse(user) 
    }
}

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        user: getUser(),
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", action.payload);
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
