import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors } from '../../theme/colors';
import { getFontSize, rSpacing } from '../../utils';

type IonIconName = 'card' | 'wallet-outline';

interface Props {
  title: string;
  description: string;
  icon: IonIconName;
  selected?: boolean;
  onPress?: () => void;
}

const PaymentOptionCard: React.FC<Props> = ({
  title,
  description,
  icon,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={colors.grayDark} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentOptionCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.grayMedium,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rSpacing(10),
    paddingHorizontal: rSpacing(20),
  },
  selectedContainer: {
    borderColor: colors.blueDark,
    backgroundColor: colors.blueLight,
  },
  iconWrapper: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    padding: rSpacing(6),
  },
  textWrapper: {
    marginLeft: rSpacing(12),
    flex: 1,
  },
  title: {
    color: colors.grayDark,
    fontSize: getFontSize(14),
    fontWeight: '500',
  },
  description: {
    color: colors.textSecondary,
    fontSize: getFontSize(12),
    marginTop: rSpacing(2),
  },
});
