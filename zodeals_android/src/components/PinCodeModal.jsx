import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, TextInput,
  StyleSheet, Pressable, Alert,
} from 'react-native';
import { setPinCode } from '../utils/storage';

export default function PinCodeModal({ visible, onClose, onPinSubmit }) {
  const [pin, setPin] = useState('');

  const handleSubmit = async () => {
    if (!pin || pin.trim().length < 6) {
      Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pin code.');
      return;
    }
    await setPinCode(pin.trim());
    onPinSubmit?.(pin.trim());
    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>📍 Set Your Pin Code</Text>
          <Text style={styles.subtitle}>
            We'll show you deals available in your area.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit pin code"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Apply Pin Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.skip}>Skip for now</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(15,27,53,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 28, paddingBottom: 40,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0F1B35', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 20 },
  input: {
    borderWidth: 1.5, borderColor: '#E8ECF4', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: '#111827', marginBottom: 16,
    backgroundColor: '#FAFBFD',
  },
  btn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  skip: { textAlign: 'center', color: '#9CA3AF', fontSize: 13 },
});
