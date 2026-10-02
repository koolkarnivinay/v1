import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SignInPrompt from '../components/SignInPrompt';
import api from '../services/api';
import { getToken } from '../utils/storage';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const fetchNotifications = async () => {
    const token = await getToken();
    if (!token) { setNotLoggedIn(true); setLoading(false); return; }
    try {
      const r = await api.get('/user/notifications');
      if (Array.isArray(r.data?.result)) setNotifications(r.data.result);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  if (notLoggedIn) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.center}>
        <Text style={styles.emoji}>🔔</Text>
        <Text style={styles.title}>Login to see notifications</Text>
        <Text style={styles.sub}>Get alerted about new deals in your area.</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.titleRow}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => (
          <View style={styles.notifCard}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifBody}>
              <Text style={styles.notifTitle}>{item.title || 'New Deal'}</Text>
              <Text style={styles.notifMessage}>{item.message || item.description}</Text>
              {item.createdAt && (
                <Text style={styles.notifTime}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotifications(); }} tintColor="#FF6B35" />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emoji}>📭</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.sub}>Check back later for deal alerts.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  titleRow: { paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: '900', color: '#111827' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emoji: { fontSize: 52, marginBottom: 12 },
  sub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  notifCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 10, gap: 12,
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  notifIcon: { fontSize: 24 },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  notifMessage: { fontSize: 13, color: '#4A5568', lineHeight: 18 },
  notifTime: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
});
