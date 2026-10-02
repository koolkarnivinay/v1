import React, { useRef, useState, useEffect } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity,
  StyleSheet, Dimensions, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../constants/api';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    id: 'deals',
    badge: '✨ Verified savings, every day',
    headline: 'Your shortcut to',
    accentText: 'better deals.',
    accentColor: '#FF6B35',
    subtitle: 'Explore handpicked offers, coupon codes and price drops.',
    ctaLabel: 'Explore Deals',
    ctaRoute: 'AllDeals',
    bg: '#FFF9E6',
    emoji: '🛒',
  },
  {
    id: 'fashion',
    badge: '👗 Latest fashion trends',
    headline: 'Dress to impress,',
    accentText: 'spend less.',
    accentColor: '#8B5CF6',
    subtitle: 'Exclusive fashion deals from top brands.',
    ctaLabel: 'Shop Fashion',
    ctaRoute: 'AllDeals',
    bg: '#F5F3FF',
    emoji: '👗',
  },
  {
    id: 'tech',
    badge: '⚡ Best tech deals today',
    headline: 'Power up with',
    accentText: 'epic tech deals.',
    accentColor: '#0EA5E9',
    subtitle: 'Latest gadgets at prices you won\'t find elsewhere.',
    ctaLabel: 'Shop Electronics',
    ctaRoute: 'AllDeals',
    bg: '#EFF6FF',
    emoji: '💻',
  },
];

const STATS = [
  { value: '5,000+', label: 'Live Deals' },
  { value: '500+', label: 'Top Brands' },
  { value: '100%', label: 'Verified' },
];

export default function BannerCarousel() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeIdx + 1) % SLIDES.length;
      scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
      setActiveIdx(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIdx]);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActiveIdx(idx);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.bg, width: SCREEN_W }]}>
            {/* Emoji hero */}
            <Text style={styles.heroEmoji}>{slide.emoji}</Text>

            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{slide.badge}</Text>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>
              {slide.headline}{' '}
              <Text style={[styles.accent, { color: slide.accentColor }]}>{slide.accentText}</Text>
            </Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              {STATS.map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* CTA */}
            <TouchableOpacity
              style={[styles.cta, { backgroundColor: slide.accentColor }]}
              onPress={() => navigation.navigate(slide.ctaRoute)}
            >
              <Text style={styles.ctaText}>{slide.ctaLabel} →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIdx && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative' },
  slide: {
    padding: 24, paddingTop: 32, paddingBottom: 48,
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 72, marginBottom: 12 },
  badge: {
    backgroundColor: '#0F1B35', borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  headline: {
    fontSize: 28, fontWeight: '900', color: '#0F1B35',
    textAlign: 'center', lineHeight: 34, marginBottom: 8,
  },
  accent: { fontWeight: '900' },
  subtitle: {
    fontSize: 14, color: '#4A5568', textAlign: 'center',
    lineHeight: 20, marginBottom: 20, paddingHorizontal: 16,
  },
  statsRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#0F1B35' },
  statLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  cta: {
    borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  ctaText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: -24, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(15,27,53,0.25)' },
  dotActive: { width: 24, backgroundColor: '#0F1B35' },
});
