import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StoresScreen from '../screens/StoresScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  Stores: '🏪',
  Categories: '🗂️',
  Favorites: '❤️',
  Profile: '👤',
};

function TabIcon({ name, focused }) {
  return (
    <View style={focused ? styles.activeTab : styles.tab}>
      <Text style={styles.icon}>{TAB_ICONS[name]}</Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.label, focused && styles.labelActive]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#F0F2F7',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
    shadowColor: '#0F1B35',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  tab: { alignItems: 'center', justifyContent: 'center' },
  activeTab: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF0EA', borderRadius: 10,
    width: 40, height: 30,
  },
  icon: { fontSize: 20 },
  label: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  labelActive: { color: '#FF6B35', fontWeight: '700' },
});
