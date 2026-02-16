import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { useSelector } from 'react-redux';
import { startBackgroundTracking } from '../../utils/tracking/trackingService';
import { resetDeliverySimulation } from '../../utils/delivery/deliverySimulation';
import { RootState } from '../../store/store';
import { getFontSize, rSpacing } from '../../utils';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const TrackingScreen = () => {
  const markerRef = useRef<any>(null);
  
  const delivery = useSelector((state: RootState) => state.delivery);
  const { startLocation, endLocation, currentLocation, isCompleted } = delivery;

  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: startLocation.latitude,
      longitude: startLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  );

  useEffect(() => {
    startBackgroundTracking();
  }, []);

  // Update marker position when currentLocation changes
  useEffect(() => {
    if (markerRef.current && currentLocation) {
      coordinate.timing({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        duration: 500,
      } as any).start();
    }
  }, [currentLocation, coordinate]);

  const handleRestartDelivery = () => {
    resetDeliverySimulation();
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={startLocation}
          title="Pickup Location"
          description="Kathmandu Durbar Square"
          pinColor="green"
        />

        <Marker
          coordinate={endLocation}
          title="Delivery Location"
          description="Patan"
          pinColor="red"
        />

        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate as any}
          title="Delivery Vehicle"
        />
      </MapView>

      {isCompleted && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>Delivery Completed!</Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={handleRestartDelivery}
          >
            <Text style={styles.restartButtonText}>Restart Delivery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: width,
    height: height,
  },
  completedContainer: {
    position: 'absolute',
    bottom: rSpacing(50),
    left: rSpacing(20),
    right: rSpacing(20),
    backgroundColor: colors.blueLight,
    borderRadius: 12,
    padding: rSpacing(20),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completedText: {
    color: colors.blueDark,
    fontSize: getFontSize(18),
    fontWeight: 'bold',
    marginBottom: rSpacing(15),
  },
  restartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: rSpacing(24),
    paddingVertical: rSpacing(12),
    borderRadius: 8,
  },
  restartButtonText: {
    color: colors.blueDark,
    fontSize: getFontSize(14),
    fontWeight: '600',
  },
});
