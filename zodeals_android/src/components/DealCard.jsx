import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '../constants/api';

// Brand colors
export const BRAND = {
  primary: '#FF6B35',
  dark: '#0F1B35',
  bg: '#F5F7FA',
  card: '#fff',
  border: '#E8ECF4',
};

/**
 * DealCard — used on Home (TopDeals), AllDeals, Favorites screens
 * Props: deal, onPress, isWishlisted, onWishlistToggle
 */
export default function DealCard({ deal, onPress, isWishlisted, onWishlistToggle }) {
  const pct = deal.discountValue
    ? `${deal.discountValue}${deal.discountType === 'Flat' ? ' OFF' : '% OFF'}`
    : 'DEAL';

  const logoUri = deal.logo ? `${API_BASE_URL}${deal.logo}` : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image area */}
      <View style={styles.imageArea}>
        {/* Discount badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>⚡ {pct}</Text>
        </View>

        {/* Wishlist button */}
        <TouchableOpacity style={styles.wishBtn} onPress={onWishlistToggle}>
          <Text style={{ fontSize: 16 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Store logo */}
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={styles.logo}
            contentFit="contain"
          />
        ) : (
          <Text style={styles.emojiLogo}>🏷️</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{deal.title}</Text>
        <Text style={styles.views}>👁 {deal.viewCount >= 1000 ? `${(deal.viewCount / 1000).toFixed(1)}k` : deal.viewCount || 0} views</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.ctaBtn} onPress={onPress}>
        <Text style={styles.ctaText}>Get Deal →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#E8ECF4',
    overflow: 'hidden', margin: 6,
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  imageArea: {
    backgroundColor: '#FAFBFD', minHeight: 100,
    justifyContent: 'center', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#F0F2F7',
    position: 'relative', padding: 16,
  },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#FF6B35', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  wishBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: '#fff', borderRadius: 10,
    padding: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  logo: { width: 64, height: 46 },
  emojiLogo: { fontSize: 36 },
  content: { padding: 10, flex: 1 },
  title: { fontWeight: '700', fontSize: 12, color: '#111827', lineHeight: 17 },
  views: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  ctaBtn: {
    margin: 10, marginTop: 4, backgroundColor: '#FF6B35',
    borderRadius: 10, paddingVertical: 8, alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
