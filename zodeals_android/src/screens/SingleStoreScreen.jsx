import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import Header from '../components/Header';
import DealCard from '../components/DealCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken } from '../utils/storage';
import { API_BASE_URL } from '../constants/api';

export default function SingleStoreScreen() {
  const route = useRoute();
  const { storeId, storelogo, name, description } = route.params;
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/store/${storeId}/deals`);
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
  }, [storeId]);

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
      {/* Store header */}
      <View style={styles.storeHeader}>
        {storelogo && (
          <Image
            source={{ uri: `${API_BASE_URL}${storelogo}` }}
            style={styles.storeLogo}
            contentFit="contain"
          />
        )}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{name}</Text>
          {description ? <Text style={styles.storeDesc} numberOfLines={2}>{description}</Text> : null}
          <Text style={styles.dealCount}>{deals.length} deals available</Text>
        </View>
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
        ListEmptyComponent={<Text style={styles.empty}>No deals found for this store.</Text>}
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
  storeHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F2F7',
  },
  storeLogo: { width: 64, height: 48, marginRight: 12 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 2 },
  storeDesc: { fontSize: 12, color: '#6B7280', lineHeight: 16, marginBottom: 4 },
  dealCount: { fontSize: 13, color: '#FF6B35', fontWeight: '700' },
  col: { flex: 1 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(15,27,53,0.5)', justifyContent: 'flex-end' },
});
