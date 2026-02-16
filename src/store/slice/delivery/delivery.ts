import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeliveryState {
  progress: number;
  isSimulating: boolean;
  isCompleted: boolean;
  startTime: number | null;
  estimatedDuration: number;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

const initialState: DeliveryState = {
  progress: 0,
  isSimulating: false,
  isCompleted: false,
  startTime: null,
  estimatedDuration: 100000,
  startLocation: {
    latitude: 27.7172,
    longitude: 85.3240,
  },
  endLocation: {
    latitude: 27.700769,
    longitude: 85.300140,
  },
  currentLocation: {
    latitude: 27.7172,
    longitude: 85.3240,
  },
};

export const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    startDelivery: (state) => {
      if (!state.isSimulating) {
        state.isSimulating = true;
        state.isCompleted = false;
        state.startTime = Date.now();
        state.progress = 0;
        state.currentLocation = state.startLocation;
      }
    },
    updateProgress: (state) => {
      if (!state.isSimulating || !state.startTime) return;

      const elapsed = Date.now() - state.startTime;
      const newProgress = Math.min(elapsed / state.estimatedDuration, 1);
      
      state.progress = newProgress;
      
      const { startLocation, endLocation } = state;
      state.currentLocation = {
        latitude: startLocation.latitude + (endLocation.latitude - startLocation.latitude) * newProgress,
        longitude: startLocation.longitude + (endLocation.longitude - startLocation.longitude) * newProgress,
      };

      if (newProgress >= 1) {
        state.isSimulating = false;
        state.isCompleted = true;
      }
    },
    stopDelivery: (state) => {
      state.isSimulating = false;
    },
    resetDelivery: (state) => {
      state.progress = 0;
      state.isSimulating = false;
      state.isCompleted = false;
      state.startTime = null;
      state.currentLocation = state.startLocation;
    },
  },
});

export const deliveryActions = deliverySlice.actions;
export default deliverySlice.reducer;
export const deliveryReducer = deliverySlice.reducer;
