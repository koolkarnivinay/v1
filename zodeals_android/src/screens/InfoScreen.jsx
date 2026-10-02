import React from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const INFO_SCREENS = {
  AboutUs: {
    title: 'About Us',
    emoji: '🏢',
    content: `ZoDeals is India's leading deals and coupons platform helping millions of shoppers save money every day.\n\nWe partner with 500+ top brands to bring you verified deals, exclusive coupon codes, and price-drop alerts — all in one place.\n\nOur mission is simple: help you save more, shop smarter.\n\nFounded with a passion for savings, ZoDeals has grown to become the most trusted deals platform in India, with thousands of verified offers updated daily.`,
  },
  Terms: {
    title: 'Terms & Conditions',
    emoji: '📋',
    content: `By using ZoDeals, you agree to these terms:\n\n1. ZoDeals is a deals aggregator platform.\n2. We do not guarantee the availability of any deal.\n3. Prices and discounts are subject to change without notice.\n4. Users must be 18 years or older.\n5. ZoDeals is not responsible for transactions made through third-party websites.\n6. All deals are verified to the best of our ability but may expire.\n7. User accounts are personal and non-transferable.\n8. We reserve the right to modify these terms at any time.\n\nFor full terms, visit zodeals.in/Terms-and-conditions`,
  },
  Privacy: {
    title: 'Privacy Policy',
    emoji: '🔒',
    content: `Your privacy matters to us.\n\nInformation we collect:\n• Name, email, phone number (on registration)\n• Pincode (for local deal discovery)\n• Usage data (to improve our service)\n\nHow we use it:\n• To personalize your deal feed\n• To send relevant notifications\n• To improve our platform\n\nWe do not sell your data to third parties.\n\nYou can request deletion of your data by contacting support@zodeals.in\n\nFor our full privacy policy, visit zodeals.in/privacy-policy`,
  },
  FAQs: {
    title: 'FAQs',
    emoji: '❓',
    faqs: [
      { q: 'How do I use a coupon code?', a: 'Tap "Get Deal", copy the coupon code, and paste it at checkout on the store website.' },
      { q: 'Are all deals verified?', a: 'Yes! Our team verifies deals daily. However, some may expire — always check the expiry date.' },
      { q: 'How does pin code filtering work?', a: 'Set your pin code to see deals available specifically in your area alongside pan-India deals.' },
      { q: 'Is ZoDeals free to use?', a: 'Yes, ZoDeals is completely free for all users.' },
      { q: 'How do I reset my password?', a: 'On the login screen, tap "Forgot Password?" and follow the OTP verification flow.' },
      { q: 'Can I save deals for later?', a: 'Yes! Tap the heart icon on any deal to add it to your Favorites.' },
    ],
  },
  RefundPolicy: {
    title: 'Refund Policy',
    emoji: '↩️',
    content: `ZoDeals is a deals discovery platform — we do not process payments directly.\n\nFor refunds on purchases made through deals found on ZoDeals:\n• Contact the respective store's customer support directly.\n• ZoDeals does not handle refunds for third-party purchases.\n• Each store has its own refund and return policy.\n\nFor issues with ZoDeals premium services (if applicable):\n• Contact support@zodeals.in within 7 days of purchase.\n\nFor detailed policy, visit zodeals.in/refund/policy`,
  },
  ProductPricing: {
    title: 'Product Pricing Policy',
    emoji: '💰',
    content: `ZoDeals displays prices sourced from partner stores.\n\nPricing Disclaimer:\n• Prices shown are indicative and may change without notice.\n• Final price is determined by the respective store at checkout.\n• Discounts shown are calculated based on store's listed MRP.\n• ZoDeals is not responsible for price discrepancies.\n\nBest Price Guarantee:\n• We strive to show you the best available price.\n• If you find a better price, report it to us.\n\nFor full policy, visit zodeals.in/product/pricing/policy`,
  },
  AgentContact: {
    title: 'Contact Us / Become an Agent',
    emoji: '📞',
    isContact: true,
  },
};

export function InfoScreen({ route }) {
  const screenKey = route.name;
  const data = INFO_SCREENS[screenKey];
  if (!data) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emoji}>{data.emoji}</Text>
        <Text style={styles.title}>{data.title}</Text>

        {data.faqs ? (
          data.faqs.map((faq, i) => (
            <View key={i} style={styles.faqCard}>
              <Text style={styles.faqQ}>Q: {faq.q}</Text>
              <Text style={styles.faqA}>A: {faq.a}</Text>
            </View>
          ))
        ) : data.isContact ? (
          <View style={styles.contactSection}>
            <Text style={styles.content}>Interested in becoming a ZoDeals agent or partnering with us?{'\n\n'}Reach out to our team:</Text>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:agent@zodeals.in')}>
              <Text style={styles.contactBtnText}>📧 agent@zodeals.in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+919999999999')}>
              <Text style={styles.contactBtnText}>📞 +91 99999 99999</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.websiteBtn} onPress={() => Linking.openURL('https://zodeals.in/agent-contact')}>
              <Text style={styles.websiteBtnText}>Fill Agent Contact Form →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.content}>{data.content}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20, paddingBottom: 60 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F1B35', textAlign: 'center', marginBottom: 20 },
  content: { fontSize: 15, color: '#374151', lineHeight: 24 },
  faqCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#E8ECF4',
  },
  faqQ: { fontSize: 14, fontWeight: '800', color: '#0F1B35', marginBottom: 8 },
  faqA: { fontSize: 13, color: '#4A5568', lineHeight: 18 },
  contactSection: { gap: 12 },
  contactBtn: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: '#E8ECF4', alignItems: 'center',
  },
  contactBtnText: { fontSize: 15, fontWeight: '700', color: '#0F1B35' },
  websiteBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  websiteBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
