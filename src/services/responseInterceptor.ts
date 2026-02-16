// services/responseInterceptor.ts

import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {Alert} from 'react-native';
import {baseQueryWithTimeout} from './requestInterceptor';

export const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const {url, method} = args as FetchArgs;

  try {
    const result = await baseQueryWithTimeout(args, api, extraOptions);

    if (result.error) {
      const error = result.error;

      if (error.status === 'TIMEOUT_ERROR') {
        Alert.alert(
          'Network Timeout',
          'The request took too long. Please try again.',
        );
      }

      if (error.status === 401) {
        Alert.alert('Unauthorized', 'Please login again.');
      }

      return {error};
    }

    return result;
  } catch (error) {
    console.error('Unexpected base query error:', error);
    throw error;
  } finally {
    console.log(`[${method}] ${url}`);
  }
};
