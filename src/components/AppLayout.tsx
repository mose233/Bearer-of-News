import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import HeroSection from './HeroSection';
import WorkflowSection from './WorkflowSection';
import DashboardPreview from './DashboardPreview';
import AIFeaturesSection from './AIFeaturesSection';
import TeamSection from './TeamSection';
import PricingSection from './PricingSection';
import ComplianceSection from './ComplianceSection';
import Footer from './Footer';
import CTASection from './CTASection';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={toggleSidebar} />
      <main>
        <HeroSection />
        <WorkflowSection />
        <DashboardPreview />
        <AIFeaturesSection />
        <TeamSection />
        <PricingSection />
        <ComplianceSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
