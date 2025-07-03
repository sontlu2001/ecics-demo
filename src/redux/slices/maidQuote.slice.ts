import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MaidQuote } from '@/libs/types/maidQuote';

interface AppState {
  maidQuote: MaidQuote;
}

const initialState: AppState = {
  maidQuote: {} as MaidQuote,
};

const appSlice = createSlice({
  name: 'maidQuote',
  initialState,
  reducers: {
    updateMaidQuote(state, action: PayloadAction<Partial<MaidQuote>>) {
      state.maidQuote = { ...state.maidQuote, ...action.payload };
    },
    clearMaidQuote(state) {
      state.maidQuote = {} as MaidQuote;
    },
  },
});

export const { updateMaidQuote, clearMaidQuote } = appSlice.actions;

export default appSlice.reducer;
