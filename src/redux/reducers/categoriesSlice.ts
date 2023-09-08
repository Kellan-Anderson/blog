import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { categoryType } from "~/types";

const initialState: categoryType[] = [];

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setAllCategories: (state, action: PayloadAction<categoryType[]>) => {
      return action.payload
    },
    addCategory: (state, action: PayloadAction<categoryType>) => {
      if(!state.find(cat => cat.name === action.payload.name)) return state.concat(action.payload);
    },
    changeCategory: (state, action: PayloadAction<string>) => {
      return state.map(cat => {
        if(cat.name === action.payload) {
          return {...cat, checked: !cat.checked}
        } else {
          return cat
        }
      })
    }
  }
});

export const { setAllCategories, addCategory, changeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;