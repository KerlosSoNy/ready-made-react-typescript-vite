import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import toast from './slices/toast';
import tokenSlice from './slices/tokenSlice';
import addressDialogSlice from './slices/addressDialog'
import userSlice from './slices/userSlice'
import cartSlice from './slices/cart'
import successfullyOrderedSlice from "./slices/successfullyOrdered";
import footerSlice from "./slices/footerSlice";


export const store = configureStore({
    reducer: {
        toast: toast,
        addressDialogSlice:addressDialogSlice,
        tokenSlice:tokenSlice,
        userSlice:userSlice,
        cart:cartSlice,
        successfullyOrderedSlice:successfullyOrderedSlice,
        footerSlice:footerSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;