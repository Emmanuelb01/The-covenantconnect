import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

export default function Profile() {
  const { user, logout, uploadProfilePicture } = useAuthStore();

  const handleUploadPicture = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload your picture.'
        );
        return;
      }

      // Show options for camera or gallery
      Alert.alert(
        'Upload Picture',
        'Choose your profile picture (headshot or full body)',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
              if (cameraStatus.status === 'granted') {
                launchCamera();
              }
            },
          },
          {
            text: 'Choose from Gallery',
            onPress: () => launchImageLibrary(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const launchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        await uploadImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error launching camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const launchImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        await uploadImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error launching image library:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const uploadImage = async (base64Image: string) => {
    try {
      const base64String = `data:image/jpeg;base64,${base64Image}`;
      const result = await uploadProfilePicture(base64String);
      
      if (result.approved) {
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        // Show rejection message with appropriate title based on violation type
        let title = 'Picture Rejected';
        if (result.violation_type === 'ai_generated') {
          title = 'AI-Generated Image Detected';
        } else if (result.violation_type === 'inappropriate_content') {
          title = 'Content Guidelines Violation';
        } else if (result.violation_type === 'low_quality') {
          title = 'Image Quality Issue';
        }
        
        Alert.alert(
          title,
          result.message,
          [
            {
              text: 'View Guidelines',
              onPress: () => router.push('/community-guidelines'),
            },
            {
              text: 'Try Again',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload picture. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {user.profile.profile_picture ? (
              <Image
                source={{ uri: user.profile.profile_picture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Ionicons name="person" size={60} color={COLORS.textLight} />
              </View>
            )}
            {user.profile.celibacy_commitment && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              </View>
            )}
            
            {/* Upload Picture Button */}
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleUploadPicture}
            >
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {user.profile.name}, {user.profile.age}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          
          <Text style={styles.uploadHint}>
            Tap camera icon to upload headshot or full body picture
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faith Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="church" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Denomination</Text>
              <Text style={styles.infoValue}>{user.profile.denomination || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Church</Text>
              <Text style={styles.infoValue}>{user.profile.church_name || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="hand-right" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Church Involvement</Text>
              <Text style={styles.infoValue}>{user.profile.church_involvement || 'Not set'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="heart" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Marriage Timeline</Text>
              <Text style={styles.infoValue}>{user.profile.marriage_timeline || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {user.profile.values && user.profile.values.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <View style={styles.tagsContainer}>
              {user.profile.values.map((value, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.profile.interests && user.profile.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagsContainer}>
              {user.profile.interests.map((interest, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.profile.testimony && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Testimony</Text>
            <Text style={styles.testimonyText}>{user.profile.testimony}</Text>
          </View>
        )}

        <View style={styles.verseSection}>
          <Text style={styles.verseText}>
            "He who finds a wife finds a good thing, And obtains favor from the Lord."
          </Text>
          <Text style={styles.verseReference}>- Proverbs 18:22</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/preferences')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={24} color={COLORS.text} />
              <Text style={styles.menuItemText}>Matching Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/accountability')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="people-outline" size={24} color={COLORS.text} />
              <Text style={styles.menuItemText}>Accountability Partner</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/resources')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="book-outline" size={24} color={COLORS.text} />
              <Text style={styles.menuItemText}>Resources</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/community-guidelines')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.text} />
              <Text style={styles.menuItemText}>Community Guidelines</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>The CovenantConnect</Text>
          <Text style={styles.footerSubtext}>Where Faith Meets Forever</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  uploadHint: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPurple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.lightPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  testimonyText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  versionText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 8,
  },
  verseSection: {
    backgroundColor: COLORS.lightPurple,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.softGold,
  },
  verseText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  verseReference: {
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
    fontWeight: '700',
  },
});
