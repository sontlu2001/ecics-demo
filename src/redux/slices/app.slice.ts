import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {

}

const initialState: AppState = {

};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
  },
});

export const { } = appSlice.actions;

export default appSlice.reducer;