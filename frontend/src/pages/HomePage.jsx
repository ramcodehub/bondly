import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  FileText,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/apiService';

const HomePage = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOpportunities: 0,
    totalAccounts: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState({
    carousel: true,
    stats: true,
    activities: true
  });
  const [error, setError] = useState(null);

  // Fetch carousel data
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        console.log('Fetching carousel data...');
        const data = await apiService.getHomeCarousel();
        console.log('Carousel data received:', data);
        console.table(data); // Log data as a table
        setCarouselItems(data);
      } catch (err) {
        console.error('Error fetching carousel:', err);
        setError('Failed to load carousel');
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
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  console.log('Current carouselItems state:', carouselItems);

  // Stats cards data
  const statsCards = [
    { 
      icon: <Users className="h-8 w-8 text-blue-600" />, 
      label: 'Total Leads', 
      value: stats.totalLeads,
      color: 'bg-blue-100'
    },
    { 
      icon: <Briefcase className="h-8 w-8 text-green-600" />, 
      label: 'Opportunities', 
      value: stats.totalOpportunities,
      color: 'bg-green-100'
    },
    { 
      icon: <UserCheck className="h-8 w-8 text-purple-600" />, 
      label: 'Accounts', 
      value: stats.totalAccounts,
      color: 'bg-purple-100'
    },
    { 
      icon: <FileText className="h-8 w-8 text-orange-600" />, 
      label: 'Contacts', 
      value: stats.totalContacts,
      color: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carousel Section */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        {loading.carousel ? (
          <div className="h-full w-full bg-gray-200 animate-pulse"></div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="h-full"
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id} className="relative h-[400px] md:h-[500px] w-full">
                <img 
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                <div className="relative h-full flex flex-col justify-center text-white px-8 md:px-16 lg:px-24 z-20">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{item.title}</h1>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl">{item.description}</p>
                  <Link 
                    to={item.cta_link || '#'}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-fit"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;