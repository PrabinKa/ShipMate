import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { getFontSize, rSpacing, useNetworkStatus } from '../../utils';
import { InputField, ScreenHeader, TextButton } from '../../components';
import PaymentOptionCard from './PaymentOptionCard';
import { offlineStorage } from '../../utils/storage/offlineStorage';
import { PaymentMethod, PaymentStatus } from '../../types/order/types';
import { useCreateOrderMutation } from '../../services/api/order/orderList';

interface FormState {
  senderName?: string;
  senderAddress?: string;
  senderContact?: string;
  recipientName: string;
  deliveryAddress: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

interface NewShipmentProps {
  navigation: any;
}

const NewShipment: React.FC<NewShipmentProps> = ({ navigation }) => {
  const { container, termsBoxWrapper, termsTextStyle } = styles;
  const isOnline = useNetworkStatus();
  const [createOrder] = useCreateOrderMutation();
  const [formField, setFormField] = useState<FormState>({
    senderName: 'Prabin Karki',
    senderAddress: 'Kathmandu',
    senderContact: '9811920427',
    recipientName: '',
    deliveryAddress: '',
    contactNumber: '',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
  });

  const onChangeHandler = (
    key: keyof typeof formField,
    value: string | number,
  ) => {
    setFormField(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateForm = (): { isValid: boolean; message: string } => {
    const { recipientName, deliveryAddress, contactNumber } = formField;

    if (!recipientName.trim()) {
      return { isValid: false, message: 'Recipient name is required' };
    }

    if (!deliveryAddress.trim()) {
      return { isValid: false, message: 'Delivery address is required' };
    }

    if (!contactNumber.trim()) {
      return { isValid: false, message: 'Contact number is required' };
    }

    const cleanNumber = contactNumber.replaceAll(/\D/g, '');

    if (cleanNumber.length !== 10) {
      return { isValid: false, message: 'Contact number must be 10 digits' };
    }

    return { isValid: true, message: '' };
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert(validation.message);
      return;
    }

    const updatedPaymentStatus =
      formField.paymentMethod === 'Online' && isOnline ? 'Paid' : 'Pending';

    const localOrder = offlineStorage.addOrder({
      ...formField,
      paymentStatus: updatedPaymentStatus,
      status: 'Pending',
      isSynced: false,
    });

    navigation.goBack();

    // Background sync if online
    if (isOnline) {
      try {
        const response = await createOrder(localOrder).unwrap();

        offlineStorage.markAsSynced(localOrder.id, response.id);
      } catch {
        // Silent failure - order is already saved locally and will sync later
      }
    }
  };

  return (
    <SafeAreaView style={container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScreenHeader
            label="New Shipment"
            onPress={() => navigation.goBack()}
          />
          <View style={{ marginTop: rSpacing(20) }}>
            <InputField
              label="Recipient Name"
              placeholder="Enter Reciever's name"
              value={formField.recipientName}
              onChangeText={(text: string) => {
                onChangeHandler('recipientName', text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <InputField
              label="Delivery Address"
              placeholder="Enter Reciever's full address"
              value={formField.deliveryAddress}
              onChangeText={(text: string) => {
                onChangeHandler('deliveryAddress', text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <InputField
              label="Contact Phone"
              placeholder="Enter Reciever's contact no."
              value={formField.contactNumber}
              keyboardType="phone-pad"
              maxLength={10}
              onChangeText={(text: string) => {
                onChangeHandler('contactNumber', text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          <View style={{ gap: rSpacing(20) }}>
            <View
              style={{
                backgroundColor: colors.grayLight,
                borderColor: colors.grayMedium,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: rSpacing(10),
                paddingVertical: rSpacing(15),
                gap: 15,
              }}
            >
              <Text
                style={{
                  fontSize: getFontSize(14),
                  color: colors.grayDark,
                  fontWeight: '700',
                }}
              >
                Select Payment Method
              </Text>
              <PaymentOptionCard
                title="Cash On Delivery"
                description="Pay when you receive the package"
                icon="wallet-outline"
                selected={formField.paymentMethod === 'COD'}
                onPress={() => onChangeHandler('paymentMethod', 'COD')}
              />
              <PaymentOptionCard
                title="Online Payment"
                description="Credit, Debit or Digital Wallet"
                icon="card"
                selected={formField.paymentMethod === 'Online'}
                onPress={() => onChangeHandler('paymentMethod', 'Online')}
              />
            </View>
            <View style={termsBoxWrapper}>
              <Text style={termsTextStyle}>
                Your order will be saved on this device. If you are currently
                offline, it will automatically be uploaded and saved online once
                your internet connection is restored.
              </Text>
            </View>
            <TextButton
              label="Continue to Payment"
              isLoading={false}
              onPress={handleSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default NewShipment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: rSpacing(20),
  },
  termsBoxWrapper: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blueMedium,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: rSpacing(10),
    paddingVertical: rSpacing(12),
  },
  termsTextStyle: {
    fontSize: getFontSize(12),
    color: colors.blueDark,
    fontWeight: '600',
  },
});
