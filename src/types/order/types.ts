export type DeliveryStatus = 'Pending' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'Online';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type SyncStatus = 'synced' | 'pending';

export interface Order {
  id: string;
  orderId: string;
  senderName: string;
  senderAddress: string;
  senderContact: string;
  recipientName: string;
  recipientAddress: string;
  recipientContact: string;
  deliveryStatus: DeliveryStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  syncStatus: SyncStatus;
  createdAt: string;
  estimatedDelivery?: string;
  trackingCoordinates?: TrackingCoordinate[];
  pickupLocation?: {
    latitude: number;
    longitude: number;
  };
  deliveryLocation?: {
    latitude: number;
    longitude: number;
  };
  status: DeliveryStatus;
}

export interface TrackingCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface CreateOrderPayload {
  recipientName: string;
  recipientAddress: string;
  recipientContact: string;
}