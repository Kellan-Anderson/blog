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
      if(!state.find(cat => cat.name === action.payload.name)) state.push(action.payload);
    },
    changeCategory: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(cat => cat.name === action.payload);
      if(index !== -1) state[index].checked = !state[index].checked;
      else console.log('This code should not be running');
    }
  }
});

export const { setAllCategories, addCategory, changeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;