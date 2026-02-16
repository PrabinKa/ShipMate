import { store } from '../../store/store';
import { deliveryActions } from '../../store/slice/delivery/delivery';
import { AppState, AppStateStatus } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

let simulationInterval: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: any = null;
let hasNotifiedCompletion = false;

export const startDeliverySimulation = () => {
  const state = store.getState().delivery;
  
  // Start delivery if not already started
  if (!state.isSimulating && !state.isCompleted) {
    store.dispatch(deliveryActions.startDelivery());
    hasNotifiedCompletion = false;
  }

  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  // Start the interval
  startInterval();

  // Listen to app state changes
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  }

  console.log('Delivery simulation started');
};

const startInterval = () => {
  simulationInterval = setInterval(() => {
    const currentState = store.getState().delivery;
    if (currentState.isSimulating) {
      store.dispatch(deliveryActions.updateProgress());
      
      if (currentState.progress >= 0.99 && !hasNotifiedCompletion) {
        hasNotifiedCompletion = true;
        sendDeliveryCompletionNotification();
      }
    } else if (currentState.isCompleted && !hasNotifiedCompletion) {
      hasNotifiedCompletion = true;
      sendDeliveryCompletionNotification();
    } else {
      stopDeliverySimulation();
    }
  }, 1000);
};

const sendDeliveryCompletionNotification = () => {
  try {
    BackgroundGeolocation.ready({
      notification: {
        title: '🎉 Delivery Complete!',
        text: 'Your package has arrived at the destination.',
      },
    } as any);
  } catch (error) {
    console.log('Could not update notification:', error);
  }
  
  console.log('📱 Delivery completion notification sent');
};

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  const state = store.getState().delivery;
  
  if (nextAppState === 'active' && state.isSimulating) {
    store.dispatch(deliveryActions.updateProgress());
    
    if (!simulationInterval) {
      startInterval();
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
};

export const resetDeliverySimulation = () => {
  hasNotifiedCompletion = false;
  
  // Stop current interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  // Reset the delivery state
  store.dispatch(deliveryActions.resetDelivery());
  
  // Immediately start a new delivery
  store.dispatch(deliveryActions.startDelivery());
  
  // Restart the interval
  startInterval();
  
  // Re-add app state listener if needed
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  }
  
  console.log('Delivery simulation reset and restarted');
};
