import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { API_BASE_URL } from '../constants/api';

const EMOJI_FALLBACKS = {
  Electronics: '💻', Fashion: '👗', Food: '🍔', Beauty: '💄',
  Travel: '✈️', Health: '💊', Sports: '⚽', Home: '🏠',
};

export default function CategoryCard({ category, onPress }) {
  const imageUri = category.image ? `${API_BASE_URL}${category.image}` : null;
  const emoji = EMOJI_FALLBACKS[category.name] || '🏷️';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.iconWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="contain" />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center', marginRight: 12,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E8ECF4',
    paddingVertical: 12, paddingHorizontal: 14,
    minWidth: 80,
    shadowColor: '#0F1B35', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  iconWrap: { marginBottom: 6, justifyContent: 'center', alignItems: 'center' },
  image: { width: 36, height: 36 },
  emoji: { fontSize: 28 },
  name: { fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' },
});
