import authReducer from "../features/authSlice.js";
import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi.js";
import { categoryApi } from "@/features/api/categoryApi.js";
import { tagApi } from "@/features/api/tagApi.js";
import { commentApi } from "@/features/api/commentApi.js";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [tagApi.reducerPath]: tagApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  auth: authReducer,
});

export default rootReducer;
