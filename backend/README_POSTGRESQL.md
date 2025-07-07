# PostgreSQL Integration for IITIAN CRAFT Backend

This document describes the PostgreSQL functionality that has been added to the main backend, originally from the iitiancraft backend.

## Overview

The backend now supports both MongoDB (existing) and PostgreSQL (new) databases. The PostgreSQL integration provides:
- User authentication and management
- Meeting scheduling and management
- Separate API endpoints for PostgreSQL operations

## Database Setup

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system.

### 2. Create Database
```sql
CREATE DATABASE iitiancraft;
```

### 3. Run Schema Scripts
Execute the SQL scripts in the `sql/` directory:

```bash
# Connect to your PostgreSQL database
psql -d iitiancraft

# Run the schema scripts
\i sql/create_users_table.sql
\i sql/create_meetings_table.sql
```

## Environment Configuration

Update your `config.env` file with PostgreSQL connection details:

```env
# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/iitiancraft
```

## API Endpoints

### PostgreSQL Authentication (`/api/pg/auth`)

- `POST /api/pg/auth/signup` - User registration
- `POST /api/pg/auth/signin` - User login
- `GET /api/pg/auth/profile` - Get user profile (protected)
- `POST /api/pg/auth/verify` - Verify JWT token

### PostgreSQL Meetings (`/api/pg/meetings`)

- `POST /api/pg/meetings/schedule` - Schedule a new meeting
- `GET /api/pg/meetings` - Get all meetings
- `GET /api/pg/meetings/pending` - Get pending meetings
- `GET /api/pg/meetings/:id` - Get meeting by ID
- `PATCH /api/pg/meetings/:id/status` - Update meeting status

## Database Models

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(100))
- `email` (VARCHAR(255), UNIQUE)
- `password_hash` (VARCHAR(255))

### Meetings Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255))
- `message` (TEXT)
- `status` (VARCHAR(50)) - 'pending', 'confirmed', 'completed', 'cancelled'
- `meeting_link` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Usage Examples

### User Registration
```javascript
fetch('/api/pg/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
```

### Schedule Meeting
```javascript
fetch('/api/pg/meetings/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'I would like to discuss a project'
  })
});
```

## Dependencies

The following new dependencies have been added:
- `pg` - PostgreSQL client for Node.js

## Notes

- The PostgreSQL functionality runs alongside the existing MongoDB setup
- Both databases can be used simultaneously
- PostgreSQL endpoints are prefixed with `/api/pg/` to distinguish them from MongoDB endpoints
- JWT tokens are used for authentication in both systems
- The meeting system includes status tracking and admin management features 