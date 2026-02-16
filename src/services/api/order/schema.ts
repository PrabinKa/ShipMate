import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.string(),

  orderId: z.union([
    z.string(),
    z.number(),
  ]).optional(),

  senderName: z.string().optional(),
  senderAddress: z.string().optional(),
  senderContact: z.string().optional(),
  
  recipientName: z.string(),
  deliveryAddress: z.string().optional(),
  contactNumber: z.string().optional(),
  
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  status: z.string(),

  isSynced: z.boolean(),

  createdAt: z.union([
    z.string(),
    z.number(), 
  ]),

  updatedAt: z.union([
    z.string(),
    z.number(),
  ]),
});

export const OrdersResponseSchema = z.array(OrderSchema);

export type Order = z.infer<typeof OrderSchema>;
export type OrdersResponse = z.infer<typeof OrdersResponseSchema>;