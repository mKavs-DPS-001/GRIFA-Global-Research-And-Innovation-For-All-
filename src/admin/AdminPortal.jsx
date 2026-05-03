import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Overview from './pages/Overview';
import Enrollments from './pages/Enrollments';
import TierAnalytics from './pages/TierAnalytics';
import CommunityReports from './pages/CommunityReports';
import Inbox from './pages/Inbox';
import ScientistManager from './pages/ScientistManager';
import ProblemManager from './pages/ProblemManager';
import PlansSimulator from './pages/PlansSimulator';
import Settings from './pages/Settings';

export default function AdminPortal() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [inboxUnread, setInboxUnread] = useState(0);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':    return <Overview />;
      case 'enrollments': return <Enrollments />;
      case 'analytics':   return <TierAnalytics />;
      case 'community':   return <CommunityReports />;
      case 'inbox':       return <Inbox onUnreadChange={setInboxUnread} />;
      case 'problems':    return <ProblemManager />;
      case 'scientists':  return <ScientistManager />;
      case 'simulator':   return <PlansSimulator />;
      case 'settings':    return <Settings />;
      default:            return <Overview />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} navigate={setCurrentPage} inboxUnread={inboxUnread}>
      {renderPage()}
    </AdminLayout>
  );
}
