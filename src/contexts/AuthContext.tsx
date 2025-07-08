import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, getAuthToken, setAuthToken, removeAuthToken, initializeGoogleAuth, signInWithGoogle } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeGoogleAuth();

        // Check for existing auth token
        const token = getAuthToken();
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              role: 'user'
            });
          } catch (error) {
            console.error('Invalid token:', error);
            removeAuthToken();
          }
        } else {
          // Guest mode: set a default guest user
          setUser({
            id: 'guest',
            email: 'guest@sigmadata.eu',
            name: 'Guest User',
            picture: '',
            role: 'user'
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};