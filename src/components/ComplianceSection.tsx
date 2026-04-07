import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const ComplianceSection: React.FC = () => {
  const complianceFeatures = [
    {
      icon: Shield,
      title: "No Auto-Posting",
      description: "Final publish action is always manual within Facebook's native composer"
    },
    {
      icon: Lock,
      title: "Phased Permissions",
      description: "We start with minimal permissions and expand only when needed"
    },
    {
      icon: Eye,
      title: "Admin Control",
      description: "Page administrators maintain ultimate authority over all content"
    },
    {
      icon: FileText,
      title: "Transparent Policies",
      description: "Clear documentation of data usage and privacy practices"
    }
  ];

  return (
    <section id="compliance" className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-blue-300" />
            <h2 className="text-4xl font-bold">Facebook Platform Compliance</h2>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Built with Facebook's platform policies at the core. Our compliance-first approach ensures your account remains secure and in good standing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {complianceFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-800 rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Two-Phase Review Strategy</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phase 1: Core Collaboration</h4>
                    <p className="text-blue-100 text-sm">Launch with minimal permissions for secure team workflows</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phase 2: Enhanced Experience</h4>
                    <p className="text-blue-100 text-sm">Add composer pre-fill capabilities after user validation</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-700 rounded-xl p-6">
              <h4 className="font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Compliance Guarantee</span>
              </h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Bearer of News will never execute a POST call to Facebook's API for final publishing. 
                The human administrator always performs the final publish action within Facebook's authentic interface, 
                ensuring 100% compliance with platform policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;