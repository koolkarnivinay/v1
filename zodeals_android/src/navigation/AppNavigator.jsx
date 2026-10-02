import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AllDealsScreen from '../screens/AllDealsScreen';
import AllDealsOfDayScreen from '../screens/AllDealsOfDayScreen';
import SingleStoreScreen from '../screens/SingleStoreScreen';
import SingleCategoryScreen from '../screens/SingleCategoryScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { InfoScreen } from '../screens/InfoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main tabs */}
      <Stack.Screen name="Main" component={TabNavigator} />

      {/* Deal screens */}
      <Stack.Screen name="AllDeals" component={AllDealsScreen} />
      <Stack.Screen name="AllDealsOfDay" component={AllDealsOfDayScreen} />
      <Stack.Screen name="SingleStore" component={SingleStoreScreen} />
      <Stack.Screen name="SingleCategory" component={SingleCategoryScreen} />

      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* Notifications */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      {/* Info / footer pages */}
      <Stack.Screen name="AboutUs" component={InfoScreen} />
      <Stack.Screen name="Terms" component={InfoScreen} />
      <Stack.Screen name="Privacy" component={InfoScreen} />
      <Stack.Screen name="FAQs" component={InfoScreen} />
      <Stack.Screen name="RefundPolicy" component={InfoScreen} />
      <Stack.Screen name="ProductPricing" component={InfoScreen} />
      <Stack.Screen name="AgentContact" component={InfoScreen} />
    </Stack.Navigator>
  );
}
