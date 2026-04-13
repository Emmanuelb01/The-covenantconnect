import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function CommunityGuidelines() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Guidelines</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Our Mission</Text>
          <Text style={styles.description}>
            To create a safe, faith-centered space for celibate Christian singles to build
            meaningful relationships leading to marriage.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Values</Text>
          {[
            'Honor God in all interactions',
            'Maintain purity and celibacy commitment',
            'Communicate with honesty and respect',
            'Seek accountability and spiritual growth',
            'Approach dating with marriage intentions',
          ].map((value, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.listItemText}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo Guidelines</Text>
          {[
            'Must be a clear photo of yourself',
            'Modest dress required (no revealing clothing)',
            'No group photos as main picture',
            'Light filters are allowed, but no heavy alterations',
            'AI-generated or AI-constructed images are NOT permitted',
            'Recent photos only (within 1 year)',
          ].map((rule, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text style={styles.listItemText}>{rule}</Text>
            </View>
          ))}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={20} color={COLORS.gold} />
            <Text style={styles.warningText}>
              Photos that violate these guidelines will be automatically rejected. You will receive a notification explaining why your photo was not accepted.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prohibited Behavior</Text>
          {[
            'Sexual content or solicitation',
            'Harassment or disrespectful communication',
            'Misrepresentation of faith or intentions',
            'Spam or promotional content',
            'Sharing contact info before mutual consent',
          ].map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="close-circle" size={20} color={COLORS.error} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truthfulness & Accountability</Text>
          <Text style={styles.description}>
            The CovenantConnect is built on a foundation of honesty and integrity. We expect all members to be truthful in their profiles, communications, and interactions.
          </Text>
          <View style={styles.accountabilityBox}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
            <Text style={styles.accountabilityTitle}>Untruthful Member Policy</Text>
            <Text style={styles.accountabilityText}>
              If a partner or app member is found to be untruthful about their identity, intentions, marital status, or any material information:
            </Text>
            {[
              'First Report: Written warning and profile review',
              'Second Report: Final warning with temporary restrictions',
              'Third Report: Account suspension',
            ].map((item, index) => (
              <View key={index} style={styles.policyItem}>
                <View style={[styles.policyBadge, index === 2 && styles.policyBadgeFinal]}>
                  <Text style={styles.policyBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.policyItemText}>{item}</Text>
              </View>
            ))}
            <Text style={styles.accountabilityNote}>
              Members are encouraged to report any suspicious or dishonest behavior. All reports are investigated confidentially.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporting & Safety</Text>
          <Text style={styles.description}>
            If you encounter anyone violating these guidelines or making you feel unsafe, please
            use the report feature immediately. We take all reports seriously and will investigate
            promptly.
          </Text>
          <Text style={styles.description}>
            Remember: Your safety is our priority. Never feel pressured to share personal
            information or meet someone before you are comfortable.
          </Text>
        </View>

        <View style={styles.verseContainer}>
          <Text style={styles.verse}>
            Let all that you do be done in love.
          </Text>
          <Text style={styles.verseRef}>- 1 Corinthians 16:14</Text>
        </View>
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
    color: COLORS.text,
  },
  content: {
    paddingBottom: 32,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  warningBox: {
    backgroundColor: COLORS.lightPurple,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  accountabilityBox: {
    backgroundColor: COLORS.lightPurple,
    padding: 20,
    borderRadius: 12,
    marginTop: 8,
  },
  accountabilityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  accountabilityText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  policyBadgeFinal: {
    backgroundColor: COLORS.error,
  },
  policyBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  policyItemText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  accountabilityNote: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 18,
  },
  verseContainer: {
    backgroundColor: COLORS.lightPurple,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  verse: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  verseRef: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
