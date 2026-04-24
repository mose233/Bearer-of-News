import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Founding Team',
    role: 'Builders of Bearer of News',
    image: '/team1.jpg',
    bio: 'A passionate team focused on simplifying news collaboration and publishing.',
    linkedin: '',
    twitter: ''
  }
];

const milestones = [
  { year: '2024', title: 'Idea Born', description: 'Identified the gap in structured news collaboration workflows' },
  { year: '2025', title: 'Product Built', description: 'Launched the first version of Bearer of News' },
  { year: '2026', title: 'Growing Adoption', description: 'Onboarding early teams and refining the platform' }
];

const values = [
  { title: 'Clarity', description: 'We eliminate confusion in content workflows' },
  { title: 'Speed', description: 'We help teams move from idea to publish faster' },
  { title: 'Trust', description: 'We build tools that teams can rely on daily' },
  { title: 'Focus', description: 'We solve real problems without unnecessary complexity' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">About Bearer of News</h1>
          <p className="text-xl leading-relaxed">
            A platform built to bring structure, speed, and clarity to how news teams collaborate and publish.
          </p>
          <p className="text-sm mt-4 opacity-80">
            Built for modern newsrooms and independent media teams worldwide
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <p className="mb-4">
            Bearer of News was created to solve a real problem: content chaos. Teams were struggling with unclear approvals, lost drafts, and slow publishing cycles.
          </p>
          <p className="mb-4">
            Instead of adding more tools, we focused on building one platform that simplifies the entire workflow — from idea to approval to publishing.
          </p>
          <p>
            Today, Bearer of News is evolving into a system that helps teams stay organized, move faster, and maintain quality at scale.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Stand For</h2>
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

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                  <div className="flex justify-center gap-3">
                    {member.linkedin && (
                      <a href={member.linkedin}>
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter}>
                        <Twitter size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-20 text-right">
                  <span className="text-xl font-bold text-blue-600">{milestone.year}</span>
                </div>
                <div className="border-l-4 border-blue-600 pl-6 pb-6">
                  <h3 className="font-bold">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>

          <div className="grid md:grid-cols-3 gap-8">

            <Card className="p-6 text-center hover:shadow-lg">
              <Mail className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Email</h3>
              <a href="mailto:hello@bearernews.com" className="text-blue-600">
                hello@bearernews.com
              </a>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg">
              <Phone className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-gray-600">Available on request</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg">
              <MapPin className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <h3 className="font-bold mb-2">Location</h3>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </Card>

          </div>

          <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = "mailto:hello@bearernews.com"}
            >
              Send Us a Message
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}
