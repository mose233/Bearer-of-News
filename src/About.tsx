import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121591147_6eb178a9.webp',
    bio: 'Former VP at Meta, 15+ years in social media innovation',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO & Co-Founder',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121591925_265fc267.webp',
    bio: 'Ex-Google engineer, AI and machine learning expert',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Emily Watson',
    role: 'Head of Product',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121592980_0f490247.webp',
    bio: 'Product leader from Twitter, passionate about user experience',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'David Kim',
    role: 'Head of Marketing',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121593791_97a98dc8.webp',
    bio: 'Growth strategist, scaled multiple SaaS companies',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Jessica Martinez',
    role: 'Lead Designer',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121594637_c53262c9.webp',
    bio: 'Award-winning designer, previously at Airbnb',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Alex Thompson',
    role: 'Senior Engineer',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121595876_be7f6f7c.webp',
    bio: 'Full-stack developer with expertise in scalable systems',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Rachel Green',
    role: 'Customer Success Manager',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121597216_d7a7d1f0.webp',
    bio: 'Dedicated to helping teams succeed with our platform',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'James Park',
    role: 'Data Scientist',
    image: 'https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1761121597960_37281d1e.webp',
    bio: 'PhD in ML, building intelligent content insights',
    linkedin: '#',
    twitter: '#'
  }
];

const milestones = [
  { year: '2021', title: 'Company Founded', description: 'Started with a vision to revolutionize social media management' },
  { year: '2022', title: 'Series A Funding', description: 'Raised $10M to accelerate product development' },
  { year: '2023', title: '10,000 Users', description: 'Reached milestone of serving 10,000+ teams worldwide' },
  { year: '2024', title: 'AI Integration', description: 'Launched advanced AI-powered content approval system' },
  { year: '2025', title: 'Global Expansion', description: 'Opened offices in London, Singapore, and Sydney' }
];

const values = [
  { title: 'Innovation', description: 'We constantly push boundaries to deliver cutting-edge solutions' },
  { title: 'Transparency', description: 'Open communication and honest feedback drive our culture' },
  { title: 'Collaboration', description: 'Great things happen when diverse minds work together' },
  { title: 'Excellence', description: 'We strive for the highest quality in everything we do' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Bearer of News</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            We're on a mission to empower teams to create, collaborate, and publish exceptional social media content with confidence and efficiency.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              Bearer of News was born from a simple observation: social media teams were struggling with chaotic approval processes, miscommunication, and missed opportunities. In 2021, our founders Sarah Chen and Michael Rodriguez decided to change that.
            </p>
            <p className="mb-4">
              Having worked at leading tech companies, they understood the pain points firsthand. They assembled a team of passionate innovators and set out to build a platform that would transform how teams manage social media content.
            </p>
            <p>
              Today, we serve over 10,000 teams worldwide, helping them streamline workflows, maintain brand consistency, and publish content that resonates with their audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Mission & Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-blue-600">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex gap-3">
                    <a href={member.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href={member.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                </div>
                <div className="flex-grow border-l-4 border-blue-600 pl-6 pb-8">
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Email Us</h3>
              <a href="mailto:hello@bearernews.com" className="text-blue-600 hover:underline">
                hello@bearernews.com
              </a>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Phone className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Call Us</h3>
              <a href="tel:+1-555-0123" className="text-blue-600 hover:underline">
                +1 (555) 012-3456
              </a>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Innovation St<br />San Francisco, CA 94102</p>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <a href="mailto:hello@bearernews.com">Send Us a Message</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
