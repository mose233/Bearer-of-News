import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';

const DevTools: React.FC = () => {
  // Only show in development mode
  if (import.meta.env.MODE !== 'development') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 999999,
      }}
    >
      <button
        onClick={() => alert('DEV CLICK WORKS')}
        style={{
          background: 'red',
          color: 'white',
          padding: '12px 16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        DEV CLICK
      </button>
    </div>
  );
};

const Index: React.FC = () => {
  const isDev = import.meta.env.MODE === 'development';

  const redirectUrl = isDev
    ? 'http://localhost:5173'
    : 'https://newsapp.com/dashboard';

  // ✅ FIXED: Added required Facebook permissions (scopes)
  const facebookOAuthUrl =
    `https://bjclqqynzsljskfeqfdj.supabase.co/auth/v1/authorize?provider=facebook&scopes=email,public_profile,pages_show_list,pages_read_engagement&redirect_to=${encodeURIComponent(redirectUrl)}`;

  return (
    <AppProvider>
      <AppLayout />

      {/* ✅ FACEBOOK CONNECT BUTTON */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999999,
        }}
      >
        <a
          href={facebookOAuthUrl}
          style={{
            display: 'block',
            background: '#1877F2',
            color: 'white',
            padding: '14px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          Connect with Facebook
        </a>
      </div>

      {/* DEV TOOL */}
      <DevTools />
    </AppProvider>
  );
};

export default Index;
