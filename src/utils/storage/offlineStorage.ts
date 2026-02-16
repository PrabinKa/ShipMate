import { createMMKV } from 'react-native-mmkv';

// Generate encryption key from app identifier (use device-specific secure storage in production)
const ENCRYPTION_KEY = 'shipmate_secure_key_2024';

export const storage = createMMKV({
  id: 'shipmate-offline-storage',
  encryptionKey: ENCRYPTION_KEY,
});

const ORDERS_KEY = 'orders';

export type SyncStatus = 'pending' | 'synced' | 'failed';

export interface PendingOrder {
  id: string;
  orderId: string;
  senderName?: string;
  senderAddress?: string;
  senderContact?: string;
  recipientName: string;
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  isSynced: boolean;
  syncStatus: SyncStatus;
}

export const offlineStorage = {
  getOrders(): PendingOrder[] {
    const data = storage.getString(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveOrders(orders: PendingOrder[]) {
    storage.set(ORDERS_KEY, JSON.stringify(orders));
  },

  addOrder(order: Omit<PendingOrder, 'id' | 'orderId' | 'createdAt' | 'updatedAt' | 'syncStatus'>) {
    const orders = this.getOrders();

    // Generate orderId locally when creating the order
    const orderId = `ORD-${Date.now()}`;

    const newOrder: PendingOrder = {
      ...order,
      orderId,
      id: `local_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: 'pending',
    };

    this.saveOrders([newOrder, ...orders]);
    return newOrder;
  },

  markAsSynced(localId: string, _serverId: string) {
    const orders = this.getOrders();

    const updated = orders.map(order =>
      order.id === localId
        ? { ...order, syncStatus: 'synced' as SyncStatus }
        : order,
    );

    this.saveOrders(updated);
  },

  getPendingOrders() {
    return this.getOrders().filter(o => o.syncStatus === 'pending');
  },
};