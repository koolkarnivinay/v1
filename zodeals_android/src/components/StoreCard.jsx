import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '../constants/api';

export default function StoreCard({ store, dealCount, onPress }) {
  const logoUri = store.logo ? `${API_BASE_URL}${store.logo}` : null;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.logoWrap}>
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.logo} contentFit="contain" />
        ) : (
          <Text style={{ fontSize: 28 }}>🏪</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{store.name}</Text>
        <Text style={styles.deals}>{dealCount != null ? `${dealCount} Deals` : 'View Deals'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#EBEBEB',
    paddingHorizontal: 12, paddingVertical: 10,
    marginRight: 10, minWidth: 160, maxWidth: 200,
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  logoWrap: {
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  logo: { width: 40, height: 36 },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: '700', color: '#111827' },
  deals: { fontSize: 12, color: '#FF6B35', fontWeight: '600', marginTop: 2 },
});
