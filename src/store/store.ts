import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createMMKV } from 'react-native-mmkv';
import { persistReducer, persistStore, Storage } from 'redux-persist';
import { TokenReducer } from './slice/token/token';
import { api } from '../services/api';
import { locationReducer } from './slice/location/location';
import { deliveryReducer } from './slice/delivery/delivery';


const reducers = combineReducers({
  token: TokenReducer,
  location: locationReducer,
  delivery: deliveryReducer,
  [api.reducerPath]: api.reducer,
});

// Generate encryption key from app identifier
const ENCRYPTION_KEY = 'shipmate_secure_key_2024';

export const storage = createMMKV({
  id: 'shipmate-redux-storage',
  encryptionKey: ENCRYPTION_KEY,
});

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.remove(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [
    'token',
    'delivery',
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(api.middleware as Middleware),
});

//
const persistor = persistStore(store);

// RTK Query Listener
setupListeners(store.dispatch);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;