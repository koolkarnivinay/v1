import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // login | forgotEmail | forgotOtp | forgotReset
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields.'); return; }
    setLoading(true);
    try {
      const r = await api.post('/login', { email, password, role: 'user' }, { headers: { Authorization: undefined } });
      if (r.data?.status) {
        await login(r.data.result.token, r.data.result.role);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const r = await api.post('/email/code', { email: forgotEmail, tag: 'password', role: 'user' }, { headers: { Authorization: undefined } });
      if (r.data?.status) { setStep('forgotOtp'); Alert.alert('OTP Sent', 'Check your email.'); }
      else Alert.alert('Error', r.data?.displayMessage || 'Error sending OTP.');
    } catch { Alert.alert('Error', 'Could not send OTP.'); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const r = await api.post('/email/verify', { email: forgotEmail, code: Number(otp), tag: 'password' }, { headers: { Authorization: undefined } });
      if (r.data?.status) { setUserId(r.data.result); setStep('forgotReset'); }
      else Alert.alert('Error', 'Invalid OTP.');
    } catch { Alert.alert('Error', 'OTP verification failed.'); }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) { Alert.alert('Error', "Passwords don't match."); return; }
    setLoading(true);
    try {
      const r = await api.post('/forgot/password', { userId, password: newPassword }, { headers: { Authorization: undefined } });
      if (r.data?.status) { Alert.alert('Success', 'Password reset!'); setStep('login'); }
      else Alert.alert('Error', 'Failed to reset password.');
    } catch { Alert.alert('Error', 'Failed to reset password.'); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.headerBand}>
            <Text style={styles.logo}>ZoDeals</Text>
            <Text style={styles.tagline}>Save More. Shop Smart.</Text>
            <Text style={styles.tagSub}>Verified coupons & exclusive deals from 500+ top brands.</Text>
          </View>

          <View style={styles.card}>
            {step === 'login' && (
              <>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>Login to access exclusive deals.</Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)} style={styles.eyeBtn}>
                    <Text>{showPassword ? '🙈' : '👁'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setStep('forgotEmail')}>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Login to ZoDeals</Text>}
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.divider} /><Text style={styles.dividerText}>OR</Text><View style={styles.divider} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>Don't have an account? <Text style={styles.signupLinkBold}>Sign up free</Text></Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'forgotEmail' && (
              <>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter your registered email address.</Text>
                <Text style={styles.label}>Email Address</Text>
                <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="#9CA3AF"
                  value={forgotEmail} onChangeText={setForgotEmail} keyboardType="email-address" autoCapitalize="none" />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send OTP</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep('login')}>
                  <Text style={[styles.signupLink, { marginTop: 12 }]}>← Back to Login</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'forgotOtp' && (
              <>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>Enter the 6-digit OTP sent to your email.</Text>
                <TextInput style={[styles.input, { letterSpacing: 6, fontWeight: '800', textAlign: 'center' }]}
                  placeholder="_ _ _ _ _ _" placeholderTextColor="#9CA3AF" value={otp}
                  onChangeText={setOtp} keyboardType="numeric" maxLength={6} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify OTP</Text>}
                </TouchableOpacity>
              </>
            )}

            {step === 'forgotReset' && (
              <>
                <Text style={styles.title}>New Password</Text>
                <Text style={styles.subtitle}>Create a new secure password.</Text>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.input} placeholder="New password" placeholderTextColor="#9CA3AF"
                  value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput style={styles.input} placeholder="Confirm password" placeholderTextColor="#9CA3AF"
                  value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Reset Password</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F1B35' },
  scroll: { flexGrow: 1 },
  headerBand: { alignItems: 'center', padding: 40, paddingTop: 48 },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 8 },
  tagline: { fontSize: 22, fontWeight: '900', color: '#FF6B35', marginBottom: 6 },
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
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  eyeBtn: { padding: 10, backgroundColor: '#FAFBFD', borderRadius: 12, borderWidth: 1.5, borderColor: '#E8ECF4' },
  forgot: { color: '#FF6B35', fontWeight: '700', fontSize: 13, textAlign: 'right', marginBottom: 24 },
  primaryBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
    shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#E8ECF4' },
  dividerText: { color: '#9CA3AF', fontSize: 12 },
  signupLink: { textAlign: 'center', color: '#6B7280', fontSize: 13 },
  signupLinkBold: { color: '#FF6B35', fontWeight: '800' },
});
