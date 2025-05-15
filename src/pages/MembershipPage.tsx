import React from 'react';
import SubscriptionForm from '../components/membership/SubscriptionForm';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MembershipPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <SubscriptionForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default MembershipPage;