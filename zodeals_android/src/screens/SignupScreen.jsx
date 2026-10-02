import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({ fullname: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // form | otp
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!form.email) { Alert.alert('Error', 'Please enter your email first.'); return; }
    setLoading(true);
    try {
      const r = await api.post('/email/code', { email: form.email, tag: 'register', role: 'user' }, { headers: { Authorization: undefined } });
      if (r.data?.status || r.status === 200) { setStep('otp'); Alert.alert('OTP Sent', 'Check your email for the OTP.'); }
      else Alert.alert('Error', r.data?.displayMessage || 'Could not send OTP.');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.displayMessage || 'Network error.');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) { Alert.alert('Error', "Passwords don't match."); return; }
    setLoading(true);
    try {
      const r = await api.post('/register', {
        name: form.fullname,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        otp: Number(otp),
        role: 'user',
      }, { headers: { Authorization: undefined } });
      if (r.data?.status) {
        Alert.alert('Success!', 'Account created. Please login.', [
          { text: 'Login Now', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', r.data?.displayMessage || 'Signup failed.');
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.displayMessage || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.headerBand}>
            <Text style={styles.logo}>ZoDeals</Text>
            <Text style={styles.tagline}>Join the Savings Club</Text>
            <Text style={styles.tagSub}>Create a free account & start saving today.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create Account 🎉</Text>
            <Text style={styles.subtitle}>Fill in your details to get started.</Text>

            {/* Fields */}
            {[
              { key: 'fullname', label: 'Full Name', placeholder: 'Enter your full name' },
              { key: 'email', label: 'Email Address', placeholder: 'Enter your email', keyboardType: 'email-address', autoCapitalize: 'none' },
              { key: 'phoneNumber', label: 'Mobile Number', placeholder: '10-digit mobile number', keyboardType: 'numeric', maxLength: 10 },
              { key: 'password', label: 'Password', placeholder: 'Create a password', secureTextEntry: true },
              { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Repeat your password', secureTextEntry: true },
            ].map(({ key, label, ...rest }) => (
              <View key={key}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={rest.placeholder}
                  placeholderTextColor="#9CA3AF"
                  value={form[key]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                  {...rest}
                />
              </View>
            ))}

            {/* OTP section */}
            {step === 'otp' && (
              <View>
                <Text style={styles.label}>OTP</Text>
                <TextInput
                  style={[styles.input, { letterSpacing: 6, fontWeight: '800', textAlign: 'center' }]}
                  placeholder="_ _ _ _ _ _"
                  placeholderTextColor="#9CA3AF"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            )}

            {step === 'form' ? (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send OTP & Continue</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>
                Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F1B35' },
  scroll: { flexGrow: 1 },
  headerBand: { alignItems: 'center', padding: 32, paddingTop: 40 },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 8 },
  tagline: { fontSize: 20, fontWeight: '900', color: '#FF6B35', marginBottom: 6 },
  tagSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 18 },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, flex: 1, padding: 28 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F1B35', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E8ECF4', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111827',
    backgroundColor: '#FAFBFD', marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20, marginTop: 4,
    shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  loginLink: { textAlign: 'center', color: '#6B7280', fontSize: 13 },
  loginLinkBold: { color: '#FF6B35', fontWeight: '800' },
});
