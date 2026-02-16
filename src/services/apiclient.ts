import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config/config';
import { RootState } from '../store/store';

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).token.accessToken;

    headers.set('Content-Type', 'application/json')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
