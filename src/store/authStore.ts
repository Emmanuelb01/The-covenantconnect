import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL;

interface User {
  user_id: string;
  email: string;
  auth_type: string;
  profile: {
    name: string;
    age: number;
    gender: string;
    location: { city: string; state: string; country: string };
    profile_picture: string;
    denomination: string;
    church_name: string;
    church_involvement: string;
    testimony: string;
    values: string[];
    celibacy_commitment: boolean;
    celibacy_verified: boolean;
    prayer_frequency: string;
    bible_study_frequency: string;
    marriage_timeline: string;
    interests: string[];
  };
  preferences: {
    age_range_min: number;
    age_range_max: number;
    location_radius: number;
    denominations: string[];
    must_be_celibate: boolean;
  };
  accountability: {
    has_partner: boolean;
    partner_email: string;
    partner_name: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, age: number, gender: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  updateProfile: (profileData: Partial<User['profile']>) => Promise<void>;
  uploadProfilePicture: (imageData: string) => Promise<{ approved: boolean; message: string; violation_type?: string }>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  register: async (email: string, password: string, name: string, age: number, gender: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
        email,
        password,
        name,
        age,
        gender,
      });

      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      const token = get().token;
      if (token) {
        await axios.post(
          `${BACKEND_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: response.data, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      await AsyncStorage.removeItem('token');
      set({ isLoading: false });
    }
  },

  updateProfile: async (profileData: Partial<User['profile']>) => {
    try {
      const token = get().token;
      const response = await axios.put(
        `${BACKEND_URL}/api/profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ user: response.data });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Profile update failed');
    }
  },

  uploadProfilePicture: async (imageData: string) => {
    try {
      const token = get().token;
      const response = await axios.post(
        `${BACKEND_URL}/api/profile/picture`,
        { image_data: imageData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.approved && response.data.user) {
        set({ user: response.data.user });
      }
      
      return {
        approved: response.data.approved,
        message: response.data.message,
        violation_type: response.data.violation_type
      };
    } catch (error: any) {
      // Handle 400 errors (rejected images) differently
      if (error.response?.status === 400 && error.response?.data?.message) {
        return {
          approved: false,
          message: error.response.data.message,
          violation_type: error.response.data.violation_type
        };
      }
      throw new Error(error.response?.data?.detail || 'Profile picture upload failed');
    }
  },

  setUser: (user: User) => set({ user }),
}));