import { configureStore } from '@reduxjs/toolkit';

import categoriesSlice from './reducers/categoriesSlice';
import editorSlice from './reducers/editorSlice';
import tagsSlice from './reducers/tagsSlice';
import imagesSlice from './reducers/imagesSlice';

export const store = configureStore({
  reducer: {
    categoriesReducer: categoriesSlice,
    editorReducer: editorSlice,
    tagsReducer: tagsSlice,
    imagesReducer: imagesSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;