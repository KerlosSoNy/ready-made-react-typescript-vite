import { createSlice } from "@reduxjs/toolkit";


export const addressDialogSlice = createSlice({
    name: 'addressDialog',
    initialState:{
        isOpen : false,
        isLogOut: false,
        deleteAccount: false,
        address: {},
    },
    reducers: {
        setAddressDialog: (state, action) => {
            state.isOpen = action.payload;
        },
        setIsLogOut: (state, action) => {
            state.isLogOut = action.payload;
        },
        setDeleteAccount: (state, action) => {
            state.deleteAccount = action.payload;
        },
        setAddress : (state, action) => {
            state.address = action.payload;
        },
    },
});

export const { setAddressDialog,setIsLogOut ,setDeleteAccount,setAddress} = addressDialogSlice.actions;
export default addressDialogSlice.reducer;