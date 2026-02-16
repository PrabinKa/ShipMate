import { store } from '../../store/store';
import { deliveryActions } from '../../store/slice/delivery/delivery';
import { AppState, AppStateStatus } from 'react-native';

let simulationInterval: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: any = null;

export const startDeliverySimulation = () => {
  const state = store.getState().delivery;
  
  // Start delivery if not already started
  if (!state.isSimulating) {
    store.dispatch(deliveryActions.startDelivery());
  }

  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  // Update progress every second based on elapsed time
  simulationInterval = setInterval(() => {
    const currentState = store.getState().delivery;
    if (currentState.isSimulating) {
      store.dispatch(deliveryActions.updateProgress());
    } else {
      // Stop interval when delivery is complete
      stopDeliverySimulation();
    }
  }, 1000);

  // Listen to app state changes to restart interval when app comes to foreground
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  }

  console.log('✅ Delivery simulation started');
};

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  const state = store.getState().delivery;
  
  if (nextAppState === 'active' && state.isSimulating) {
    // App came to foreground, update progress immediately
    store.dispatch(deliveryActions.updateProgress());
    
    // Restart interval if it was stopped
    if (!simulationInterval) {
      simulationInterval = setInterval(() => {
        const currentState = store.getState().delivery;
        if (currentState.isSimulating) {
          store.dispatch(deliveryActions.updateProgress());
        } else {
          stopDeliverySimulation();
        }
      }, 1000);
    }
  }
};

export const stopDeliverySimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  if (appStateSubscription) {
    appStateSubscription.remove();
    appStateSubscription = null;
  }
  
  store.dispatch(deliveryActions.stopDelivery());
  console.log('Delivery simulation stopped');
};

export const resetDeliverySimulation = () => {
  stopDeliverySimulation();
  store.dispatch(deliveryActions.resetDelivery());
  console.log('Delivery simulation reset');
};
