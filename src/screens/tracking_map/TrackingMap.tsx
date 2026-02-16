import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { startBackgroundTracking } from '../../utils/tracking/trackingService';
import { store } from '../../store/store';

const { width, height } = Dimensions.get('window');

const TrackingScreen = () => {
  const markerRef = useRef<any>(null);

  // Get start and end locations from Redux
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

  // Start background tracking only once
  useEffect(() => {
    startBackgroundTracking();
  }, []);

  // Subscribe to delivery progress updates from Redux
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const delivery = store.getState().delivery;
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
});
