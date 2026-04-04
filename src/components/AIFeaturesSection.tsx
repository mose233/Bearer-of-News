import React from 'react';
import { Brain, Target, Shield, BarChart3 } from 'lucide-react';

const AIFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Grammar & Spell Check",
      description: "AI-powered proofreading ensures error-free content",
      tier: "Free",
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Tone Analysis",
      description: "Maintain consistent brand voice across all posts",
      tier: "Pro",
      color: "bg-purple-500"
    },
    {
      icon: Shield,
      title: "Plagiarism Detection",
      description: "Verify content originality and protect your brand",
      tier: "Pro",
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Performance Predictor",
      description: "AI-driven insights on potential post engagement",
      tier: "Pro",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Powered Content Enhancement
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Leverage advanced AI tools to improve content quality, maintain brand consistency, 
                and predict performance before publishing.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feature.tier === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {feature.tier}
                      </span>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Try AI Features Free
            </button>
          </div>

          <div className="relative">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633664080_7f68b4e4.webp"
              alt="AI Content Analysis"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">AI Analysis Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesSection;