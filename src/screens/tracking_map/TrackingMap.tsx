import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { startBackgroundTracking } from '../../utils/tracking/trackingService';
import { resetDeliverySimulation } from '../../utils/delivery/deliverySimulation';
import { store } from '../../store/store';

const { width, height } = Dimensions.get('window');

const TrackingScreen = () => {
  const markerRef = useRef<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const deliveryState = store.getState().delivery;
  const start = deliveryState.startLocation;
  const end = deliveryState.endLocation;

  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: deliveryState.currentLocation.latitude,
      longitude: deliveryState.currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  );

  useEffect(() => {
    startBackgroundTracking();
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const delivery = store.getState().delivery;
      
      // Update completion state
      setIsCompleted(delivery.isCompleted);
      
      if (markerRef.current) {
        coordinate.timing({
          latitude: delivery.currentLocation.latitude,
          longitude: delivery.currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          duration: 1000,
        } as any).start();
      }
    });
    return () => unsubscribe();
  }, [coordinate]);

  const handleRestartDelivery = () => {
    resetDeliverySimulation();
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: start.latitude,
          longitude: start.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={start}
          title="Pickup Location"
          description="Kathmandu Durbar Square"
          pinColor="green"
        />

        <Marker
          coordinate={end}
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
          <Text style={styles.completedText}>🎉 Delivery Complete!</Text>
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
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  restartButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
