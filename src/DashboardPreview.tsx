import React from 'react';
import { Clock, User, MessageSquare, TrendingUp } from 'lucide-react';

const DashboardPreview: React.FC = () => {
  const contentCards = [
    {
      id: 1,
      title: "New Product Launch Announcement",
      author: "Sarah Chen",
      status: "Pending Review",
      time: "2 hours ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633654511_aaf2222d.webp"
    },
    {
      id: 2,
      title: "Weekly Industry Insights",
      author: "Mike Johnson",
      status: "Approved",
      time: "4 hours ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633656262_12fba809.webp"
    },
    {
      id: 3,
      title: "Customer Success Story",
      author: "Lisa Park",
      status: "Needs Revision",
      time: "6 hours ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633657972_2e900447.webp"
    },
    {
      id: 4,
      title: "Behind the Scenes Content",
      author: "David Wilson",
      status: "Pending Review",
      time: "8 hours ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633659664_4841f99a.webp"
    },
    {
      id: 5,
      title: "Event Promotion Post",
      author: "Emma Davis",
      status: "Approved",
      time: "1 day ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633661405_17edb25b.webp"
    },
    {
      id: 6,
      title: "Community Engagement",
      author: "Alex Thompson",
      status: "Pending Review",
      time: "1 day ago",
      image: "https://d64gsuwffb70l.cloudfront.net/68d29e79a897c8e646376bfe_1758633663159_2d1aa478.webp"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Needs Revision': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Admin Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor all content submissions, track collaboration progress, and maintain complete oversight of your Facebook Page content.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Content Queue</h3>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">3 Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">2 Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-600">1 Revision</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentCards.map((card) => (
              <div key={card.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{card.title}</h4>
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{card.author}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                    {card.status}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{card.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;