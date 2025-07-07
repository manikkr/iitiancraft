const express = require('express');
const Contact = require('../models/Contact');
const Demo = require('../models/Demo');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services with statistics
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = [
      {
        id: 'website-development',
        name: 'Website Development',
        description: 'Get modern, fast, responsive websites for your business or brand.',
        icon: 'FaLaptopCode',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'app-development',
        name: 'App Development',
        description: 'We build Android & iOS apps tailored to your goals.',
        icon: 'FaMobileAlt',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'game-development',
        name: 'Game Development',
        description: '2D/3D browser or mobile games built from scratch.',
        icon: 'FaGamepad',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'logo-design',
        name: 'Logo Design',
        description: 'High-quality branding & logos that define your identity.',
        icon: 'FaPaintBrush',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'seo-backlinks',
        name: 'SEO & Backlinks',
        description: 'Rank higher on Google with optimized SEO strategies.',
        icon: 'FaSearch',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'ui-ux-design',
        name: 'UI/UX Design',
        description: 'Clean, beautiful, user-friendly interfaces for web and apps.',
        icon: 'FaUserAlt',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'video-production',
        name: 'Video Production & Animation',
        description: 'Professional video content and engaging animations for your brand.',
        icon: 'FaVideo',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'chatbot-development',
        name: 'Chatbot Development',
        description: 'Intelligent chatbots to enhance customer service and engagement.',
        icon: 'FaRobot',
        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'crm-erp-integration',
        name: 'CRM/ERP Integrations',
        description: 'Seamless integration of business systems for better workflow.',
        icon: 'FaCogs',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'custom-api-development',
        name: 'Custom API Development',
        description: 'Robust APIs to connect your applications and services.',
        icon: 'FaCode',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'content-writing',
        name: 'Content Writing & Copywriting',
        description: 'Compelling content that converts visitors into customers.',
        icon: 'FaPen',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80'
      }
    ];

    res.json({
      status: 'success',
      data: { services }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/services/statistics
// @desc    Get service statistics (Admin only)
// @access  Private/Admin
router.get('/statistics', protect, restrictTo('admin'), async (req, res) => {
  try {
    // Get contact form statistics
    const contactStats = await Contact.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ]);

    // Get demo booking statistics
    const demoStats = await Demo.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ]);

    // Get total counts
    const totalContacts = await Contact.countDocuments();
    const totalDemos = await Demo.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'new' });
    const pendingDemos = await Demo.countDocuments({ status: 'pending' });

    res.json({
      status: 'success',
      data: {
        contactStats,
        demoStats,
        totals: {
          contacts: totalContacts,
          demos: totalDemos,
          pendingContacts,
          pendingDemos
        }
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    const services = {
      'website-development': {
        id: 'website-development',
        name: 'Website Development',
        description: 'Get modern, fast, responsive websites for your business or brand.',
        longDescription: 'We create stunning, high-performance websites that drive results. Our websites are built with the latest technologies, ensuring they are fast, secure, and optimized for search engines.',
        features: [
          'Responsive Design',
          'SEO Optimization',
          'Fast Loading Speed',
          'Mobile-First Approach',
          'Content Management System',
          'E-commerce Integration'
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Next.js', 'WordPress'],
        icon: 'FaLaptopCode',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'
      },
      'app-development': {
        id: 'app-development',
        name: 'App Development',
        description: 'We build Android & iOS apps tailored to your goals.',
        longDescription: 'Transform your ideas into powerful mobile applications. We develop native and cross-platform apps that provide exceptional user experiences and drive business growth.',
        features: [
          'Native iOS & Android Development',
          'Cross-Platform Solutions',
          'UI/UX Design',
          'App Store Optimization',
          'Push Notifications',
          'Offline Functionality'
        ],
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS'],
        icon: 'FaMobileAlt',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
      }
      // Add more services as needed
    };

    const service = services[serviceId];
    
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 