// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import placesReducer from "./placesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placesReducer
  }
});
