import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import type { Permission } from 'react-native-permissions';

type PermissionType = keyof typeof REQUEST_PERMISSION_TYPE;

interface PlatformPermissions {
  ios: string | null;
  android: string;
}

// iOS uses "when in use" for initial permission, then "always" for background
const PLATFORM_ACCESS_LOCATION: PlatformPermissions = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const PLATFORM_ACCESS_BACKGROUND_LOCATION: PlatformPermissions = {
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
};

const REQUEST_PERMISSION_TYPE = {
  location: PLATFORM_ACCESS_LOCATION,
  background_location: PLATFORM_ACCESS_BACKGROUND_LOCATION,
};

const PERMISSION_TYPE = {
  location: 'location',
  background_location: 'background_location',
} as const;

const checkPermissions = async (type: PermissionType): Promise<boolean> => {
  const permission = REQUEST_PERMISSION_TYPE[type];

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const perm = permission[Platform.OS];
    
    if (!perm) {
      console.warn(`Permission '${type}' is not available on ${Platform.OS}`);
      return false;
    }

    try {
      const result = await check(perm as Permission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.DENIED) {
        return requestPermissions(type);
      } else if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        console.warn(
          `Permission '${type}' was blocked, user must enable it manually.`,
        );
        return requestPermissions(type);
      }
      return false;
    } catch (error) {
      console.error(`Error checking permission: ${type}`, error);
      return false;
    }
  } else {
    console.log(`Permission '${type}' is not available on ${Platform.OS}`);
    return false;
  }
};

const requestPermissions = async (type: PermissionType): Promise<boolean> => {
  const permission = REQUEST_PERMISSION_TYPE[type];

  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    const perm = permission[Platform.OS];
    
    if (!perm) {
      console.warn(`Permission '${type}' is not available on ${Platform.OS}`);
      return false;
    }

    try {
      const result = await request(perm as Permission);

      console.log('RESULT AFTER PERMISSION REQUEST:', result);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.BLOCKED) {
        console.warn(`Permission '${type}' was blocked, open settings.`);
        return false;
      } else if (result === RESULTS.DENIED) {
        console.warn(`Permission '${type}' was denied by user.`);
        return false;
      } else if (result === RESULTS.LIMITED) {
        // iOS limited access - still usable
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


export { 
  checkPermissions, 
  requestPermissions, 
  PERMISSION_TYPE
};
