import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { getFontSize, rHeight, rSpacing } from '../../utils';
import { useNavigation } from '@react-navigation/native';

interface Props {
  item: any;
}

const OrderCard: React.FC<Props> = ({ item }) => {
  const isInTransit = item.status === 'In Transit';
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', {item})} activeOpacity={0.8} style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.orderId}>{item.orderId || item.serverId}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>

        {item.syncStatus == 'pending' && (
          <View style={styles.unsyncedBadge}>
            <Text style={styles.unsyncedText}>UNSYNCED</Text>
          </View>
        )}
      </View>

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.label}>SENDER</Text>
          <Text style={styles.value}>{item.senderName}</Text>
        </View>

        <View>
          <Text style={styles.label}>RECIPIENT</Text>
          <Text style={styles.value}>{item.recipientName}</Text>
        </View>
      </View>

      {isInTransit && (
        <TouchableOpacity onPress={() => navigation.navigate('TrackingMap', {
          orderId: item.orderId || item.serverId,
          orderStatus: item.status,
          recipientName: item.recipientName,
          recipientAddress: item.recipientAddress,
          senderName: item.senderName,
          senderAddress: item.senderAddress,
        })} >
          <Text style={styles.track}>Track Live Delivery →</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default memo(OrderCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: rSpacing(16),
    padding: rSpacing(16),
    marginBottom: rSpacing(16),
    borderWidth: 1,
    borderColor: colors.grayMedium
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rSpacing(16),
  },

  orderId: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: rSpacing(6),
  },

  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: rSpacing(12),
    paddingVertical: rSpacing(4),
    borderRadius: rSpacing(20),
    backgroundColor: '#E5EDFF',
    color: '#3B5BDB',
    fontSize: getFontSize(12),
    fontWeight: '600',
  },

  unsyncedBadge: {
    paddingHorizontal: rSpacing(10),
    paddingVertical: rSpacing(4),
    borderRadius: rSpacing(20),
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },

  unsyncedText: {
    fontSize: getFontSize(11),
    fontWeight: '600',
    color: '#D97706',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rSpacing(12),
  },

  label: {
    fontSize: getFontSize(11),
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: rSpacing(4),
  },

  value: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.textPrimary,
  },

  track: {
    marginTop: rSpacing(6),
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: '#3B5BDB',
  },
});

