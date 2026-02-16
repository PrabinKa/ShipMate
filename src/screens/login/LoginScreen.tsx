import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { colors } from '../../theme/colors';
import { rSpacing } from '../../utils/responsive/layout';
import { getFontSize } from '../../utils/responsive/font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoginMutation } from '../../services/api/login';
import { InputField, TextButton } from '../../components';

interface LoginScreenProps {
  navigation?: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const [login, { isLoading, error }] = useLoginMutation();

  const errorMessage =
    error && 'data' in error
      ? (error.data as { message?: string })?.message
      : undefined;

  const handleLogin = async () => {
    try {
      await login({ username, password }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.subtitle}>Welcome back!</Text>
              <Text style={styles.description}>Please sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
              <InputField
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChangeText={(text: string) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: undefined }));
                  }
                }}
                error={errors.username}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
                secureTextEntry={!showPassword}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}

              <TextButton
                label="Signin"
                isLoading={isLoading}
                onPress={handleLogin}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: rSpacing(20),
    paddingVertical: rSpacing(15),
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: rSpacing(40),
  },
  subtitle: {
    fontSize: getFontSize(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: getFontSize(16),
    color: colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: rSpacing(24),
  },
  forgotPasswordText: {
    fontSize: getFontSize(14),
    color: colors.blueDark,
    fontWeight: '600',
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: rSpacing(24),
  },
  signUpText: {
    fontSize: getFontSize(14),
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: getFontSize(14),
    color: colors.blueDark,
    fontWeight: '700',
  },
  errorText: {
    fontSize: getFontSize(12),
    fontWeight: '500',
    color: colors.error,
    marginBottom: rSpacing(4),
  },
});

export default LoginScreen;
