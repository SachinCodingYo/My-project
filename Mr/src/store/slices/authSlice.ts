import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../../common/types/types";

interface AuthState {
  profile: UserProfile | null;
}

const initialState: AuthState = {
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, clearProfile } = authSlice.actions;
export default authSlice.reducer;
