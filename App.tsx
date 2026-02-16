import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootStackNav from './src/navigation/root_stack_nav/RootStackNav';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { useEffect } from 'react';
import { startDeliverySimulation } from './src/utils/delivery/deliverySimulation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Start delivery simulation when app launches
    // It will check if already running and continue from where it left off
    startDeliverySimulation();
  }, []);

  return (
    <Provider store={store}>
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootStackNav />
    </SafeAreaProvider>
    </Provider>
  );
}

export default App;
