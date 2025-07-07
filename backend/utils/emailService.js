const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${contactData.company || 'Not provided'}</p>
        <p><strong>Service:</strong> ${contactData.service || 'Not specified'}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
        <hr>
        <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendDemoConfirmation = async (demoData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: demoData.email,
      subject: 'Demo Booking Confirmation - IITIAN CRAFT',
      html: `
        <h2>Demo Booking Confirmation</h2>
        <p>Dear ${demoData.name},</p>
        <p>Thank you for booking a demo with IITIAN CRAFT!</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Service:</strong> ${demoData.service}</li>
          <li><strong>Date:</strong> ${new Date(demoData.preferredDate).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${demoData.preferredTime}</li>
        </ul>
        <p>We will contact you shortly to confirm the details and schedule your demo.</p>
        <p>Best regards,<br>Team IITIAN CRAFT</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Demo confirmation email failed:', error);
    return false;
  }
};

const sendAdminDemoNotification = async (demoData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Demo Booking: ${demoData.service}`,
      html: `
        <h2>New Demo Booking</h2>
        <p><strong>Name:</strong> ${demoData.name}</p>
        <p><strong>Email:</strong> ${demoData.email}</p>
        <p><strong>Phone:</strong> ${demoData.phone}</p>
        <p><strong>Company:</strong> ${demoData.company || 'Not provided'}</p>
        <p><strong>Service:</strong> ${demoData.service}</p>
        <p><strong>Preferred Date:</strong> ${new Date(demoData.preferredDate).toLocaleDateString()}</p>
        <p><strong>Preferred Time:</strong> ${demoData.preferredTime}</p>
        <p><strong>Budget:</strong> ${demoData.budget || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${demoData.timeline || 'Not specified'}</p>
        <p><strong>Project Description:</strong></p>
        <p>${demoData.projectDescription}</p>
        <hr>
        <p><em>Booked on: ${new Date().toLocaleString()}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Admin demo notification failed:', error);
    return false;
  }
};

module.exports = {
  sendContactEmail,
  sendDemoConfirmation,
  sendAdminDemoNotification
}; 