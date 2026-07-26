import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';

export interface MockUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: MockUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signIn: (requestedRole?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: UserProfile | ((prev: UserProfile | null) => UserProfile | null)) => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  authError: null,
  signIn: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
  clearAuthError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const updateUserProfile = async (profileOrUpdater: UserProfile | ((prev: UserProfile | null) => UserProfile | null)) => {
    if (!user) return;
    let newProfile = profileOrUpdater;
    if (typeof profileOrUpdater === 'function') {
      newProfile = profileOrUpdater(userProfile);
    }
    if (newProfile) {
      const storedProfiles = localStorage.getItem('nova_user_profiles');
      let profiles = storedProfiles ? JSON.parse(storedProfiles) : {};
      profiles[user.uid] = newProfile;
      localStorage.setItem('nova_user_profiles', JSON.stringify(profiles));
      setUserProfile(newProfile);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('nova_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const storedProfiles = localStorage.getItem('nova_user_profiles');
        const profiles = storedProfiles ? JSON.parse(storedProfiles) : {};
        const profile = profiles[parsedUser.uid];
        if (profile) {
          setUserProfile(profile);
        } else {
          // Create fallback if profile lost
          const fallbackProfile: UserProfile = {
            uid: parsedUser.uid,
            name: parsedUser.displayName || 'Unknown',
            role: parsedUser.uid.includes('owner') ? 'owner' : parsedUser.uid.includes('employee') ? 'employee' : 'customer',
            email: parsedUser.email || '',
            pfp: parsedUser.photoURL || `https://picsum.photos/400/400?seed=${parsedUser.uid}`,
            credits: 1000,
          };
          profiles[parsedUser.uid] = fallbackProfile;
          localStorage.setItem('nova_user_profiles', JSON.stringify(profiles));
          setUserProfile(fallbackProfile);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (requestedRole: string = 'customer') => {
    setAuthError(null);
    setLoading(true);
    try {
      const mockUser: MockUser = {
        uid: `mock-${requestedRole}-uid`,
        email: `${requestedRole}@novaspace.com`,
        displayName: requestedRole === 'owner' ? 'Nova Owner' : requestedRole === 'employee' ? 'Alex Staff' : 'Jane Customer',
        photoURL: `https://picsum.photos/400/400?seed=mock-${requestedRole}`,
      };

      localStorage.setItem('nova_user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Load or create profile
      const storedProfiles = localStorage.getItem('nova_user_profiles');
      let profiles = storedProfiles ? JSON.parse(storedProfiles) : {};
      
      let profile = profiles[mockUser.uid];
      if (!profile) {
        profile = {
          uid: mockUser.uid,
          name: mockUser.displayName,
          role: requestedRole,
          email: mockUser.email,
          pfp: mockUser.photoURL,
          credits: 1000,
        };
        profiles[mockUser.uid] = profile;
        localStorage.setItem('nova_user_profiles', JSON.stringify(profiles));
      } else {
        // Keep the requested role if they switch
        if (profile.role !== requestedRole) {
          profile.role = requestedRole;
          profiles[mockUser.uid] = profile;
          localStorage.setItem('nova_user_profiles', JSON.stringify(profiles));
        }
      }
      setUserProfile(profile);
    } catch (error: any) {
      console.error("Login failed", error);
      setAuthError("Simulated sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('nova_user');
    setUser(null);
    setUserProfile(null);
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, authError, clearAuthError, signIn, signOut, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
