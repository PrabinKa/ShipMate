import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithInterceptor} from './responseInterceptor';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  tagTypes: ['Orders'], 
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
