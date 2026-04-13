import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import api from '../../src/utils/api';
import { useAuthStore } from '../../src/store/authStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

interface Match {
  match: {
    compatibility_score: number;
    compatibility_reason: string;
    status: string;
  };
  user: {
    user_id: string;
    profile: {
      name: string;
      age: number;
      profile_picture: string;
      denomination: string;
      church_involvement: string;
      values: string[];
      testimony: string;
      interests: string[];
      celibacy_commitment: boolean;
    };
  };
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/matches/daily');
      setMatches(response.data.matches || []);
      setLimitReached(response.data.limit_reached || false);
    } catch (error) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= matches.length) return;

    const currentMatch = matches[currentIndex];
    try {
      const response = await api.post(`/api/matches/${currentMatch.user.user_id}/like`);
      
      if (response.data.mutual) {
        Alert.alert(
          "It's a Match! 🎉",
          `You and ${currentMatch.user.profile.name} both liked each other! You can now start messaging.`,
          [{ text: 'Great!', onPress: () => setCurrentIndex(currentIndex + 1) }]
        );
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error('Error liking match:', error);
      Alert.alert('Error', 'Failed to like match');
    }
  };

  const handlePass = async () => {
    if (currentIndex >= matches.length) return;

    const currentMatch = matches[currentIndex];
    try {
      await api.post(`/api/matches/${currentMatch.user.user_id}/pass`);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error('Error passing match:', error);
      Alert.alert('Error', 'Failed to pass match');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentIndex(0);
    loadMatches();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="heart" size={60} color={COLORS.primary} />
          <Text style={styles.loadingText}>Finding your matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (matches.length === 0 || currentIndex >= matches.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.centerContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons name="heart-dislike" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>
            {limitReached ? "That's all for today!" : 'No matches yet'}
          </Text>
          <Text style={styles.emptyText}>
            {limitReached
              ? 'Come back tomorrow for more potential matches. Remember, quality over quantity!'
              : 'Complete your profile to get better matches'}
          </Text>
          
          <View style={styles.verseBox}>
            <Text style={styles.verseText}>
              "He who finds a wife finds a good thing, And obtains favor from the Lord."
            </Text>
            <Text style={styles.verseReference}>- Proverbs 18:22</Text>
          </View>
          
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="heart" size={28} color={COLORS.primary} />
        <Text style={styles.headerTitle}>Today's Matches</Text>
        <Text style={styles.matchCounter}>
          {currentIndex + 1} / {matches.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            {currentMatch.user.profile.profile_picture ? (
              <Image
                source={{ uri: currentMatch.user.profile.profile_picture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Ionicons name="person" size={80} color={COLORS.textLight} />
              </View>
            )}
            
            {currentMatch.user.profile.celibacy_commitment && (
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
                <Text style={styles.badgeText}>Celibacy Committed</Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {currentMatch.user.profile.name}, {currentMatch.user.profile.age}
              </Text>
              <View style={styles.scoreContainer}>
                <Ionicons name="star" size={20} color={COLORS.gold} />
                <Text style={styles.score}>{currentMatch.match.compatibility_score}%</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="church" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{currentMatch.user.profile.denomination}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="hand-right" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>{currentMatch.user.profile.church_involvement}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compatibility</Text>
              <Text style={styles.compatibilityText}>{currentMatch.match.compatibility_reason}</Text>
            </View>

            {currentMatch.user.profile.values.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Core Values</Text>
                <View style={styles.tagsContainer}>
                  {currentMatch.user.profile.values.map((value, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {currentMatch.user.profile.interests.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={styles.tagsContainer}>
                  {currentMatch.user.profile.interests.map((interest, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {currentMatch.user.profile.testimony && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Testimony</Text>
                <Text style={styles.testimonyText}>{currentMatch.user.profile.testimony}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Ionicons name="close" size={32} color={COLORS.coral} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Ionicons name="heart" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  matchCounter: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.background,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardContent: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  compatibilityText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
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
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
    borderWidth: 2,
    borderColor: COLORS.coral,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  likeButton: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 24,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  verseBox: {
    backgroundColor: COLORS.lightPurple,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 32,
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
