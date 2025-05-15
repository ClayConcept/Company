import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CalendarDays, CreditCard } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold uppercase mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username || 'User'}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="inline-block px-4 py-2 bg-black text-white font-bold text-sm uppercase">
                {user?.subscription || 'Free'} Plan
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link to="/chat">
              <Card className="p-6 h-48 flex flex-col justify-between transition-all hover:-translate-y-2" hoverable>
                <div className="flex-1">
                  <MessageSquare size={32} className="mb-3" />
                  <h2 className="text-xl font-bold uppercase mb-2">Chat Assistant</h2>
                  <p className="text-sm">
                    Break down your project into tasks with our AI assistant.
                  </p>
                </div>
                <div className="text-sm font-bold uppercase">Go to Chat →</div>
              </Card>
            </Link>
            
            <Link to="/calendar">
              <Card className="p-6 h-48 flex flex-col justify-between transition-all hover:-translate-y-2" hoverable>
                <div className="flex-1">
                  <CalendarDays size={32} className="mb-3" />
                  <h2 className="text-xl font-bold uppercase mb-2">Project Timeline</h2>
                  <p className="text-sm">
                    Manage your tasks with Kanban boards and Gantt charts.
                  </p>
                </div>
                <div className="text-sm font-bold uppercase">Go to Calendar →</div>
              </Card>
            </Link>
            
            <Link to="/membership">
              <Card className="p-6 h-48 flex flex-col justify-between transition-all hover:-translate-y-2" hoverable>
                <div className="flex-1">
                  <CreditCard size={32} className="mb-3" />
                  <h2 className="text-xl font-bold uppercase mb-2">Membership</h2>
                  <p className="text-sm">
                    Manage your subscription and token allocations.
                  </p>
                </div>
                <div className="text-sm font-bold uppercase">Go to Membership →</div>
              </Card>
            </Link>
          </div>
          
          <Card className="p-6 mb-10">
            <h2 className="text-xl font-bold uppercase mb-4">Quick Guide</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">1. Create Tasks</h3>
                <p className="text-sm">
                  Use the Chat Assistant to break down your project into tasks. Our AI will help you 
                  estimate the token cost for each task.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">2. Organize Tasks</h3>
                <p className="text-sm">
                  Group related tasks together on the Task Canvas. Each task is assigned a token value 
                  based on the estimated time required (1 token = 30 minutes).
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">3. Manage Workflow</h3>
                <p className="text-sm">
                  Use the Kanban board to track the progress of your tasks through different stages.
                  The Gantt chart provides a timeline view of your approved tasks.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">4. Token Rules</h3>
                <p className="text-sm">
                  Remember that each day can only accommodate up to 2 tokens worth of tasks. 
                  Tasks under 30 minutes (less than 1 token) are free, with one free task allowed per day.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;