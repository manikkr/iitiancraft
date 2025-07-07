const express = require('express');
const { body, validationResult } = require('express-validator');
const Demo = require('../models/Demo');
const { sendDemoConfirmation, sendAdminDemoNotification } = require('../utils/emailService');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/demo
// @desc    Book a demo
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('company').optional().trim(),
  body('service').isIn([
    'website-development',
    'app-development',
    'game-development',
    'logo-design',
    'seo-backlinks',
    'ui-ux-design',
    'video-production',
    'chatbot-development',
    'crm-erp-integration',
    'custom-api-development',
    'content-writing'
  ]).withMessage('Invalid service selection'),
  body('preferredDate').isISO8601().withMessage('Please provide a valid date'),
  body('preferredTime').isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid time selection'),
  body('projectDescription').trim().isLength({ min: 10, max: 500 }).withMessage('Project description must be between 10 and 500 characters'),
  body('budget').optional().isIn(['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'not-sure']).withMessage('Invalid budget selection'),
  body('timeline').optional().isIn(['asap', '1-month', '2-3-months', '3-6-months', '6-months+']).withMessage('Invalid timeline selection')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      company,
      service,
      preferredDate,
      preferredTime,
      projectDescription,
      budget,
      timeline
    } = req.body;

    // Create demo booking
    const demo = await Demo.create({
      name,
      email,
      phone,
      company,
      service,
      preferredDate,
      preferredTime,
      projectDescription,
      budget,
      timeline
    });

    // Send confirmation emails
    const confirmationSent = await sendDemoConfirmation(demo);
    const adminNotificationSent = await sendAdminDemoNotification(demo);

    res.status(201).json({
      status: 'success',
      message: 'Demo booked successfully',
      data: {
        demo: {
          id: demo._id,
          name: demo.name,
          email: demo.email,
          service: demo.service,
          preferredDate: demo.preferredDate,
          preferredTime: demo.preferredTime,
          status: demo.status
        },
        emailsSent: {
          confirmation: confirmationSent,
          adminNotification: adminNotificationSent
        }
      }
    });
  } catch (error) {
    console.error('Demo booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/demo
// @desc    Get all demo bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, service } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;

    const demos = await Demo.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Demo.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        demos,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalDemos: count
      }
    });
  } catch (error) {
    console.error('Get demos error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/demo/:id
// @desc    Get single demo booking (Admin only)
// @access  Private/Admin
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const demo = await Demo.findById(req.params.id);
    
    if (!demo) {
      return res.status(404).json({
        status: 'error',
        message: 'Demo booking not found'
      });
    }

    res.json({
      status: 'success',
      data: { demo }
    });
  } catch (error) {
    console.error('Get demo error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/demo/:id
// @desc    Update demo status (Admin only)
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), [
  body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, notes } = req.body;
    const updateData = { status };
    
    if (notes) updateData.notes = notes;

    const demo = await Demo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!demo) {
      return res.status(404).json({
        status: 'error',
        message: 'Demo booking not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Demo booking updated successfully',
      data: { demo }
    });
  } catch (error) {
    console.error('Update demo error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/demo/:id
// @desc    Delete demo booking (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const demo = await Demo.findByIdAndDelete(req.params.id);
    
    if (!demo) {
      return res.status(404).json({
        status: 'error',
        message: 'Demo booking not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Demo booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete demo error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 