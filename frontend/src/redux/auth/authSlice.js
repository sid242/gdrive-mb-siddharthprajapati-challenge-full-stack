import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../actions/auth";
import { clearLocalStorage, setLocalStorage } from "../../utils";

const initialState = {
  loading: false,
  userInfo: null, // for user object
  accessToken: null, // for storing the JWT
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearLocalStorage(); // deletes token from storage
      state.loading = false;
      state.userInfo = null;
      state.accessToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        setLocalStorage("accessToken", payload?.data?.accessToken);
        state.loading = false;
        state.userInfo = payload?.data?.user;
        state.accessToken = payload?.data?.accessToken;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        if (payload === 401) {
          clearLocalStorage(); // deletes token from storage
          state.userInfo = null;
          state.accessToken = null;
          state.error = "unauthorized user";
        } else {
          state.error = payload;
        }
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
