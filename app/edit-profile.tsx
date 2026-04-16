import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

const DENOMINATIONS = [
  'Baptist',
  'Catholic',
  'Methodist',
  'Presbyterian',
  'Pentecostal',
  'Lutheran',
  'Episcopal',
  'Non-denominational',
  'Seventh-day Adventist',
  'Church of God',
  'Assembly of God',
  'Church of Christ',
  'Other',
];

const CHURCH_INVOLVEMENT = [
  'Very Active (Multiple times/week)',
  'Active (Weekly)',
  'Moderate (2-3 times/month)',
  'Occasional (Monthly)',
  'Seeking a church home',
];

const MARRIAGE_TIMELINES = [
  'Within 1 year',
  '1-2 years',
  '2-3 years',
  '3+ years',
  'Open to God\'s timing',
];

const VALUES = [
  'Faith',
  'Family',
  'Honesty',
  'Loyalty',
  'Kindness',
  'Service',
  'Prayer',
  'Growth',
  'Forgiveness',
  'Patience',
  'Love',
  'Respect',
];

const INTERESTS = [
  'Bible Study',
  'Worship Music',
  'Volunteering',
  'Hiking',
  'Cooking',
  'Reading',
  'Travel',
  'Fitness',
  'Art',
  'Music',
  'Sports',
  'Movies',
];

export default function EditProfile() {
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [denomination, setDenomination] = useState(user?.profile?.denomination || '');
  const [churchName, setChurchName] = useState(user?.profile?.church_name || '');
  const [churchInvolvement, setChurchInvolvement] = useState(user?.profile?.church_involvement || '');
  const [marriageTimeline, setMarriageTimeline] = useState(user?.profile?.marriage_timeline || '');
  const [testimony, setTestimony] = useState(user?.profile?.testimony || '');
  const [selectedValues, setSelectedValues] = useState<string[]>(user?.profile?.values || []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.profile?.interests || []);
  
  // Dropdown states
  const [showDenominations, setShowDenominations] = useState(false);
  const [showInvolvement, setShowInvolvement] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    } else {
      Alert.alert('Limit Reached', 'You can select up to 5 values');
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 6) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Alert.alert('Limit Reached', 'You can select up to 6 interests');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        denomination,
        church_name: churchName,
        church_involvement: churchInvolvement,
        marriage_timeline: marriageTimeline,
        testimony,
        values: selectedValues,
        interests: selectedInterests,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Denomination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Faith Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Denomination *</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowDenominations(!showDenominations)}
              >
                <Text style={denomination ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {denomination || 'Select your denomination'}
                </Text>
                <Ionicons 
                  name={showDenominations ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {showDenominations && (
                <View style={styles.dropdownList}>
                  {DENOMINATIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        denomination === item && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setDenomination(item);
                        setShowDenominations(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        denomination === item && styles.dropdownItemTextSelected
                      ]}>
                        {item}
                      </Text>
                      {denomination === item && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Church Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Church Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your church name"
                placeholderTextColor={COLORS.textLight}
                value={churchName}
                onChangeText={setChurchName}
              />
            </View>

            {/* Church Involvement */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Church Involvement *</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowInvolvement(!showInvolvement)}
              >
                <Text style={churchInvolvement ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {churchInvolvement || 'Select your involvement level'}
                </Text>
                <Ionicons 
                  name={showInvolvement ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {showInvolvement && (
                <View style={styles.dropdownList}>
                  {CHURCH_INVOLVEMENT.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        churchInvolvement === item && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setChurchInvolvement(item);
                        setShowInvolvement(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        churchInvolvement === item && styles.dropdownItemTextSelected
                      ]}>
                        {item}
                      </Text>
                      {churchInvolvement === item && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Marriage Timeline */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Marriage Timeline *</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setShowTimeline(!showTimeline)}
              >
                <Text style={marriageTimeline ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {marriageTimeline || 'When are you hoping to marry?'}
                </Text>
                <Ionicons 
                  name={showTimeline ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              {showTimeline && (
                <View style={styles.dropdownList}>
                  {MARRIAGE_TIMELINES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        marriageTimeline === item && styles.dropdownItemSelected
                      ]}
                      onPress={() => {
                        setMarriageTimeline(item);
                        setShowTimeline(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        marriageTimeline === item && styles.dropdownItemTextSelected
                      ]}>
                        {item}
                      </Text>
                      {marriageTimeline === item && (
                        <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Core Values */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <Text style={styles.sectionSubtitle}>Select up to 5 values that matter most to you</Text>
            <View style={styles.tagsContainer}>
              {VALUES.map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.tag,
                    selectedValues.includes(value) && styles.tagSelected
                  ]}
                  onPress={() => toggleValue(value)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedValues.includes(value) && styles.tagTextSelected
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <Text style={styles.sectionSubtitle}>Select up to 6 interests</Text>
            <View style={styles.tagsContainer}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.tag,
                    selectedInterests.includes(interest) && styles.tagSelected
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedInterests.includes(interest) && styles.tagTextSelected
                  ]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Testimony */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Testimony</Text>
            <Text style={styles.sectionSubtitle}>Share your faith journey (optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell others about your faith journey and what God means to you..."
              placeholderTextColor={COLORS.textLight}
              value={testimony}
              onChangeText={setTestimony}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveFullButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveFullButtonText}>
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  dropdown: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  dropdownList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.lightPurple,
  },
  dropdownItemText: {
    fontSize: 15,
    color: COLORS.text,
  },
  dropdownItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.text,
  },
  tagTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  saveFullButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveFullButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
});
