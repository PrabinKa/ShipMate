import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import RootStackNav from './src/navigation/root_stack_nav/RootStackNav';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { useEffect } from 'react';
import { startDeliverySimulation } from './src/utils/delivery/deliverySimulation';
import { requestStartupPermissions } from './src/utils/permission/permission';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initApp = async () => {
      try {
         await requestStartupPermissions();
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }

      // Start delivery simulation after permissions are requested
      startDeliverySimulation();
    };

    initApp();
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
