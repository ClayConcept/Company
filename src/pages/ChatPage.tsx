import React from 'react';
import ChatInterface from '../components/dashboard/ChatInterface';
import TaskCanvas from '../components/dashboard/TaskCanvas';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold uppercase mb-6">Project Assistant</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
            <div className="h-full border-2 border-black">
              <ChatInterface />
            </div>
            <div className="h-full border-2 border-black">
              <TaskCanvas />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;