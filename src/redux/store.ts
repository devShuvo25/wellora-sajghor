// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { configureStore } from "@reduxjs/toolkit";
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   persistStore,
//   PURGE,
//   REGISTER,
//   REHYDRATE,
// } from "redux-persist";
// import { baseApi } from "./api/baseApi";
// import rootReducer from "./features/rootReducer";
// import persistReducer from "redux-persist/es/persistReducer";
// import storage from "redux-persist/lib/storage";

// const noopStorage = {
//   getItem: (_key: string) => Promise.resolve(null),
//   setItem: (_key: string, _value: string) => Promise.resolve(),
//   removeItem: (_key: string) => Promise.resolve(),
// };

// export default noopStorage;

// const persistConfig = {
//   key: "root",
//   storage:
//     typeof window !== "undefined" && window.localStorage
//       ? storage
//       : noopStorage,
//   whitelist: ["auth", "theme"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,

//   middleware: (getDefaultMiddlewares) =>
//     getDefaultMiddlewares({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(baseApi.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export const persistor = persistStore(store);
/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { baseApi } from "./api/baseApi";
import rootReducer from "./features/rootReducer";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { ChatActionTypes } from "../interface/socket"; // সকেট অ্যাকশন টাইপস ইমপোর্ট
import { socketMiddleware } from "@/middleware/socket.middleware";

const noopStorage = {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
};

const persistConfig = {
  key: "root",
  storage:
    typeof window !== "undefined" && window.localStorage
      ? storage
      : noopStorage,
  whitelist: ["auth", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          ChatActionTypes.CONNECT,
          ChatActionTypes.SEND_MESSAGE,
          ChatActionTypes.START_TYPING,
        ],
      },
    }).concat(baseApi.middleware, socketMiddleware), // এখানে socketMiddleware যোগ করা হয়েছে
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
