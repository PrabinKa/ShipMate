import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from '../../screens/order_list/OrderListScreen';
import NewShipment from '../../screens/new_shipment/NewShipment';
import TrackingMap from '../../screens/tracking_map/TrackingMap';
import OrderDetails from '../../screens/order_detail/OrderDetails';

const Stack = createNativeStackNavigator();


const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name='NewShipment' component={NewShipment} />
      <Stack.Screen name='TrackingMap' component={TrackingMap} />
      <Stack.Screen name='OrderDetails' component={OrderDetails} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigator;