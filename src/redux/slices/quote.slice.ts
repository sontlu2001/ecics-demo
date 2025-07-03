import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { Quote } from '@/libs/types/quote';

interface AppState {
  quote: Quote;
}

const initialState: AppState = {
  quote: {} as Quote,
};

const appSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    updateQuote(state, action: PayloadAction<Partial<Quote>>) {
      state.quote = { ...state.quote, ...action.payload };
    },
    clearQuote(state) {
      state.quote = {} as Quote;
    },
  },
});

export const { updateQuote, clearQuote } = appSlice.actions;

export const useAddNamedDriverInfo = () => {
  return useSelector(
    (state: { quote: AppState }) =>
      state.quote.quote?.data?.add_named_driver_info,
  );
};

export default appSlice.reducer;
