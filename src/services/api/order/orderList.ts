import { urlConfig } from "../../../config/urlConfig";
import { api } from "../../api";
import { OrdersResponse } from "./schema";

export const orderList = api.injectEndpoints({
  endpoints: builder => ({

    // ✅ GET Orders
    getOrderList: builder.query<OrdersResponse, void>({
      query: () => ({
        method: 'GET',
        url: urlConfig.ORDER_LIST,
      }),
      providesTags: ['Orders'],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          console.log(
            'ERROR WHILE FETCHING ORDER LIST IN BASE QUERY:',
            error?.error?.data
          );
        }
      },
    }),

    // ✅ CREATE Order (POST)
    createOrder: builder.mutation<any, any>({
      query: body => ({
        method: 'POST',
        url: urlConfig.CREATE_ORDER,
        body,
      }),
      invalidatesTags: ['Orders'], 
      onQueryStarted: async (body, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(
            'ORDER CREATED SUCCESSFULLY:',
            data
          );
        } catch (error: any) {
          console.log(
            'ERROR WHILE CREATING ORDER:',
            error?.error?.data
          );
        }
      },
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetOrderListQuery,
  useCreateOrderMutation,
} = orderList;
