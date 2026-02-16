import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  timestamp?: number;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload.coords.latitude;
      state.longitude = action.payload.coords.longitude;
      state.timestamp = action.payload.timestamp;
    },
  },
});

export const locationActions = locationSlice.actions;
export default locationSlice.reducer;
export const locationReducer = locationSlice.reducer;
