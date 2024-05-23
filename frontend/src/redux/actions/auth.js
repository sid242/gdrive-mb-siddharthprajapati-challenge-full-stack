import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/axios";
import { clearLocalStorage } from "../../utils";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await API.post(`api/v1/auth/google/login`, {
        googleAccessToken: accessToken,
      });
      return response?.data;
    } catch (error) {
      // return custom error message from backend if present
      if (error?.response?.data?.errors?.errors?.status === 401) {
        return rejectWithValue(error?.response?.data?.errors?.errors?.status);
      }
      if (error?.response && error?.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error?.message);
      }
    }
  }
);
