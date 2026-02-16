import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { rHeight, rSpacing } from '../../utils/responsive/layout';
import { getFontSize } from '../../utils/responsive/font';
import Ionicons from '@react-native-vector-icons/ionicons';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  showPasswordToggle = false,
  onTogglePassword,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.grayDark}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={onTogglePassword}
          >
            <Text style={styles.toggleButtonText}>
              {secureTextEntry ? <Ionicons name='eye' size={20} /> : <Ionicons name='eye-off' size={20} />}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: rSpacing(20),
  },
  label: {
    fontSize: getFontSize(14),
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: rSpacing(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: rSpacing(12),
    borderWidth: 1,
    borderColor: colors.grayMedium,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: colors.blueDark,
    borderWidth: 1,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: rHeight(46),
    paddingHorizontal: rSpacing(10),
    fontSize: getFontSize(14),
    color: colors.textPrimary,
  },
  toggleButton: {
    paddingHorizontal: rSpacing(16),
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: getFontSize(20),
  },
  errorText: {
    fontSize: getFontSize(12),
    color: colors.error,
    marginTop: rSpacing(4),
  },
});

export default InputField;
