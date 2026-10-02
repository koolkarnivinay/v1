import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Clipboard, Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '../constants/api';

/**
 * CouponDetailCard — full-screen coupon reveal card (used in Modal)
 * Props: coupon, onClose
 */
export default function CouponDetailCard({ coupon, onClose }) {
  if (!coupon) return null;

  const logoUri = coupon.logo ? `${API_BASE_URL}${coupon.logo}` : null;

  const handleCopyCode = () => {
    if (coupon.couponCode) {
      Clipboard.setString(coupon.couponCode);
      Alert.alert('Copied!', `Code "${coupon.couponCode}" copied to clipboard.`);
    }
  };

  const handleVisitStore = () => {
    if (coupon.link) {
      import('react-native').then(({ Linking }) => Linking.openURL(coupon.link));
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {logoUri ? (
          <Image source={{ uri: logoUri }} style={styles.logo} contentFit="contain" />
        ) : (
          <Text style={styles.logoEmoji}>🏷️</Text>
        )}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Deal info */}
      <Text style={styles.title}>{coupon.title}</Text>
      {coupon.description ? (
        <Text style={styles.description}>{coupon.description}</Text>
      ) : null}

      {/* Discount */}
      {coupon.discountValue ? (
        <View style={styles.discountRow}>
          <Text style={styles.discountLabel}>
            {coupon.discountValue}{coupon.discountType === 'Flat' ? ' OFF' : '% OFF'}
          </Text>
        </View>
      ) : null}

      {/* Coupon code */}
      {coupon.couponCode ? (
        <TouchableOpacity style={styles.codeBox} onPress={handleCopyCode}>
          <Text style={styles.codeLabel}>COUPON CODE</Text>
          <Text style={styles.code}>{coupon.couponCode}</Text>
          <Text style={styles.tapCopy}>Tap to copy</Text>
        </TouchableOpacity>
      ) : null}

      {/* CTA */}
      <TouchableOpacity style={styles.visitBtn} onPress={handleVisitStore}>
        <Text style={styles.visitText}>Visit Store & Get Deal →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    margin: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 12,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logo: { width: 80, height: 48 },
  logoEmoji: { fontSize: 36 },
  closeBtn: { padding: 6 },
  closeText: { fontSize: 18, color: '#6B7280' },
  title: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8, lineHeight: 22 },
  description: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 12 },
  discountRow: {
    backgroundColor: '#FFF0EA', borderRadius: 10, paddingVertical: 8,
    paddingHorizontal: 14, alignSelf: 'flex-start', marginBottom: 16,
  },
  discountLabel: { fontSize: 18, fontWeight: '900', color: '#FF6B35' },
  codeBox: {
    borderWidth: 2, borderColor: '#FF6B35', borderStyle: 'dashed',
    borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20,
    backgroundColor: '#FFF9F7',
  },
  codeLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  code: { fontSize: 22, fontWeight: '900', color: '#FF6B35', letterSpacing: 3 },
  tapCopy: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  visitBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  visitText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
