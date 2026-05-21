import React from 'react';

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
        onClick={() => alert('DEV TOOL WORKS')}
        style={{
          background: 'black',
          color: 'white',
          padding: '10px 14px',
          border: '1px solid white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        DEV TOOL
      </button>
    </div>
  );
};

export default DevTools;
