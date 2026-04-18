import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>The CovenantConnect</Text>
          <Text style={styles.lastUpdated}>Last Updated: April 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to The CovenantConnect. We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.text}>We collect information that you provide directly to us:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Account information (name, email address, password)</Text>
            <Text style={styles.bulletItem}>• Profile information (age, gender, denomination, church name)</Text>
            <Text style={styles.bulletItem}>• Profile photos you upload</Text>
            <Text style={styles.bulletItem}>• Faith-related information (testimony, values, church involvement)</Text>
            <Text style={styles.bulletItem}>• Messages sent through the app</Text>
            <Text style={styles.bulletItem}>• Preferences and settings</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.text}>We use the information we collect to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Create and manage your account</Text>
            <Text style={styles.bulletItem}>• Provide compatibility matching services</Text>
            <Text style={styles.bulletItem}>• Enable communication between users</Text>
            <Text style={styles.bulletItem}>• Send important notifications about your account</Text>
            <Text style={styles.bulletItem}>• Improve our services and user experience</Text>
            <Text style={styles.bulletItem}>• Ensure safety and security of our platform</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.text}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• With other users as part of your public profile</Text>
            <Text style={styles.bulletItem}>• With service providers who assist in operating our app</Text>
            <Text style={styles.bulletItem}>• When required by law or to protect rights and safety</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.text}>You have the right to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access your personal information</Text>
            <Text style={styles.bulletItem}>• Update or correct your information</Text>
            <Text style={styles.bulletItem}>• Delete your account and associated data</Text>
            <Text style={styles.bulletItem}>• Opt out of promotional communications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data Retention</Text>
          <Text style={styles.text}>
            We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account at any time by contacting us.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.text}>
            Our service is intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under 18.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactEmail}>support@thecovenantconnect.com</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using The CovenantConnect, you agree to this Privacy Policy.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
  },
  bulletList: {
    marginTop: 12,
  },
  bulletItem: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 26,
    paddingLeft: 8,
  },
  contactEmail: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 12,
  },
  footer: {
    backgroundColor: COLORS.lightPurple,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
