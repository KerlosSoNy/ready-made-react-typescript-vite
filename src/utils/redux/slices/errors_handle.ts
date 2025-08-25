import { createSlice } from "@reduxjs/toolkit";

export const errorHandleSlice = createSlice({
    name: 'errorHandle',
    initialState:{
        errorHandle:  "",
        link:"",
        page:"",
        blockedTill:"",
    },
    reducers: {
        setErrorHandle: (state, action) => {
            state.errorHandle = action.payload?.message;
            state.link = action.payload?.link;
            state.page = action.payload?.page
        },
    },
})

export const { setErrorHandle } = errorHandleSlice.actions;
export default errorHandleSlice.reducer;