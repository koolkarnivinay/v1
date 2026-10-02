import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SignInPrompt from '../components/SignInPrompt';
import api from '../services/api';
import { getToken, getRole, removeToken, removeRole } from '../utils/storage';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '', profile: '', phoneNumber: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const role = await getRole();
      if (!token || role !== 'user') { setNotLoggedIn(true); setLoading(false); return; }
      try {
        const r = await api.get('/profile');
        const data = r.data?.result;
        if (data?._id) {
          setProfileData({ name: data.name || '', email: data.email || '', profile: data.profile || '', phoneNumber: data.phoneNumber || '' });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission required', 'Please allow photo access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      setImageFile(result.assets[0]);
      setProfileData((p) => ({ ...p, profile: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phoneNumber', profileData.phoneNumber);
      if (imageFile) {
        formData.append('profile', { uri: imageFile.uri, name: 'profile.jpg', type: 'image/jpeg' });
      }
      await api.patch('/user', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Success', 'Profile updated successfully!');
      setEditMode(false);
      setImageFile(null);
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); navigation.reset({ index: 0, routes: [{ name: 'Main' }] }); } },
    ]);
  };

  if (loading) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header /><LoadingSpinner />
    </SafeAreaView>
  );

  if (notLoggedIn) return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <View style={styles.center}>
        <Text style={styles.lockEmoji}>👤</Text>
        <Text style={styles.lockTitle}>Login to view your profile</Text>
        <Text style={styles.lockSub}>Manage your account, wishlist and more.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Login to ZoDeals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const avatarUri = imageFile
    ? profileData.profile
    : profileData.profile ? `${API_BASE_URL}${profileData.profile}` : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={editMode ? pickImage : undefined}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{profileData.name?.[0]?.toUpperCase() || '?'}</Text>
              </View>
            )}
            {editMode && (
              <View style={styles.cameraOverlay}>
                <Text style={{ fontSize: 18 }}>📷</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{profileData.name || 'ZoDeals User'}</Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
        </View>

        {/* Fields */}
        <View style={styles.form}>
          {['name', 'email', 'phoneNumber'].map((field) => (
            <View key={field} style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>
                {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Mobile Number'}
              </Text>
              <TextInput
                style={[styles.fieldInput, !editMode && styles.fieldInputDisabled]}
                value={profileData[field]}
                editable={editMode}
                onChangeText={(v) => setProfileData((p) => ({ ...p, [field]: v }))}
                keyboardType={field === 'phoneNumber' ? 'numeric' : field === 'email' ? 'email-address' : 'default'}
                maxLength={field === 'phoneNumber' ? 10 : undefined}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {!editMode ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
              <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditMode(false); setImageFile(null); }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  lockEmoji: { fontSize: 52, marginBottom: 12 },
  lockTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  lockSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  loginBtn: { backgroundColor: '#FF6B35', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  loginBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  avatarSection: { alignItems: 'center', marginBottom: 28, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarFallback: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { fontSize: 40, color: '#fff', fontWeight: '900' },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#fff', borderRadius: 20, padding: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  userName: { fontSize: 20, fontWeight: '900', color: '#0F1B35', marginTop: 10 },
  userEmail: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  form: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, gap: 16 },
  fieldWrap: {},
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  fieldInput: {
    borderWidth: 1.5, borderColor: '#E8ECF4', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111827',
    backgroundColor: '#FAFBFD',
  },
  fieldInputDisabled: { backgroundColor: '#F5F7FA', color: '#6B7280' },
  actions: { gap: 12 },
  editBtn: {
    backgroundColor: '#0F1B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  editBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  editActions: { gap: 10 },
  saveBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  cancelBtn: {
    borderWidth: 1.5, borderColor: '#E8ECF4', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff',
  },
  cancelBtnText: { color: '#374151', fontWeight: '700', fontSize: 15 },
  logoutBtn: {
    borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  logoutBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
});
