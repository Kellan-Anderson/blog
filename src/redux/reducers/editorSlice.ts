import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type editorStateType = {
  title: string,
  titleError?: string,
  content: string,
  contentError?: string,
  description: string
}

const initialState: editorStateType = {
  title: '',
  content: '',
  description: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorDetails: (state, action: PayloadAction<editorStateType>) => {
      return action.payload
    },

    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
    },

    setContentError: (state, action: PayloadAction<string | undefined>) => {
      state.contentError = action.payload
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setTitleError: (state, action: PayloadAction<string | undefined>) => {
      state.titleError = action.payload
    },

    setDescription: (state, action: PayloadAction<string>) => {
      if(action.payload === '') {
        state.description = state.content.substring(0, 100);
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