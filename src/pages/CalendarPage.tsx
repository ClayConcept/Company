import React from 'react';
import CalendarTabs from '../components/dashboard/CalendarTabs';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CalendarPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold uppercase mb-6">Project Timeline</h1>
          
          <div className="border-2 border-black h-[calc(100vh-250px)]">
            <CalendarTabs />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CalendarPage;