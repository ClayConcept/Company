import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white font-mono py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">BRUTAL.DESIGN</h3>
            <p className="text-sm">
              Innovative design services with a brutalist aesthetic.
              Breaking projects into manageable chunks for efficient execution.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:underline">
                  Membership
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: hello@brutal.design</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Location: Brutalist Building, Digital City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
          <p>&copy; {currentYear} BRUTAL.DESIGN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;