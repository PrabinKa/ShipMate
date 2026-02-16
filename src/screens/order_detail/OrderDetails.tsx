import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components';
import { colors } from '../../theme/colors';
import { getFontSize, rSpacing } from '../../utils';
import Ionicons from '@react-native-vector-icons/ionicons';
import { PendingOrder } from '../../utils/storage/offlineStorage';

interface OrderDetailsProps {
  navigation: any;
  route: any;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ navigation, route }) => {
  const {
    container,
    scrollView,
    scrollContent,
    headerCard,
    orderIdRow,
    orderIdLabel,
    orderIdValue,
    statusRow,
    statusBadge,
    statusText,
    trackButton,
    trackButtonText,
    infoCard,
    cardHeader,
    iconContainer,
    cardTitle,
    divider,
    infoRow,
    contactRow,
    infoLabel,
    infoValue,
    phoneContainer,
    phoneText,
    twoColumnRow,
    column,
    paymentBadge,
    paymentStatusText,
  } = styles;

  const order: PendingOrder = route.params.item || {};

  const isInTransit = order.status === 'In Transit';

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#d1fae5', text: '#059669', border: '#34d399' };
      case 'In Transit':
        return { bg: '#dbeafe', text: '#2563eb', border: '#60a5fa' };
      case 'Picked Up':
        return { bg: '#fef3c7', text: '#d97706', border: '#fbbf24' };
      case 'Pending':
        return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
      case 'Cancelled':
        return { bg: '#fee2e2', text: '#dc2626', border: '#f87171' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' };
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Paid':
        return { bg: '#d1fae5', text: '#059669' };
      case 'Pending':
        return { bg: '#fef3c7', text: '#d97706' };
      case 'Failed':
        return { bg: '#fee2e2', text: '#dc2626' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const formatDate = (dateString?: number) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

const makePhoneCall = async (phoneNumber?: string) => {
  if (!phoneNumber?.trim()) return;

  try {
    const cleanNumber = phoneNumber.replaceAll(/\D/g, '');
    const url = `tel:${cleanNumber}`;

    await Linking.openURL(url);
  } catch (error) {
    console.error('Failed to make phone call:', error);
  }
};

  const statusStyle = getStatusColor(order.status);
  const paymentStatusStyle = getPaymentStatusColor(order.paymentStatus);

  return (
    <SafeAreaView style={container}>
      <View style={{ paddingHorizontal: rSpacing(20) }}>
        <ScreenHeader
          label="Order Details"
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView
        style={scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={scrollContent}
      >
        {/* Order Header Card */}
        <View style={headerCard}>
          <View style={orderIdRow}>
            <Text style={orderIdLabel}>ORDER ID</Text>
            <Text style={orderIdValue}>
              {order.orderId || order.id || 'N/A'}
            </Text>
          </View>

          <View style={statusRow}>
            <View
              style={[
                statusBadge,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.border,
                },
              ]}
            >
              <Text style={[statusText, { color: statusStyle.text }]}>
                {order.status || 'N/A'}
              </Text>
            </View>
          </View>

          {isInTransit && (
            <TouchableOpacity
              style={trackButton}
              onPress={() => navigation.navigate('TrackingMap')}
              activeOpacity={0.8}
            >
              <Text style={trackButtonText}>Track Live Delivery</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Sender Information Card */}
        <View style={infoCard}>
          <View style={cardHeader}>
            <View style={iconContainer}>
              <Ionicons name="send-outline" size={20} color={colors.blueDark} />
            </View>
            <Text style={cardTitle}>Sender Details</Text>
          </View>

          <View style={divider} />

          <View style={infoRow}>
            <Text style={infoLabel}>Name</Text>
            <Text style={infoValue}>{order.senderName || 'N/A'}</Text>
          </View>

          <View style={infoRow}>
            <Text style={infoLabel}>Address</Text>
            <Text style={infoValue}>{order.senderAddress || 'N/A'}</Text>
          </View>

          <TouchableOpacity
            style={contactRow}
            onPress={() => makePhoneCall(order.senderContact)}
            activeOpacity={0.7}
          >
            <Text style={infoLabel}>Contact</Text>
            <View style={phoneContainer}>
              <Text style={phoneText}>{order.senderContact || 'N/A'}</Text>
              {order.senderContact && (
                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color={colors.blueDark}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Recipient Information Card */}
        <View style={infoCard}>
          <View style={cardHeader}>
            <View style={[iconContainer]}>
              <Ionicons
                name="code-download"
                size={20}
                color={colors.blueDark}
              />
            </View>
            <Text style={cardTitle}>Recipient Details</Text>
          </View>

          <View style={divider} />

          <View style={infoRow}>
            <Text style={infoLabel}>Name</Text>
            <Text style={infoValue}>{order.recipientName || 'N/A'}</Text>
          </View>

          <View style={infoRow}>
            <Text style={infoLabel}>Address</Text>
            <Text style={infoValue}>{order.deliveryAddress || 'N/A'}</Text>
          </View>

          <TouchableOpacity
            style={contactRow}
            onPress={() => makePhoneCall(order.contactNumber)}
            activeOpacity={0.7}
          >
            <Text style={infoLabel}>Contact</Text>
            <View style={phoneContainer}>
              <Text style={phoneText}>{order.contactNumber || 'N/A'}</Text>
              {!!(order.contactNumber) && (
                <Ionicons
                  name="phone-portrait-outline"
                  size={20}
                  color={colors.blueDark}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment & Delivery Info Card */}
        <View style={infoCard}>
          <View style={cardHeader}>
            <View style={[iconContainer]}>
              <Ionicons name="card-outline" size={20} color={colors.blueDark} />
            </View>
            <Text style={cardTitle}>Payment & Delivery</Text>
          </View>

          <View style={divider} />

          <View style={twoColumnRow}>
            <View style={column}>
              <Text style={infoLabel}>Payment Method</Text>
              <Text style={infoValue}>{order.paymentMethod || 'N/A'}</Text>
            </View>

            <View style={column}>
              <Text style={infoLabel}>Payment Status</Text>
              <View
                style={[
                  paymentBadge,
                  { backgroundColor: paymentStatusStyle.bg },
                ]}
              >
                <Text
                  style={[
                    paymentStatusText,
                    { color: paymentStatusStyle.text },
                  ]}
                >
                  {order.paymentStatus || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View style={[infoRow, { marginTop: rSpacing(16) }]}>
            <Text style={infoLabel}>Created</Text>
            <Text style={infoValue}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: rSpacing(20),
    paddingTop: rSpacing(8),
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: rSpacing(16),
    padding: rSpacing(20),
    marginBottom: rSpacing(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderIdRow: {
    marginBottom: rSpacing(12),
  },
  orderIdLabel: {
    fontSize: getFontSize(11),
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: rSpacing(4),
  },
  orderIdValue: {
    fontSize: getFontSize(20),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rSpacing(10),
  },
  statusBadge: {
    paddingHorizontal: rSpacing(14),
    paddingVertical: rSpacing(6),
    borderRadius: rSpacing(20),
    borderWidth: 1,
  },
  statusText: {
    fontSize: getFontSize(13),
    fontWeight: '600',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueDark,
    borderRadius: rSpacing(12),
    paddingVertical: rSpacing(14),
    paddingHorizontal: rSpacing(20),
    marginTop: rSpacing(20),
    shadowColor: colors.blueDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  trackButtonText: {
    color: colors.surface,
    fontSize: getFontSize(15),
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: rSpacing(16),
    padding: rSpacing(20),
    marginBottom: rSpacing(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rSpacing(12),
  },
  iconContainer: {
    width: rSpacing(36),
    height: rSpacing(36),
    borderRadius: rSpacing(10),
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: rSpacing(12),
  },
  cardTitle: {
    fontSize: getFontSize(16),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayMedium,
    marginBottom: rSpacing(16),
  },
  infoRow: {
    marginBottom: rSpacing(12),
  },
  contactRow: {
    marginBottom: rSpacing(4),
  },
  infoLabel: {
    fontSize: getFontSize(11),
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: rSpacing(4),
  },
  infoValue: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: getFontSize(20),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneText: {
    fontSize: getFontSize(14),
    fontWeight: '500',
    color: colors.blueDark,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  paymentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: rSpacing(10),
    paddingVertical: rSpacing(4),
    borderRadius: rSpacing(12),
    marginTop: rSpacing(4),
  },
  paymentStatusText: {
    fontSize: getFontSize(12),
    fontWeight: '600',
  },
});
