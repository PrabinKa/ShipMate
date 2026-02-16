import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { rSpacing } from '../../utils';

const OrderCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <SkeletonPlaceholder borderRadius={4}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <View>
            <SkeletonPlaceholder.Item
              width={80}
              height={14}
              marginBottom={rSpacing(6)}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={20}
              borderRadius={20}
            />
          </View>

          <SkeletonPlaceholder.Item
            width={90}
            height={24}
            borderRadius={20}
          />
        </View>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View>
            <SkeletonPlaceholder.Item
              width={60}
              height={12}
              marginBottom={rSpacing(4)}
            />
            <SkeletonPlaceholder.Item
              width={120}
              height={14}
            />
          </View>

          <View>
            <SkeletonPlaceholder.Item
              width={70}
              height={12}
              marginBottom={rSpacing(4)}
            />
            <SkeletonPlaceholder.Item
              width={120}
              height={14}
            />
          </View>
        </View>

        {/* Track Button */}
        <SkeletonPlaceholder.Item
          width={160}
          height={14}
          marginTop={rSpacing(6)}
        />
      </SkeletonPlaceholder>
    </View>
  );
};

export default OrderCardSkeleton;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: rSpacing(16),
    padding: rSpacing(16),
    marginBottom: rSpacing(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rSpacing(16),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rSpacing(12),
  },
});
