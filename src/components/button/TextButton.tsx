import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { getFontSize, rHeight, rSpacing } from '../../utils';

interface TextButtonProps {
    label: string;
  isLoading: boolean;
  onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({ label, isLoading, onPress }) => {
  const { buttonContainer, buttonDisabled, buttonText } = styles;
  return (
    <TouchableOpacity
      style={[buttonContainer, isLoading && buttonDisabled]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <Text style={buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.blueDark,
    height: rHeight(56),
    borderRadius: rSpacing(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blueDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.primary,
    fontSize: getFontSize(16),
    fontWeight: '700',
  },
});
