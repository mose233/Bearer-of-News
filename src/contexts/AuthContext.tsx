import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 AuthProvider mounted');

    // GET EXISTING SESSION
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('✅ Existing session:', session);

      if (error) {
        console.error('❌ Session error:', error);
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // LISTEN FOR LOGIN / LOGOUT
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      console.log('👤 User:', session?.user);

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🛑 Auth subscription removed');
      subscription.unsubscribe();
    };
  }, []);

  // SIGN UP
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    console.log('📝 Sign up:', data);

    return { data, error };
  };

  // EMAIL LOGIN
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('🔐 Sign in:', data);

    return { data, error };
  };

  // LOGOUT
  const signOut = async () => {
    console.log('🚪 Signing out');

    await supabase.auth.signOut();

    setUser(null);
    setSession(null);
  };

  // RESET PASSWORD
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    return { data, error };
  };

  // UPDATE PROFILE
  const updateProfile = async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser(updates);

    return { data, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
