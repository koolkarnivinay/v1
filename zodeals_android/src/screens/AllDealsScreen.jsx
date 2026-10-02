import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, Modal,
  RefreshControl, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import DealCard from '../components/DealCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken, getPinCode } from '../utils/storage';

export default function AllDealsScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [error, setError] = useState(null);

  const fetchDeals = useCallback(async () => {
    try {
      const pinCode = await getPinCode();
      let url = '/home/deals';
      if (pinCode && pinCode !== 'null') url += `?pinCode=${pinCode}`;
      const r = await api.get(url);
      const m = Array.isArray(r.data?.result?.matchedDeals) ? r.data.result.matchedDeals : [];
      const p = Array.isArray(r.data?.result?.panIndiaDeals) ? r.data.result.panIndiaDeals : [];
      setDeals([...m, ...p]);
      setError(null);
    } catch (e) {
      setError('Failed to load deals. Pull to refresh.');
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          const r = await api.get('/user/wishlist');
          if (r.data?.result?.couponIds)
            setWishlist(r.data.result.couponIds.map((i) => i._id));
        } catch {}
      }
      fetchDeals();
    })();
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchDeals(); };

  const toggleWishlist = async (id) => {
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    const has = wishlist.includes(id);
    try {
      if (has) {
        await api.delete(`/user/wishlist/${id}`);
        setWishlist((p) => p.filter((x) => x !== id));
      } else {
        await api.post('/user/wishlist', { couponId: id });
        setWishlist((p) => [...p, id]);
      }
    } catch {}
  };

  const handleDealPress = async (deal) => {
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    setSelectedCoupon(deal);
    setShowCouponModal(true);
  };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <LoadingSpinner />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>All Deals</Text>
        <Text style={styles.count}>{deals.length} deals</Text>
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.col}>
              <DealCard
                deal={item}
                isWishlisted={wishlist.includes(item._id)}
                onPress={() => handleDealPress(item)}
                onWishlistToggle={() => toggleWishlist(item._id)}
              />
            </View>
          )}
          contentContainerStyle={{ padding: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
          ListEmptyComponent={<Text style={styles.empty}>No deals available for your area.</Text>}
        />
      )}

      <Modal visible={showCouponModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <CouponDetailCard coupon={selectedCoupon} onClose={() => setShowCouponModal(false)} />
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
  error: { textAlign: 'center', color: '#EF4444', marginTop: 40, fontSize: 14 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,27,53,0.5)', justifyContent: 'flex-end' },
});
