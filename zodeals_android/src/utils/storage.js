import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Secure storage (token, role) ──────────────────────────────
export const setToken = (token) => SecureStore.setItemAsync('token', token);
export const getToken = () => SecureStore.getItemAsync('token');
export const removeToken = () => SecureStore.deleteItemAsync('token');

export const setRole = (role) => SecureStore.setItemAsync('role', role);
export const getRole = () => SecureStore.getItemAsync('role');
export const removeRole = () => SecureStore.deleteItemAsync('role');

// ── Async storage (pincode, prefs) ────────────────────────────
export const setPinCode = (pin) => AsyncStorage.setItem('userPinCode', pin);
export const getPinCode = () => AsyncStorage.getItem('userPinCode');
export const removePinCode = () => AsyncStorage.removeItem('userPinCode');
