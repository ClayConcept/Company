import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, MessageSquare, CalendarDays, CreditCard } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 relative font-mono">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight uppercase">
                DESIGN SERVICES <br /> WITH <span className="border-b-4 border-white">BRUTAL</span> EFFICIENCY
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Break down your design projects into manageable tasks. 
                Our token system and AI assistance help you organize and execute with precision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg">
                    START YOUR PROJECT
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-white border-white hover:bg-gray-900">
                    LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 uppercase">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6" hoverable>
                <div className="flex justify-center mb-4">
                  <MessageSquare size={48} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2 uppercase">AI CHAT ASSISTANT</h3>
                <p className="text-center">
                  Describe your project to our AI, and it will help break it down into manageable tasks and estimate token costs.
                </p>
              </Card>
              
              <Card className="p-6" hoverable>
                <div className="flex justify-center mb-4">
                  <ScrollText size={48} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2 uppercase">TASK CANVAS</h3>
                <p className="text-center">
                  Organize your tasks hierarchically, assign token values, and edit them as your project evolves.
                </p>
              </Card>
              
              <Card className="p-6" hoverable>
                <div className="flex justify-center mb-4">
                  <CalendarDays size={48} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2 uppercase">KANBAN & GANTT</h3>
                <p className="text-center">
                  Track your project's progress with Kanban boards and visualize timelines with Gantt charts.
                </p>
              </Card>
              
              <Card className="p-6" hoverable>
                <div className="flex justify-center mb-4">
                  <CreditCard size={48} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2 uppercase">TOKEN SYSTEM</h3>
                <p className="text-center">
                  Manage your design budget with our token system. One token equals 30 minutes of design work.
                </p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 uppercase">Ready to Streamline Your Design Process?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join today and get access to our brutally efficient design management system.
            </p>
            <Link to="/register">
              <Button size="lg">
                CREATE YOUR ACCOUNT
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;