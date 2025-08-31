import express from 'express';
import supabase from '../config/supabase.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    // Fetch home content sections
    const { data: homeContent, error: contentError } = await supabase
      .from('home_content')
      .select('*')
      .order('order', { ascending: true });

    // Fetch carousel images
    const { data: carouselImages, error: carouselError } = await supabase
      .from('carousel_images')
      .select('*')
      .order('order', { ascending: true });

    if (contentError || carouselError) {
      throw contentError || carouselError;
    }

    res.json({
      hero: homeContent?.find((item) => item.section === 'hero') || null,
      featured: (homeContent || []).filter((item) => item.section === 'featured'),
      carousel: carouselImages || [],
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ message: 'Failed to fetch home content', error: error.message });
  }
});

export default router;