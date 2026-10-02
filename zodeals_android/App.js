import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { SearchProvider } from './src/context/SearchContext';
import { ModalProvider } from './src/context/ModalContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <SearchProvider>
            <ModalProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
              <Toast />
            </ModalProvider>
          </SearchProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
