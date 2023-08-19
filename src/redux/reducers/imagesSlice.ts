import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { imagesType } from "~/types";

const initialState: imagesType[] = [];

const imagesSlice = createSlice({
  initialState,
  name: 'imagesSlice',
  reducers: {
    setInitialImages: (state, action: PayloadAction<imagesType[]>) => action.payload,

    addImage: (state, action: PayloadAction<imagesType>) => {
      if(state.indexOf(action.payload) === -1) state.push(action.payload)
    },

    deleteImage: (state, action: PayloadAction<string>) => {
      const rmIndex = state.findIndex(i => i.id === action.payload);
      if(rmIndex !== -1) state.splice(rmIndex, 1);
    }
  }
});

export const { addImage, deleteImage, setInitialImages } = imagesSlice.actions;
export default imagesSlice.reducer;