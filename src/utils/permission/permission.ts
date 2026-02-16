import { check, PERMISSIONS, request, RESULTS, openSettings } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';
import type { Permission } from 'react-native-permissions';

type PermissionType = keyof typeof REQUEST_PERMISSION_TYPE;

interface PlatformPermissions {
  ios: string | null;
  android: string;
}

const PLATFORM_ACCESS_LOCATION: PlatformPermissions = {
  ios: null,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_ACCESS_BACKGROUND_LOCATION: PlatformPermissions = {
  ios: null,
  android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
};

const PLATFORM_NOTIFICATION: PlatformPermissions = {
  ios: null,
  android: 'android.permission.POST_NOTIFICATIONS',
};

const PLATFORM_PHONE_CALL: PlatformPermissions = {
  ios: null,
  android: PERMISSIONS.ANDROID.READ_PHONE_STATE,
};

const PLATFORM_PHYSICAL_ACTIVITY: PlatformPermissions = {
  ios: null,
  android: PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
};

const REQUEST_PERMISSION_TYPE = {
  location: PLATFORM_ACCESS_LOCATION,
  background_location: PLATFORM_ACCESS_BACKGROUND_LOCATION,
  notification: PLATFORM_NOTIFICATION,
  phone_call: PLATFORM_PHONE_CALL,
  physical_activity: PLATFORM_PHYSICAL_ACTIVITY,
};

const PERMISSION_TYPE = {
  location: 'location',
  background_location: 'background_location',
  notification: 'notification',
  phone_call: 'phone_call',
  physical_activity: 'physical_activity',
} as const;

const showPermissionRequiredAlert = (permissionName: string, onConfirm: () => void) => {
  Alert.alert(
    'Permission Required',
    `${permissionName} permission is required for this app to work properly. Please enable it in settings.`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: onConfirm,
      },
    ]
  );
};

// Check permission
const checkPermissions = async (type: PermissionType): Promise<boolean> => {
  const permission = REQUEST_PERMISSION_TYPE[type];

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const perm = permission[Platform.OS];
    
    if (!perm) {
      return false;
    }

    try {
      const result = await check(perm as Permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        return false;
      }
      return false;
    } catch (error) {
      console.error(`Error checking permission: ${type}`, error);
      return false;
    }
  }
  return false;
};

// Request permission
const requestPermissions = async (type: PermissionType): Promise<boolean> => {
  const permission = REQUEST_PERMISSION_TYPE[type];
  
  // Get readable name for the permission
  const permissionName = type === 'location' ? 'Location' : 
                        type === 'background_location' ? 'Background Location' :
                        type === 'notification' ? 'Notification' : 
                        type === 'phone_call' ? 'Phone Call' : 'Physical Activity';

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const perm = permission[Platform.OS];
    
    if (!perm) {
      return false;
    }

    try {
      const result = await request(perm as Permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.BLOCKED) {
        // Permission was BLOCKED after request
        showPermissionRequiredAlert(permissionName, () => {
          openSettings();
        });
        return false;
      } else if (result === RESULTS.DENIED) {
        // Permission was DENIED by user 
        return false;
      } else if (result === RESULTS.LIMITED) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error requesting permission: ${type}`, error);
      return false;
    }
  } else {
    console.log(`Permission '${type}' is not available on ${Platform.OS}`);
    return false;
  }
};

// Request only startup permissions (location and notification)
const requestStartupPermissions = async (): Promise<{
  location: boolean;
  backgroundLocation: boolean;
  notification: boolean;
}> => {
  const results = {
    location: false,
    backgroundLocation: false,
    notification: false,
  };

  // Request location permission
  results.location = await requestPermissions(PERMISSION_TYPE.location);
  
  if (results.location) {
    results.backgroundLocation = await requestPermissions(PERMISSION_TYPE.background_location);
  }

  // Request notification permission
  results.notification = await requestPermissions(PERMISSION_TYPE.notification);

  return results;
};

// Request on-demand permissions (phone call and physical activity)
const requestOnDemandPermissions = async (): Promise<{
  phoneCall: boolean;
  physicalActivity: boolean;
}> => {
  const results = {
    phoneCall: false,
    physicalActivity: false,
  };

  // Request phone call permission
  results.phoneCall = await requestPermissions(PERMISSION_TYPE.phone_call);

  // Request physical activity permission
  results.physicalActivity = await requestPermissions(PERMISSION_TYPE.physical_activity);

  console.log('On-demand permissions requested:', results);
  return results;
};


export { 
  checkPermissions, 
  requestPermissions, 
  requestStartupPermissions,
  requestOnDemandPermissions,
  PERMISSION_TYPE
};
