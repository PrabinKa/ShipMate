import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Alert } from 'react-native';
import { baseQueryWithTimeout } from './requestInterceptor';
import { tokenActions } from '../store/slice/token/token';
import { RootState } from '../store/store';
import { BASE_URL } from '../config/config';

// prevent infinite loops
let isRefreshing = false;

// Store the original failed request to retry after refresh
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: FetchBaseQueryError | null,
  token: string | null = null,
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const fetchArgs = args as FetchArgs;

  try {
    const result = await baseQueryWithTimeout(args, api, extraOptions);

    if (result.error) {
      const error = result.error;

      // Handle 401 Unauthorized - Token expired
      if (error.status === 401) {
        const state = api.getState() as RootState;
        const refreshToken = state.token.refreshToken;

        if (!refreshToken) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  api.dispatch(tokenActions.clearAccessToken());
                },
              },
            ],
          );
          return { error };
        }

        // If already refreshing, queue the request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                // Retry the original request with new token
                const retryArgs: FetchArgs = {
                  ...fetchArgs,
                  headers: {
                    ...(fetchArgs.headers || {}),
                    Authorization: `Bearer ${token}`,
                  },
                };
                resolve(baseQueryWithTimeout(retryArgs, api, extraOptions));
              },
              reject: (err) => {
                reject(err);
              },
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshResponse = await fetch(
            `${BASE_URL}auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refreshToken: refreshToken,
              }),
            },
          );

          const refreshData = await refreshResponse.json();

          if (!refreshResponse.ok || refreshData.code === 401 || refreshData.status === 401) {
            // Refresh token also expired then logout user
            processQueue({ status: 401, data: refreshData }, null);
            
            Alert.alert(
              'Session Expired',
              'Your session has expired. Please login again.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    api.dispatch(tokenActions.clearAccessToken());
                  },
                },
              ],
            );
            
            isRefreshing = false;
            return { error: { status: 401, data: 'Session expired' } };
          }

          // Update tokens in store
          if (refreshData.accessToken) {
            api.dispatch(tokenActions.setAccessToken(refreshData.accessToken));
          }
          if (refreshData.refreshToken) {
            api.dispatch(tokenActions.setRefreshToken(refreshData.refreshToken));
          }

          // Process queued requests with new token
          processQueue(null, refreshData.accessToken);

          // Retry the original request with new token
          const retryArgs: FetchArgs = {
            ...fetchArgs,
            headers: {
              ...(fetchArgs.headers || {}),
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          };

          isRefreshing = false;
          return baseQueryWithTimeout(retryArgs, api, extraOptions);
        } catch (refreshError) {
          processQueue({ status: 401, data: refreshError }, null);
          isRefreshing = false;
          
          // Network error during refresh - logout user
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  api.dispatch(tokenActions.clearAccessToken());
                },
              },
            ],
          );
          
          return { error: { status: 401, data: 'Session expired' } };
        }
      }

      return { error };
    }

    return result;
  } catch (error) {
    console.error('Unexpected base query error:', error);
    throw error;
  }
};
