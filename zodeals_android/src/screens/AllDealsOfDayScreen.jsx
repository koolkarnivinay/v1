import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import DealCard from '../components/DealCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function AllDealsOfDayScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const r = await api.get('/products');
      if (Array.isArray(r.data?.result)) setProducts(r.data.result);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const ProductCard = ({ item }) => {
    const discount = item.discountPercentage || 0;
    const finalPrice = Math.round(item.price - (item.price * discount) / 100);
    return (
      <View style={styles.productCard}>
        <View style={[styles.imageArea, { backgroundColor: item.productBg || '#EEF2FF' }]}>
          {discount > 0 && (
            <View style={styles.pctBadge}><Text style={styles.pctText}>{discount}% OFF</Text></View>
          )}
          <Text style={{ fontSize: 52 }}>{item.productEmoji || '📦'}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title || item.description}</Text>
          {item.storeName ? <Text style={styles.storeName}>By {item.storeName}</Text> : null}
          <View style={styles.priceRow}>
            <Text style={styles.finalPrice}>₹{finalPrice?.toLocaleString('en-IN')}</Text>
            {discount > 0 && <Text style={styles.origPrice}>₹{item.price?.toLocaleString('en-IN')}</Text>}
          </View>
        </View>
      </View>
    );
  };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}><Header /><LoadingSpinner /></SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>🔥 Deals of the Day</Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.col}><ProductCard item={item} /></View>
        )}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProducts(); }} tintColor="#4361EE" />}
        ListEmptyComponent={<Text style={styles.empty}>No deals of the day found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  titleRow: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  col: { flex: 1 },
  productCard: {
    backgroundColor: '#fff', borderRadius: 16, margin: 6, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#EBEBEB',
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  imageArea: { height: 140, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  pctBadge: {
    position: 'absolute', bottom: 0, alignSelf: 'center',
    backgroundColor: '#4361EE', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6,
  },
  pctText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  productInfo: { padding: 10 },
  productTitle: { fontSize: 12, fontWeight: '700', color: '#111827', lineHeight: 17, marginBottom: 4 },
  storeName: { fontSize: 11, color: '#9CA3AF', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  finalPrice: { fontSize: 16, fontWeight: '900', color: '#111827' },
  origPrice: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
});
