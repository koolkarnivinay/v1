import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const r = await api.get('/categories');
      if (Array.isArray(r.data?.result)) setCategories(r.data.result);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>All Categories</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(c) => c._id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.col}>
            <CategoryCard
              category={item}
              onPress={() => navigation.navigate('SingleCategory', { name: item.name, categoryId: item._id })}
            />
          </View>
        )}
        contentContainerStyle={{ padding: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCategories(); }} tintColor="#FF6B35" />}
        ListEmptyComponent={<Text style={styles.empty}>No categories found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  titleRow: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  col: { flex: 1, margin: 6 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 60, fontSize: 14 },
});
