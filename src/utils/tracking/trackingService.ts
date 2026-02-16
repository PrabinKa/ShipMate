import BackgroundGeolocation from 'react-native-background-geolocation';
import { createMMKV } from 'react-native-mmkv';
import { store } from '../../store/store';
import { checkPermissions, PERMISSION_TYPE } from '../permission/permission';

const storage = createMMKV();

let isTrackingInitialized = false;

const startBackgroundTracking = async () => {
  // Prevent multiple initializations
  if (isTrackingInitialized) {
    console.log('Background tracking already initialized');
    return;
  }

  const hasLocationPermission = await checkPermissions(PERMISSION_TYPE.location);
  if (!hasLocationPermission) return;

  const hasBackgroundPermission = await checkPermissions(PERMISSION_TYPE.background_location);
  if (!hasBackgroundPermission) return;

  try {
    // Step 2: Configure plugin (Promise-based)
    const state = await BackgroundGeolocation.ready({
      desiredAccuracy: 0, // HIGH accuracy
      distanceFilter: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      notification: {
        title: 'Delivery Tracking Active',
        text: 'Your location is being tracked for delivery',
        channelName: 'DeliveryTracking',
        priority: 2,
        sticky: true,
        smallIcon: 'drawable/ic_launcher',
        largeIcon: 'drawable/ic_launcher',
      },
      foregroundService: true,
      enableHeadless: true,
      debug: false,
      logLevel: 5,
    } as any);

    // Step 3: Start tracking if not already started
    if (!state.enabled) {
      await BackgroundGeolocation.start();
      console.log('✅ Background tracking started.');
    } else {
      console.log('✅ Background tracking already running.');
    }

    // Step 4: Listen for location updates (only register once)
    BackgroundGeolocation.onLocation(
      (location) => {
        console.log('[location]', location);

        storage.set('lastLocation', JSON.stringify(location));

        store.dispatch({
          type: 'location/update',
          payload: location,
        });
      },
      (error) => {
        console.warn('[location error]', error);
      }
    );

    isTrackingInitialized = true;
  } catch (error) {
    console.error('BackgroundGeolocation error:', error);
  }
};

const stopBackgroundTracking = async () => {
  try {
    await BackgroundGeolocation.stop();
    BackgroundGeolocation.removeListeners();
    isTrackingInitialized = false;
    console.log('Background tracking stopped.');
  } catch (error) {
    console.error('Error stopping background tracking:', error);
  }
};

export { startBackgroundTracking, stopBackgroundTracking };
