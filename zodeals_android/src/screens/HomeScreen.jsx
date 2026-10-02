import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, FlatList, TouchableOpacity,
  StyleSheet, Modal, RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import DealCard from '../components/DealCard';
import StoreCard from '../components/StoreCard';
import CategoryCard from '../components/CategoryCard';
import CouponDetailCard from '../components/CouponDetailCard';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getToken, getPinCode } from '../utils/storage';
import { API_BASE_URL } from '../constants/api';

// ── Dummy fallback data ──
const DUMMY_DEALS = [
  { _id: 'dd1', title: 'Amazon — Best offers this month', discountValue: 35, discountType: '%', viewCount: 1200 },
  { _id: 'dd2', title: 'Flipkart — Big Billion Days',     discountValue: 40, discountType: '%', viewCount: 980 },
  { _id: 'dd3', title: 'Myntra — End of Season Sale',    discountValue: 50, discountType: '%', viewCount: 2100 },
  { _id: 'dd4', title: 'Swiggy — Free delivery offer',   discountValue: null, discountType: '%', viewCount: 560 },
  { _id: 'dd5', title: 'Nykaa — Skincare Sale',          discountValue: 30, discountType: '%', viewCount: 870 },
  { _id: 'dd6', title: 'Zomato — Weekend Offer',         discountValue: 20, discountType: '%', viewCount: 430 },
];

const DUMMY_PRODUCTS = [
  { _id: 'dp1', title: 'pTron Bassbuds Surge TWS Gaming Earbuds', price: 3499, discountPercentage: 77, finalPrice: 799, storeName: 'Amazon', productEmoji: '🎧', productBg: '#EEF2FF' },
  { _id: 'dp2', title: 'Slim Fit Striped Casual Shirt', price: 1999, discountPercentage: 81, finalPrice: 379, storeName: 'Myntra', productEmoji: '👕', productBg: '#F0FFF4' },
  { _id: 'dp3', title: 'Laptop Sleeve Bag', price: 999, discountPercentage: 75, finalPrice: 246, storeName: 'Amazon', productEmoji: '💼', productBg: '#EEF2FF' },
  { _id: 'dp4', title: 'Women Leaf Print Straight Kurti', price: 599, discountPercentage: 49, finalPrice: 305, storeName: 'AJIO', productEmoji: '👗', productBg: '#FFF0F3' },
];

// ── Section Header ──
const SectionHeader = ({ title, emoji, onViewAll }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionLeft}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <TouchableOpacity onPress={onViewAll}>
      <Text style={styles.viewAll}>View All →</Text>
    </TouchableOpacity>
  </View>
);

