# IITIAN CRAFT Backend API

A complete Node.js/Express backend with MongoDB integration for the IITIAN CRAFT website.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access
- 📧 **Email Notifications** - Automated email sending for contact forms and demo bookings
- 📊 **Admin Dashboard** - Complete admin panel for managing users, contacts, and demos
- 🛡️ **Security** - Rate limiting, input validation, and security headers
- 📱 **RESTful API** - Clean, well-documented API endpoints
- 🗄️ **MongoDB Integration** - Robust database with Mongoose ODM

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update `config.env` with: `MONGODB_URI=mongodb://localhost:27017/iitiancraft`

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `config.env` with your Atlas connection string

### 3. Configure Environment Variables
Edit `config.env` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/iitiancraft

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Email Configuration (for contact forms)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile

### Contact Forms
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `GET /api/contact/:id` - Get single contact (Admin)
- `PUT /api/contact/:id` - Update contact status (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

### Demo Bookings
- `POST /api/demo` - Book a demo
- `GET /api/demo` - Get all demo bookings (Admin)
- `GET /api/demo/:id` - Get single demo (Admin)
- `PUT /api/demo/:id` - Update demo status (Admin)
- `DELETE /api/demo/:id` - Delete demo (Admin)

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `GET /api/services/statistics` - Get service statistics (Admin)

### User Management (Admin Only)
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get single user
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

### Health Check
- `GET /api/health` - API health status

## Database Models

### User
- Authentication fields (name, email, password)
- Role-based access (user, admin)
- Profile information (phone, company)
- Timestamps and last login tracking

### Contact
- Contact form submissions
- Service categorization
- Status tracking (new, in-progress, contacted, completed)
- Priority levels and admin notes

### Demo
- Demo booking requests
- Service selection and scheduling
- Project details and budget information
- Status management (pending, confirmed, completed, cancelled)

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for passwords
- **Input Validation** - Express-validator for all inputs
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **CORS Protection** - Configurable cross-origin requests
- **Security Headers** - Helmet.js for security headers
- **Role-Based Access** - Admin and user role management

## Email Features

- **Contact Form Notifications** - Admin notifications for new contacts
- **Demo Confirmations** - Customer confirmation emails
- **Admin Notifications** - Demo booking notifications
- **Configurable SMTP** - Support for Gmail, Outlook, etc.

## Development

### Project Structure
```
backend/
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── config.env       # Environment variables
├── package.json     # Dependencies
├── server.js        # Main server file
└── README.md        # This file
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

## Production Deployment

1. **Environment Variables**: Update all environment variables for production
2. **MongoDB Atlas**: Use MongoDB Atlas for cloud database
3. **Email Service**: Configure production email service
4. **Security**: Change JWT secret and enable HTTPS
5. **Monitoring**: Add logging and monitoring tools

## Frontend Integration

The frontend React app can connect to this API using:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Example API call
const response = await fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(contactData)
});
```

## Support

For issues and questions, please check the API documentation or contact the development team. 