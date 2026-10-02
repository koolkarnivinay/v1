import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSearch } from '../context/SearchContext';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import PinCodeModal from './PinCodeModal';

export default function Header() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { searchQuery, setSearchQuery } = useSearch();
  const { pinModalVisible, openPinModal, closePinModal } = useModal();
  const { isLoggedIn } = useAuth();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F1B35" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {/* Logo + pin */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Text style={styles.logo}>ZoDeals</Text>
          </TouchableOpacity>
          <View style={styles.topRight}>
            {isLoggedIn && (
              <TouchableOpacity style={styles.pinBtn} onPress={openPinModal}>
                <Text style={styles.pinText}>📍 Pin</Text>
              </TouchableOpacity>
            )}
            {isLoggedIn ? (
              <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                <Text style={styles.icon}>🔔</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals, stores, coupons..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={{ color: '#9CA3AF', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PinCodeModal
        visible={pinModalVisible}
        onClose={closePinModal}
        onPinSubmit={() => closePinModal()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0F1B35', paddingHorizontal: 16, paddingBottom: 14,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pinBtn: {
    backgroundColor: 'rgba(255,107,53,0.2)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  pinText: { color: '#FF6B35', fontSize: 12, fontWeight: '700' },
  icon: { fontSize: 22 },
  loginBtn: {
    backgroundColor: '#FF6B35', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  loginText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', height: 40 },
  clearBtn: { padding: 4 },
});
