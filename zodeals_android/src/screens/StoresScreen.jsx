import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import StoreCard from '../components/StoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { getPinCode } from '../utils/storage';

export default function StoresScreen() {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [dealCounts, setDealCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStores = async () => {
    try {
      const pinCode = await getPinCode();
      let url = '/stores';
      if (pinCode && pinCode !== 'null') url += `?pinCode=${pinCode}`;
      const r = await api.get(url);
      const matched = r.data?.result?.matchedStores || [];
      const panIndia = r.data?.result?.panIndiaStores || [];
      const list = matched.length > 0 ? matched : panIndia;
      setStores(list);

      const counts = {};
      await Promise.allSettled(list.slice(0, 30).map(async (s) => {
        try {
          const res = await api.get(`/store/${s._id}/deals/count`);
          if (res.data?.result !== undefined) counts[s._id] = res.data.result;
        } catch {}
      }));
      setDealCounts(counts);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchStores(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchStores(); };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>All Stores</Text>
        <Text style={styles.count}>{stores.length} stores</Text>
      </View>
      <FlatList
        data={stores}
        keyExtractor={(s) => s._id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.col}>
            <StoreCard
              store={item}
              dealCount={dealCounts[item._id]}
              onPress={() => navigation.navigate('SingleStore', {
                storeId: item._id, storelogo: item.logo,
                name: item.name, description: item.description,
              })}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />}
        ListEmptyComponent={<Text style={styles.empty}>No stores found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  count: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
  col: { flex: 1, margin: 4 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
});
