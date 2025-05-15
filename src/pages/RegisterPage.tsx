import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-100">
        <RegisterForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;