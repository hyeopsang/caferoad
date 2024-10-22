// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import placesReducer from './placesSlice';
import reviewsReducer from './reviewsSlice';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage 사용

const persistConfig = {
  key: 'root',
  storage: sessionStorage, // sessionStorage에 상태 저장
};

const rootReducer = combineReducers({
  auth: authReducer,
  places: placesReducer,
  reviews: reviewsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 직렬화 가능한 값 체크 비활성화
    }),
});

export const persistor = persistStore(store);
