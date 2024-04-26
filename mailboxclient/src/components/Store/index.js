
import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "./auth";
//import ExpenseReducer from'./expense';

const store = configureStore({
  reducer: { auth: AuthReducer },
});

export default store;
