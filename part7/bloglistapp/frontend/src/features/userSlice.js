import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import loginService from "../services/login";

const initialState = {
  authUser: [],
  loading: false,
  isError: false,
};

export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginService.login({ username, password });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue([], err);
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.authUser = [];
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, { payload }) => {
      state.authUser = payload;
      state.loading = false;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.rejected]: (state, { payload, error }) => {
      state.loading = false;
      state.user = payload;
      state.error = error;
    },
  },
});

export const { logout } = userSlice.actions;

export const userSelector = (state) => state.user;

export default userSlice.reducer;
