import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Menu, User, Shield, X, Users, FileText, BarChart3 } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bearer of News</h1>
            <p className="text-xs text-gray-500">Collaborate. Approve. Post. Seamlessly.</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <Facebook className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Facebook Connected</span>
        </div>
        
        {user ? (
          <>
            <NotificationBell />

            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 hover:bg-gray-50">Profile</button>
                  <button onClick={() => { navigate('/team'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <Users className="w-4 h-4" />Team
                  </button>
                  <button onClick={() => { navigate('/content'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4" />Content
                  </button>
                  <button onClick={() => { navigate('/analytics'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />Analytics
                  </button>
                  <button onClick={() => { navigate('/about'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                    About Us
                  </button>
                  <button onClick={() => { navigate('/privacy'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                    Privacy Policy
                  </button>




                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
