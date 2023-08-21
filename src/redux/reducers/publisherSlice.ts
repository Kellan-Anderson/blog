import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: string | undefined = ''

const publisherSlice = createSlice({
  name: 'publisherSlice',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => action.payload
  }
});

export const { setId } = publisherSlice.actions
export default publisherSlice.reducer;