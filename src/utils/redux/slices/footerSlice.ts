import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FooterItem = {
  key: string;
  value: string;
};

const initialState: {
  footerData: FooterItem[];
} = {
  footerData: [],
};

export const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    setFooterData: (state, action: PayloadAction<FooterItem[]>) => {
      state.footerData = action.payload;
    },
  },
});

export const { setFooterData } = footerSlice.actions;
export default footerSlice.reducer;
