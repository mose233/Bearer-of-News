import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Bearer of News</h3>
                <p className="text-sm text-gray-400">Collaborate. Approve. Post.</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              The secure, compliant platform for Facebook Page content collaboration.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">Pricing</button></li>
              <li><button onClick={() => navigate('/analytics')} className="text-gray-300 hover:text-white transition-colors">Analytics</button></li>
              <li><button onClick={() => navigate('/team')} className="text-gray-300 hover:text-white transition-colors">Team Management</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition-colors">Sign In</button></li>
              <li><button onClick={() => navigate('/signup')} className="text-gray-300 hover:text-white transition-colors">Sign Up</button></li>
              <li><button onClick={() => navigate('/profile')} className="text-gray-300 hover:text-white transition-colors">Profile</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/privacy')} className="text-gray-300 hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors">Terms of Service</button></li>
              <li><button className="text-gray-300 hover:text-white transition-colors">Cookie Policy</button></li>
            </ul>
          </div>



          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:support@bearerof.news" className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@bearerof.news</span>
              </a>
              <a href="tel:1-800-BEARER" className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>1-800-BEARER</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 Bearer of News. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🔒 SOC 2 Compliant</span>
              <span>🛡️ GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
