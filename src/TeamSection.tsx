import React from 'react';
import { Star, Quote } from 'lucide-react';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Content Manager",
      company: "TechStart Inc.",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633643547_f048c7d6.webp",
      testimonial: "Bearer of News transformed our content workflow. We can now collaborate seamlessly while maintaining complete control over our Facebook presence."
    },
    {
      name: "Mike Johnson",
      role: "Social Media Director",
      company: "GrowthCorp",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633645337_ec4c1db0.webp",
      testimonial: "The AI-powered quality checks have significantly improved our content standards. Our engagement rates have increased by 40%."
    },
    {
      name: "Lisa Park",
      role: "Marketing Lead",
      company: "InnovateLab",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633647044_bcf16a4d.webp",
      testimonial: "Finally, a solution that respects Facebook's policies while enabling true team collaboration. The compliance-first approach gives us peace of mind."
    },
    {
      name: "David Wilson",
      role: "Brand Manager",
      company: "CreativeAgency",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633648758_2e4e9703.webp",
      testimonial: "The workflow is intuitive and the approval process is streamlined. We've reduced our content review time by 60%."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Content Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Facebook Page administrators and content creators are transforming their collaboration with Bearer of News.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <p className="text-sm text-blue-600 font-medium">{member.company}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <Quote className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-gray-700 italic leading-relaxed">"{member.testimonial}"</p>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <div className="flex items-center justify-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">10K+</div>
                <div className="text-sm text-gray-600">Posts Approved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Compliance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;