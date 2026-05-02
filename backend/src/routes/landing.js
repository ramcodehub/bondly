import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

// GET /api/landing/footer-links - Fetch footer links
router.get('/footer-links', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('footer_links')
      .select('category, title, path')
      .order('category')
      .order('order');

    if (error) throw error;

    // Group links by category
    const groupedLinks = data.reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push({
        name: link.title,
        href: link.path
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedLinks
    });
  } catch (error) {
    console.error('Error fetching footer links, providing fallback:', error);
    // Fallback data
    const fallbackLinks = {
      'Product': [
        { name: 'Features', href: '/#features' },
        { name: 'Solutions', href: '/#solutions' },
        { name: 'Pricing', href: '/#pricing' }
      ],
      'Company': [
        { name: 'About Us', href: '/crm#about' },
        { name: 'Contact', href: '/#contact' },
        { name: 'Careers', href: '/#careers' }
      ],
      'Resources': [
        { name: 'Documentation', href: '/#docs' },
        { name: 'Help Center', href: '/#help' },
        { name: 'Privacy Policy', href: '/#privacy' }
      ]
    };
    res.json({
      success: true,
      data: fallbackLinks,
      isFallback: true
    });
  }
});

// GET /api/landing/about-content - Fetch about page content
router.get('/about-content', async (req, res) => {
  try {
    // Fetch features
    const { data: featuresData, error: featuresError } = await supabase
      .from('about_features')
      .select('icon_name, title, description')
      .order('order');

    if (featuresError) throw featuresError;

    // Fetch testimonials
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from('about_testimonials')
      .select('initials, name, title, company, content, rating')
      .order('order');

    if (testimonialsError) throw testimonialsError;

    const features = featuresData.map(feature => ({
      icon: feature.icon_name,
      title: feature.title,
      description: feature.description
    }));

    const testimonials = testimonialsData.map(testimonial => ({
      initials: testimonial.initials,
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating
    }));

    res.json({
      success: true,
      data: {
        features,
        testimonials
      }
    });
  } catch (error) {
    console.error('Error fetching about content, providing fallback:', error.message);
    const fallbackAbout = {
      features: [
        { icon: 'Users', title: 'User Management', description: 'Comprehensive user management system with RBAC.' },
        { icon: 'LineChart', title: 'Advanced Analytics', description: 'Real-time insights into your business performance.' },
        { icon: 'Shield', title: 'Enterprise Security', description: 'Grade-A security protocols to protect your data.' }
      ],
      testimonials: [
        { initials: 'JD', name: 'John Doe', title: 'CEO', company: 'TechCorp', content: 'Bondly has transformed our operations completely.', rating: 5 }
      ]
    };
    res.json({
      success: true,
      data: fallbackAbout,
      isFallback: true
    });
  }
});

// GET /api/landing/services - Fetch services
router.get('/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('icon_name, title, description')
      .order('order');

    if (error) throw error;

    const services = data.map(service => ({
      icon: service.icon_name,
      title: service.title,
      description: service.description
    }));

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services, providing fallback:', error.message);
    const fallbackServices = [
      { icon: 'Target', title: 'Lead Management', description: 'Never lose a lead again with our automated tracking.' },
      { icon: 'DollarSign', title: 'Deals & Sales', description: 'Close more deals with our intuitive sales pipeline.' },
      { icon: 'CheckSquare', title: 'Task Tracking', description: 'Manage your daily activities and follow-ups efficiently.' }
    ];
    res.json({
      success: true,
      data: fallbackServices,
      isFallback: true
    });
  }
});

// GET /api/landing/hero-stats - Fetch hero section statistics
router.get('/hero-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_stats')
      .select('title, value, description')
      .order('order');

    if (error) throw error;

    const stats = data.map(stat => ({
      title: stat.title,
      value: stat.value,
      description: stat.description
    }));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching hero stats, providing fallback:', error.message);
    const fallbackStats = [
      { title: 'Customers', value: '10k+', description: 'Active Users' },
      { title: 'Growth', value: '250%', description: 'Yearly Increase' },
      { title: 'Support', value: '24/7', description: 'Availability' },
      { title: 'Uptime', value: '99.9%', description: 'Reliability' }
    ];
    res.json({
      success: true,
      data: fallbackStats,
      isFallback: true
    });
  }
});

export default router;