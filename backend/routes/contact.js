const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailService');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use((req, res, next) => {
  console.log('Contact route hit:', req.method, req.url, req.body);
  next();
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail(),
  body('message').trim().isLength({ min: 10, max: 1000 }),
  body('subject').if(body('subject').exists().notEmpty()).isLength({ min: 5, max: 100 }),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('service').optional().isIn([
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
    'content-writing',
    'other'
  ]).withMessage('Invalid service selection')
], async (req, res) => {
  console.log('Contact form data:', req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, company, subject, message, service } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'Validation failed' });
    }

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      service: service || 'other'
    });

    // Send email notification
    const emailSent = await sendContactEmail(contact);

    res.status(201).json({
      status: 'success',
      message: 'Contact form submitted successfully',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status
        },
        emailSent
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions (Admin only)
// @access  Private/Admin
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, service } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Contact.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        contacts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalContacts: count
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact submission (Admin only)
// @access  Private/Admin
router.get('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/contact/:id
// @desc    Update contact status (Admin only)
// @access  Private/Admin
router.put('/:id', protect, restrictTo('admin'), [
  body('status').isIn(['new', 'in-progress', 'contacted', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
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

    const { status, priority, notes } = req.body;
    const updateData = { status };
    
    if (priority) updateData.priority = priority;
    if (notes) updateData.notes = notes;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Contact updated successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact submission (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

module.exports = router; 