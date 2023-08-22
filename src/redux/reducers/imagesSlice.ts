import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { imagesType } from "~/types";

const initialState: imagesType[] = [];

const imagesSlice = createSlice({
  initialState,
  name: 'imagesSlice',
  reducers: {
    setInitialImages: (state, action: PayloadAction<imagesType[]>) => action.payload,

    addImage: (state, action: PayloadAction<imagesType>) => {
      if(state.indexOf(action.payload) === -1) return state.concat(action.payload)
    },

    deleteImage: (state, action: PayloadAction<string>) => {
      const updatedItems = state.filter(i => i.id !== action.payload);
      return updatedItems;
    }
  }
});

export const { addImage, deleteImage, setInitialImages } = imagesSlice.actions;
export default imagesSlice.reducer;