import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import DealCard from '../components/DealCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function SingleCategoryScreen() {
  const route = useRoute();
  const { name, categoryId } = route.params;
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/category/${encodeURIComponent(name)}/deals`);
        if (Array.isArray(r.data?.result)) setDeals(r.data.result);
      } catch {}
      const token = await getToken();
      if (token) {
        try {
          const r = await api.get('/user/wishlist');
          if (r.data?.result?.couponIds)
            setWishlist(r.data.result.couponIds.map((i) => i._id));
        } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const toggleWishlist = async (id) => {
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    const has = wishlist.includes(id);
    if (has) {
      await api.delete(`/user/wishlist/${id}`);
      setWishlist((p) => p.filter((x) => x !== id));
    } else {
      await api.post('/user/wishlist', { couponId: id });
      setWishlist((p) => [...p, id]);
    }
  };

  const handlePress = async (deal) => {
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    setSelectedCoupon(deal);
    setShowCoupon(true);
  };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.count}>{deals.length} deals</Text>
      </View>
      <FlatList
        data={deals}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.col}>
            <DealCard deal={item} isWishlisted={wishlist.includes(item._id)}
              onPress={() => handlePress(item)} onWishlistToggle={() => toggleWishlist(item._id)} />
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={styles.empty}>No deals found in this category.</Text>}
      />
      <Modal visible={showCoupon} animationType="slide" transparent>
        <View style={styles.overlay}>
          <CouponDetailCard coupon={selectedCoupon} onClose={() => setShowCoupon(false)} />
        </View>
      </Modal>
      <SignInPrompt visible={showSignIn} onClose={() => setShowSignIn(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  count: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  col: { flex: 1 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(15,27,53,0.5)', justifyContent: 'flex-end' },
});
