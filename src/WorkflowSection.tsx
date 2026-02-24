import React from 'react';
import { Users, Eye, CheckCircle, ArrowRight } from 'lucide-react';

const WorkflowSection: React.FC = () => {
  const steps = [
    {
      icon: Users,
      title: "Collaborate",
      description: "Content creators draft posts within the secure Bearer of News interface",
      color: "bg-blue-500"
    },
    {
      icon: Eye,
      title: "Review",
      description: "Page Admins receive notifications and review drafts with AI-powered quality insights",
      color: "bg-purple-500"
    },
    {
      icon: CheckCircle,
      title: "Approve & Publish",
      description: "Admins manually publish approved content directly in Facebook's native composer",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Secure Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our three-step process ensures complete compliance while streamlining collaboration between Page Admins and content creators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            100% Facebook Compliant
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bearer of News never auto-posts to Facebook. The final publish action is always a manual click by the Page Admin within Facebook's native interface, ensuring complete compliance with Facebook's platform policies.
          </p>
          <button 
            onClick={() => {
              const complianceSection = document.getElementById('compliance');
              if (complianceSection) {
                window.scrollTo({ top: complianceSection.offsetTop, behavior: 'smooth' });
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Learn About Compliance
          </button>

        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;