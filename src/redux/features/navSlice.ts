import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  activeLinkName: string;
}

const initialState: NavState = {
  activeLinkName: "Home", // Default state
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setActiveLink: (state, action: PayloadAction<string>) => {
      state.activeLinkName = action.payload;
    },
  },
});

export const { setActiveLink } = navSlice.actions;
export default navSlice.reducer;