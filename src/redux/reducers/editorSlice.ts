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
    setEditorDetails: (state, action: PayloadAction<editorType>) => action.payload,

    setContent: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        content: action.payload
      }
    },

    setContentError: (state, action: PayloadAction<string | undefined>) => {
      return {
        ...state,
        contentError: action.payload
      }
    },

    setTitle: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        title: action.payload
      }
    },

    setTitleError: (state, action: PayloadAction<string | undefined>) => {
      return {
        ...state,
        titleError: action.payload
      }
    },

    setDescription: (state, action: PayloadAction<string>) => {
      let description: string;
      if(action.payload === '') {
        description = state.content?.substring(0, 100);
      } else {
        description = action.payload;
      }
      return {
        ...state,
        description
      }
    },

    clearErrors: (state) => {
      return {
        ...state,
        titleError: undefined,
        contentError: undefined
      }
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