import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "@/redux/features/authSlice";
import themeReducer from "@/redux/features/themeSlice";
import chatReducer from "@/redux/features/chatSlice"
import notificatinReducer from '@/redux/features/notification.slice'

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  theme: themeReducer,
  chat : chatReducer,
  notification : notificatinReducer
});

export default rootReducer;
