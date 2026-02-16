import {urlConfig} from '../../../config/urlConfig';
import {tokenActions} from '../../../store/slice/token/token';
import {AppDispatch} from '../../../store/store';
import { api } from '../../api';

interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: urlConfig.LOGIN_URL,
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          
          // Dispatch tokens to Redux store
          const dispatchToken = dispatch as AppDispatch;
          dispatchToken(tokenActions.setAccessToken(data.accessToken));
          dispatchToken(tokenActions.setRefreshToken(data.refreshToken));
          
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
    }),
  }),
});

export const {useLoginMutation} = loginApi;
