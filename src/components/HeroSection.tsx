import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Users, Zap, X, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const handleStartTrial = () => {
    navigate('/signup');
  };

  const handleScrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Secure Facebook
                  <span className="text-blue-600 block">Content Collaboration</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empower your team to create, review, and approve Facebook content with enterprise-grade security. 
                  You maintain complete control over what gets published.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartTrial}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">100% Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Team Collaboration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">AI-Powered</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633642076_d60d16d8.webp"
                alt="Bearer of News Dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {showDemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8 relative">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-4">Product Demo</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Demo video would play here</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
