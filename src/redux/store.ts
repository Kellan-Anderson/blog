import { configureStore } from '@reduxjs/toolkit';
import categoriesSlice from './reducers/categoriesSlice';

export const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;