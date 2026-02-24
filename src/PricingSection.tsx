import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Zap, X } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const navigate = useNavigate();

  const plans = [
    {
      name: "Bearer of News Free",
      price: "$0",
      period: "forever",
      description: "Perfect for small teams getting started",
      features: [
        "1 active collaborator",
        "Basic workflow management",
        "Standard notifications",
        "Grammar & spell check",
        "Email support",
        "Facebook compliance guaranteed"
      ],
      popular: false,
      cta: "Start Free",
      color: "border-gray-200"
    },
    {
      name: "Bearer of News Pro",
      price: "$19.99",
      period: "per month",
      description: "Advanced features for growing teams",
      features: [
        "Unlimited collaborators",
        "Advanced AI features",
        "Tone analysis & plagiarism detection",
        "Performance predictor",
        "Priority support",
        "Advanced analytics",
        "Custom workflows",
        "Team management tools"
      ],
      popular: true,
      cta: "Start Pro Trial",
      color: "border-blue-500"
    }
  ];

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Enterprise') {
      setSelectedPlan(planName);
      setShowContactForm(true);
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your team size and collaboration needs. All plans include our compliance-first approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-xl border-2 ${plan.color} p-8 ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Enterprise Solutions</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Need custom workflows, dedicated support, or enterprise-grade security? 
                We offer tailored solutions for large organizations.
              </p>
              <button 
                onClick={() => handlePlanSelect('Enterprise')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-4">Get Started with {selectedPlan}</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will contact you soon.'); setShowContactForm(false); }} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg" />
              <input type="tel" placeholder="Phone" className="w-full px-4 py-2 border rounded-lg" />
              <textarea placeholder="Tell us about your needs" rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingSection;
