import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingSpinner({ color = '#FF6B35', size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
