import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  FileText,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/apiService';

const HomePage = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState({ carousel: true, stats: true });
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOpportunities: 0,
    totalAccounts: 0,
    totalContacts: 0
  });

  // Fetch carousel data
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await apiService.getHomeCarousel();
        setCarouselItems(data);
      } catch (err) {
        setError('Failed to load carousel');
        console.error('Error fetching carousel:', err);
      } finally {
        setLoading(prev => ({ ...prev, carousel: false }));
      }
    };

    fetchCarousel();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getHomeStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselItems.length <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  if (loading.carousel && loading.stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error loading content</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        {carouselItems.length > 0 ? (
          <>
            {/* Carousel Items */}
            <div 
              className="h-full flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div 
                  key={item.id} 
                  className="w-full flex-shrink-0 relative"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '0 20px'
                  }}
                >
                  <div className="max-w-4xl mx-auto text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                      {item.title || 'Discover Your Next Adventure'}
                    </h1>
                    {item.description && (
                      <p className="text-xl md:text-2xl mb-8">
                        {item.description}
                      </p>
                    )}
                    {item.cta_link && (
                      <Link 
                        href={item.cta_link}
                        className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
                      >
                        {item.cta_text || 'Learn More'} <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {carouselItems.length > 1 && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {carouselItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Fallback when no carousel items are available
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Our Platform
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Get started by adding carousel items from the admin panel
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">
                {loading.stats ? '...' : stats.totalLeads.toLocaleString()}+ 
              </h3>
              <p className="text-gray-600">Total Leads</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">
                {loading.stats ? '...' : stats.totalOpportunities}+ 
              </h3>
              <p className="text-gray-600">Opportunities</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">
                {loading.stats ? '...' : stats.totalAccounts}+ 
              </h3>
              <p className="text-gray-600">Accounts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">
                {loading.stats ? '...' : stats.totalContacts}+ 
              </h3>
              <p className="text-gray-600">Contacts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;