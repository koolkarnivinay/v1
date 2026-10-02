import React from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignInPrompt({ visible, onClose }) {
  const navigation = useNavigation();
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>Sign in Required</Text>
          <Text style={styles.subtitle}>
            Please login to your ZoDeals account to access this feature.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => { onClose(); navigation.navigate('Login'); }}
          >
            <Text style={styles.loginBtnText}>Login to ZoDeals</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Signup'); }}>
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up free</Text></Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(15,27,53,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 28,
    width: '85%', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 20,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 20, fontWeight: '900', color: '#0F1B35',
    marginBottom: 8, fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14, color: '#6B7280', textAlign: 'center',
    lineHeight: 20, marginBottom: 24,
  },
  loginBtn: {
    width: '100%', backgroundColor: '#FF6B35',
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginBottom: 14,
  },
  loginBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  signupText: { fontSize: 13, color: '#6B7280' },
  signupLink: { color: '#FF6B35', fontWeight: '800' },
});
