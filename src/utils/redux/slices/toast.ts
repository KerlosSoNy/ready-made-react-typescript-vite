import { createSlice } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ToastType = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

type ToastState = {
  queue: ToastType[];
  currentToast: ToastType | null;
  isShowing: boolean;
};

const initialState: ToastState = {
  queue: [],
  currentToast: null,
  isShowing: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    enqueueToast(state, action: PayloadAction<Omit<ToastType, 'id'>>) {
      const { message, type } = action.payload;
      const id = Date.now() + Math.random();
      state.queue.push({ id, message, type });
    },
    showNextToast(state) {
      if (state.queue.length > 0) {
        state.currentToast = state.queue.shift() as ToastType;
        state.isShowing = true;
      } else {
        state.currentToast = null;
        state.isShowing = false;
      }
    },
    clearCurrentToast(state) {
      state.currentToast = null;
      state.isShowing = false;
    },
  },
});

export const { enqueueToast, showNextToast, clearCurrentToast } = toastSlice.actions;

export const showToast = (message: string, type: ToastType['type']) => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(enqueueToast({ message, type }));
  const { isShowing } = getState().toast;
  if (!isShowing) {
    dispatch(displayNextToast());
  }
};

export const displayNextToast = () => (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(showNextToast());
  const { currentToast } = getState().toast;
  if (currentToast) {
    setTimeout(() => {
      dispatch(clearCurrentToast());
      dispatch(displayNextToast());
    }, 4000);
  }
};

export const removeToast = () => (dispatch: AppDispatch) => {
  dispatch(clearCurrentToast());
  dispatch(displayNextToast());
};

export default toastSlice.reducer;