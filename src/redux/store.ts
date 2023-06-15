import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cardReducer from "./reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
};
const RootReducer = combineReducers({
  cardReducer,
});

const persistedReducer = persistReducer(persistConfig, RootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
