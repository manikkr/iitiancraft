const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Schedule a new meeting
router.post('/schedule', async (req, res) => {
  console.log('Meeting form data:', req.body);
  try {
    const { name, email, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.'
      });
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }
    const meeting = new Meeting({ name, email, message });
    await meeting.save();
    res.status(201).json({
      success: true,
      message: 'Meeting request submitted successfully.',
      data: {
        id: meeting._id,
        name: meeting.name,
        email: meeting.email,
        status: meeting.status
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// Get all meetings (admin)
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ created_at: -1 });
    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get meeting by ID
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.'
      });
    }
    res.json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// Update meeting status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.'
      });
    }
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.'
      });
    }
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status, meetingLink, updatedAt: Date.now() },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.'
      });
    }
    res.json({
      success: true,
      message: 'Meeting status updated successfully.',
      data: meeting
    });
  } catch (error) {
    console.error('Error updating meeting status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

module.exports = router; 