import { store } from '../../store/store';
import { deliveryActions } from '../../store/slice/delivery/delivery';
import { AppState, AppStateStatus } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

let simulationInterval: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: any = null;
let hasNotifiedCompletion = false;

export const startDeliverySimulation = () => {
  const state = store.getState().delivery;
  
  // Reset and start delivery if it's completed from a previous session
  if (state.isCompleted) {
    store.dispatch(deliveryActions.resetDelivery());
    hasNotifiedCompletion = false;
  }
  
  // Start delivery if not already started
  if (!state.isSimulating && !state.isCompleted) {
    store.dispatch(deliveryActions.startDelivery());
    hasNotifiedCompletion = false;
  } else if (state.isCompleted) {
    // If it was completed, start fresh after reset
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
        title: 'Delivery Complete!',
        text: 'Your package has arrived at the destination.',
      },
    } as any);
  } catch (error) {
    console.log('Could not update notification:', error);
  }
  
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
  
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  store.dispatch(deliveryActions.resetDelivery());
  
  // Immediately start a new delivery
  store.dispatch(deliveryActions.startDelivery());
  
  // Restart the interval
  startInterval();
  
  // Re-add app state listener if needed
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  }
};
