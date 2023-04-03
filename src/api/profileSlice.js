import { createSlice } from "@reduxjs/toolkit";

const localData = localStorage.getItem("user");
const initialState = {
  user: localData ? localData.data.user : null,
  token: localData ? localData.data.token : null,
};

const profileSlice = createSlice({
  name: "profileSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: {},
});

export default profileSlice.reducer;
