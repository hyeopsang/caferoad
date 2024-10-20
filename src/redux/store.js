// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import placesReducer from "./placesSlice";
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer, PURGE } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import session from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage: session,
};
const rootReducer = combineReducers({
    auth: authReducer,
    places: placesReducer,
});



const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
    
});
export const persistor = persistStore(store)
