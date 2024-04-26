
import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const initialUuid = localStorage.getItem("uuid");

const initialAuthState = {
  isAuthenticated: initialToken ? true : false,
  token: initialToken || null,
  useruuid: initialUuid || null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.useruuid = action.payload.useruuid;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("uuid", action.payload.useruuid);
      //alert("You are logged in");
      console.log("useremail is:", state.useruuid);
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");
      state.token = null;
      state.useruuid = null;
      //alert("You are logged out");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
