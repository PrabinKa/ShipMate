import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFontSize, rHeight, rSpacing, rWidth, useNetworkStatus } from '../../utils';
import { colors } from '../../theme/colors';
import {
  useCreateOrderMutation,
  useGetOrderListQuery,
} from '../../services/api/order/orderList';
import OrderCardSkeleton from './OrderCardSkeleton';
import { OrderCard } from '../../components';
import { Order } from '../../services/api/order/schema';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  offlineStorage,
  PendingOrder,
} from '../../utils/storage/offlineStorage';
import { useFocusEffect } from '@react-navigation/native';

interface OrderListScreenProps {
  navigation: any;
}

const OrderListScreen: React.FC<OrderListScreenProps> = ({ navigation }) => {
  const { container, headerTextStyle, subHeaderTextStyle, fabButton } = styles;

  const isOnline = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  const [orders, setOrders] = useState<PendingOrder[]>([]);

  const {
    data: apiData,
    isLoading,
    isFetching,
    refetch,
  } = useGetOrderListQuery();

  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    setOrders(offlineStorage.getOrders());
  }, [isSyncing]);

  useFocusEffect(
  React.useCallback(() => {
    const storedOrders = offlineStorage.getOrders();
    setOrders(storedOrders);
  }, [])
);

  // Merge API data with local data
  const mergedOrders = useMemo(() => {
    if (!isOnline) return orders;

    const apiOrders = apiData ?? [];

    const mergedMap = new Map<string, Order>();

    [...apiOrders, ...orders].forEach(order => {
      mergedMap.set(order.id, order);
    });

    return Array.from(mergedMap.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [apiData, orders, isOnline]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOnline || isSyncing) return;

    const pending = offlineStorage.getPendingOrders();
    if (pending.length) {
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    const pending = offlineStorage.getPendingOrders();
    if (!pending.length) return;

    setIsSyncing(true);

    for (const order of pending) {
      try {
        const response = await createOrder(order).unwrap();
        offlineStorage.markAsSynced(order.id, response.id);
      } catch (error) {
        console.log('Sync failed for', error);
      }
    }

    setOrders(offlineStorage.getOrders());
    setIsSyncing(false);
  };

  const handleRefresh = async () => {
    if (isOnline) {
      await handleSync();
      await refetch();
    }
  };

  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView style={container} edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: rSpacing(20),
          paddingVertical: rSpacing(20),
        }}
      >
        <View>
          <Text style={headerTextStyle}>Your Shipments</Text>
          <Text style={subHeaderTextStyle}>
            Manage and track your delivery orders
          </Text>
        </View>
        <TouchableOpacity
          style={fabButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('NewShipment')}
        >
          <Ionicons name="add-outline" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.grayLight }}>
        {isLoading ? (
          <View
            style={{ marginTop: rSpacing(20), paddingHorizontal: rSpacing(20) }}
          >
            {[1, 2, 3, 4].map(i => (
              <OrderCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={mergedOrders ?? []}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginTop: rSpacing(20),
              paddingHorizontal: rSpacing(20),
              paddingBottom: rSpacing(60),
            }}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                tintColor={colors.blueDark}
              />
            }
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: rSpacing(15),
  },
  headerTextStyle: {
    fontSize: getFontSize(20),
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subHeaderTextStyle: {
    fontSize: getFontSize(14),
    fontWeight: '400',
    color: colors.textSecondary,
  },
  fabButton: {
    width: rHeight(56),
    height: rWidth(56),
    borderRadius: 14,
    backgroundColor: colors.blueDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.67,
    elevation: 3,
  },
});