// ── Product Card (Deals of Day) ──
const ProductCard = ({ item, onPress, isDummy }) => {
  const discount = item.discountPercentage || 0;
  const finalPrice = isDummy ? item.finalPrice : Math.round(item.price - (item.price * discount) / 100);
  return (
    <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.productImageArea, { backgroundColor: item.productBg || '#EEF2FF' }]}>
        {discount > 0 && (
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>{discount}% OFF</Text>
          </View>
        )}
        <Text style={styles.productEmoji}>{isDummy ? item.productEmoji : '📦'}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title || item.description}</Text>
        {item.storeName ? <Text style={styles.productStore}>By {item.storeName}</Text> : null}
        <View style={styles.priceRow}>
          <Text style={styles.finalPrice}>₹{finalPrice?.toLocaleString('en-IN')}</Text>
          {discount > 0 && <Text style={styles.origPrice}>₹{item.price?.toLocaleString('en-IN')}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ── Main HomeScreen ──
export default function HomeScreen() {
  const navigation = useNavigation();
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dealCounts, setDealCounts] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useDummyDeals, setUseDummyDeals] = useState(false);
  const [useDummyProducts, setUseDummyProducts] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const fetchAll = async () => {
    const pinCode = await getPinCode();
    const token = await getToken();

    // Fetch deals
    try {
      let url = `/home/deals`;
      if (pinCode && pinCode !== 'null') url += `?pinCode=${pinCode}`;
      const r = await api.get(url);
      const m = Array.isArray(r.data?.result?.matchedDeals) ? r.data.result.matchedDeals : [];
      const p = Array.isArray(r.data?.result?.panIndiaDeals) ? r.data.result.panIndiaDeals : [];
      const all = [...m, ...p];
      if (all.length > 0) { setDeals(all); setUseDummyDeals(false); }
      else setUseDummyDeals(true);
    } catch { setUseDummyDeals(true); }

    // Fetch products (Deals of Day)
    try {
      const r = await api.get('/products');
      const data = Array.isArray(r.data?.result) ? r.data.result : [];
      if (data.length > 0) { setProducts(data); setUseDummyProducts(false); }
      else setUseDummyProducts(true);
    } catch { setUseDummyProducts(true); }

    // Fetch stores
    try {
      let url = '/stores';
      const pinCode = await getPinCode();
      if (pinCode && pinCode !== 'null') url += `?pinCode=${pinCode}`;
      const r = await api.get(url);
      const matched = r.data?.result?.matchedStores || [];
      const panIndia = r.data?.result?.panIndiaStores || [];
      const storeList = matched.length > 0 ? matched : panIndia;
      setStores(storeList.slice(0, 15));

      // Fetch deal counts
      const counts = {};
      await Promise.allSettled(
        storeList.slice(0, 15).map(async (s) => {
          try {
            const res = await api.get(`/store/${s._id}/deals/count`);
            if (res.data?.result !== undefined) counts[s._id] = res.data.result;
          } catch {}
        })
      );
      setDealCounts(counts);
    } catch {}

    // Fetch categories
    try {
      const r = await api.get('/categories');
      if (Array.isArray(r.data?.result)) setCategories(r.data.result.slice(0, 20));
    } catch {}

    // Fetch wishlist
    if (token) {
      try {
        const r = await api.get('/user/wishlist');
        if (r.data?.result?.couponIds)
          setWishlist(r.data.result.couponIds.map((i) => i._id));
      } catch {}
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

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
    if (useDummyDeals) { navigation.navigate('AllDeals'); return; }
    const token = await getToken();
    if (!token) { setShowSignIn(true); return; }
    setSelectedCoupon(deal);
    setShowCouponModal(true);
  };

  const displayDeals = useDummyDeals ? DUMMY_DEALS : deals;
  const displayProducts = useDummyProducts ? DUMMY_PRODUCTS : products;

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <LoadingSpinner />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
      >
        {/* Hero Banner */}
        <BannerCarousel />

        {/* Top Deals */}
        <View style={styles.section}>
          <SectionHeader title="Top Deals" emoji="⚡" onViewAll={() => navigation.navigate('AllDeals')} />
          <FlatList
            data={displayDeals.slice(0, 10)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ width: 160 }}>
                <DealCard
                  deal={item}
                  isWishlisted={wishlist.includes(item._id)}
                  onPress={() => handleDealPress(item)}
                  onWishlistToggle={() => toggleWishlist(item._id)}
                />
              </View>
            )}
          />
        </View>

        {/* Top Stores */}
        {stores.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Top Stores" emoji="🏪" onViewAll={() => navigation.navigate('Stores')} />
            <FlatList
              data={stores}
              keyExtractor={(s) => s._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <StoreCard
                  store={item}
                  dealCount={dealCounts[item._id]}
                  onPress={() => navigation.navigate('SingleStore', {
                    storeId: item._id,
                    storelogo: item.logo,
                    name: item.name,
                    description: item.description,
                  })}
                />
              )}
              contentContainerStyle={{ paddingRight: 16 }}
            />
          </View>
        )}

        {/* Deals of the Day */}
        <View style={styles.section}>
          <SectionHeader title="Deals of the Day" emoji="🔥" onViewAll={() => navigation.navigate('AllDealsOfDay')} />
          <FlatList
            data={displayProducts.slice(0, 4)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                isDummy={useDummyProducts}
                onPress={() => useDummyProducts ? navigation.navigate('AllDeals') : null}
              />
            )}
          />
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Categories" emoji="🗂️" onViewAll={() => navigation.navigate('Categories')} />
            <FlatList
              data={categories}
              keyExtractor={(c) => c._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  onPress={() => navigation.navigate('SingleCategory', { name: item.name, categoryId: item._id })}
                />
              )}
              contentContainerStyle={{ paddingRight: 16 }}
            />
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Coupon modal */}
      <Modal visible={showCouponModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <CouponDetailCard
            coupon={selectedCoupon}
            onClose={() => setShowCouponModal(false)}
          />
        </View>
      </Modal>

      {/* Sign-in prompt */}
      <SignInPrompt visible={showSignIn} onClose={() => setShowSignIn(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  viewAll: { fontSize: 13, color: '#FF6B35', fontWeight: '700' },
  productCard: {
    width: 180, backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#EBEBEB', overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  productImageArea: {
    height: 140, justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  pctBadge: {
    position: 'absolute', bottom: 0, alignSelf: 'center',
    backgroundColor: '#4361EE', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 6,
  },
  pctText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  productEmoji: { fontSize: 56 },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 13, fontWeight: '700', color: '#111827', lineHeight: 18, marginBottom: 4 },
  productStore: { fontSize: 11, color: '#9CA3AF', marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  finalPrice: { fontSize: 16, fontWeight: '900', color: '#111827' },
  origPrice: { fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(15,27,53,0.5)',
    justifyContent: 'flex-end',
  },
});
