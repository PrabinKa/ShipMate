import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStackNavigator from '../stack_nav/AuthStackNavigator';
import UnAuthStackNavigator from '../stack_nav/UnAuthStackNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  const accessToken = useSelector(
    (state: RootState) => state.token.accessToken,
  );
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {accessToken ? (
          <Stack.Screen name="Authenticated" component={AuthStackNavigator} />
        ) : (
          <Stack.Screen
            name="UnAuthenticated"
            component={UnAuthStackNavigator}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNav;
