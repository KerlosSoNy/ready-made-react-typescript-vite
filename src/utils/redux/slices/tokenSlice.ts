import { createSlice } from "@reduxjs/toolkit";
import { getDecryptedToken } from "../../functions/bufferedEncryptedToken";

// Make this async to handle the decryption
const getToken = async () => {
  try {
    const decryptedToken = await getDecryptedToken();
    return decryptedToken || null;
  } catch (error) {
    console.error("Failed to get decrypted token:", error);
    return null;
  }
};

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    token: null, // Start with null, will be populated after decryption
    isLoading: true, // Add loading state
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoading = false;
    },
    setTokenLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.isLoading = false;
    },
  },
});

export const { setToken, setTokenLoading,clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;

// Add a thunk to initialize the token
export const initializeToken = () => async (dispatch: any) => {
  dispatch(setTokenLoading(true));
  try {
    const token = await getToken();
    dispatch(setToken(token));
  } catch (error) {
    console.error("Failed to initialize token:", error);
    dispatch(setToken(null));
  }
};