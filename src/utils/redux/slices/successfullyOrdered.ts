import { createSlice } from "@reduxjs/toolkit";

const initialState:any = {data : {}}

export const successfullyOrderedSlice = createSlice({
    name: 'successfullyOrdered',
    initialState,
    reducers: {
        setOrderedData : (state, action) => {state.data = action.payload},
    },
})

export const {setOrderedData} = successfullyOrderedSlice.actions
export default successfullyOrderedSlice.reducer