// services/requestInterceptor.ts

import {BaseQueryFn, FetchArgs} from '@reduxjs/toolkit/query';
import { rawBaseQuery } from './apiclient';


export const baseQueryWithTimeout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  any
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 'FETCH_ERROR') {
    return {
      error: {
        status: 'NETWORK_ERROR',
        data: 'Unable to connect to server',
      },
    };
  }

  return result;
};

