import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { publishType } from "~/types";

const initialState = '';

const publisherSlice = createSlice({
  name: 'publisherSlice',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      return action.payload
    }
  }
});

export const { setId } = publisherSlice.actions
export default publisherSlice.reducer;