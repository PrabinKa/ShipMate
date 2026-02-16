import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IToken {
  accessToken: string;
  refreshToken: string;
}

const initialState: IToken = {
  accessToken: '',
  refreshToken: '',
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    clearAccessToken: state => {
      state.accessToken = '';
      state.refreshToken = '';
    },
  },
});

export const tokenActions = tokenSlice.actions;
export default tokenSlice.reducer;
export const TokenReducer = tokenSlice.reducer;