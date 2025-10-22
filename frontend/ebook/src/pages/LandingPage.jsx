import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/landing/Footer'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading session...</div>;
    }
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default LandingPage;
 