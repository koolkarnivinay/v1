import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import DealCard from '../components/DealCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function FavoritesScreen() {
  const [deals, setDeals] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) { setNotLoggedIn(true); setLoading(false); return; }
      try {
        const r = await api.get('/user/wishlist');
        const ids = r.data?.result?.couponIds || [];
        setDeals(ids);
        setWishlist(ids.map((i) => i._id));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleRemove = async (id) => {
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    try {
      await api.delete(`/user/wishlist/${id}`);
      setDeals((p) => p.filter((d) => d._id !== id));
      setWishlist((p) => p.filter((x) => x !== id));
    } catch {}
  };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  if (notLoggedIn) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.center}>
        <Text style={styles.lockEmoji}>🔒</Text>
        <Text style={styles.title}>Login to see your favorites</Text>
        <Text style={styles.sub}>Save deals you love and access them anytime.</Text>
      </View>
      <SignInPrompt visible={showSignIn} onClose={() => setShowSignIn(false)} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.count}>{deals.length} saved</Text>
      </View>
      <FlatList
        data={deals}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.col}>
            <DealCard
              deal={item}
              isWishlisted={true}
              onPress={() => { setSelectedCoupon(item); setShowCoupon(true); }}
              onWishlistToggle={() => handleRemove(item._id)}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>❤️</Text>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.sub}>Tap the heart on any deal to save it here.</Text>
          </View>
        }
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  lockEmoji: { fontSize: 52, marginBottom: 12 },
  emptyEmoji: { fontSize: 52, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  sub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(15,27,53,0.5)', justifyContent: 'flex-end' },
});
