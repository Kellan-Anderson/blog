import { createSlice, PayloadAction} from "@reduxjs/toolkit"

const initialState: string[] = []

export const tagsSlice = createSlice({
  name: 'tagsSlice',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<string>) => {
      if(state.findIndex(t => t === action.payload) === -1) return state.concat(action.payload);
    },

    removeTag: (state, action: PayloadAction<string>) => {
      return state.filter(i => i !== action.payload);
    },

    setAllTags: (state, action: PayloadAction<string[] | undefined>) => {
      if(!action.payload) return []
      return action.payload;
    },

    clearAllTags: (state) => []
  }
});

export const { addTag, clearAllTags, removeTag, setAllTags } = tagsSlice.actions;
export default tagsSlice.reducer