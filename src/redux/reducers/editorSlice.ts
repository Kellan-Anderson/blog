import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { editorType } from "~/types";

const initialState: editorType = {
  title: '',
  content: '',
  description: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorDetails: (state, action: PayloadAction<editorType>) => {
      state = action.payload
    },

    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
    },

    setContentError: (state, action: PayloadAction<string | undefined>) => {
      state.contentError = action.payload
    },

    setTitle: (state, action: PayloadAction<string>) => {
      console.log('Updating title: ', action.payload)
      state.title = action.payload;
    },

    setTitleError: (state, action: PayloadAction<string | undefined>) => {
      state.titleError = action.payload
    },

    setDescription: (state, action: PayloadAction<string>) => {
      if(action.payload === '') {
        state.description = state.content?.substring(0, 100);
      } else {
        state.description = action.payload;
      }
    },

    clearErrors: (state) => {
      state.titleError, state.contentError = undefined
    }
  }
});

export const {
  setContent,
  setContentError,
  setTitle,
  setTitleError,
  setDescription,
  clearErrors,
  setEditorDetails
} = editorSlice.actions;
export default editorSlice.reducer