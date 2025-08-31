# Contact Form Implementation

This document describes the implementation of the contact form backend logic and Supabase database integration.

## Overview

The contact form collects user information and stores it in a Supabase database table. The implementation includes:

1. Database schema for contact submissions
2. Backend API endpoint for form submissions
3. Frontend form validation and submission
4. Success/error handling with personalized messages

## Database Schema

The contact_submissions table is defined in `backend/src/complete_contact_submissions_setup.sql`:

```sql
CREATE TABLE contact_submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    company_type VARCHAR(20),  -- 'individual' or 'company'
    company_name VARCHAR(150),  -- company name if company_type is 'company'
    location VARCHAR(150),      -- user's location
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
- `idx_contact_submissions_email` - for faster email lookups
- `idx_contact_submissions_created_at` - for faster date-based queries

### Security
- Row Level Security (RLS) enabled with permissive policies
- Public insert allowed (for form submissions)
- Authenticated read access for admin viewing

## Backend Implementation

### API Routes

1. **Frontend Next.js API Route**: `/api/contact-form` (POST)
   - File: `frontend/src/app/api/contact-form/route.ts`
   - Handles form validation and database insertion
   - Returns personalized success messages
   - Uses service role key to bypass RLS for public inserts

2. **Backend Express Route**: `/api/contact/submit` (POST)
   - File: `backend/src/routes/contact.js`
   - Alternative backend endpoint for form submissions

### Validation Rules

- `full_name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `message`: Required, minimum 10 characters
- `company_type`: Optional, defaults to 'individual'
- `company_name`: Required when company_type is 'company'
- `location`: Optional
- `subject`: Optional

## Frontend Implementation

### Components Updated

1. **Landing Page Contact Component**: `frontend/src/components/landing/contact.tsx`
2. **Full Contact Page**: `frontend/src/app/landing/contact/page.tsx`

### Features

- Form state management with React hooks
- Real-time validation
- Loading states during submission
- Success messages with user's name
- Error handling and display
- Conditional fields (company name when company type is selected)

## Testing

### Manual Testing

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to the contact page: http://localhost:3000/landing/contact

3. Fill out the form with valid data and submit

4. Check the Supabase dashboard to verify the data was inserted

### Automated Testing

Run the contact form test script:
```bash
cd backend
npm run test:contact
```

## Database Setup

To create the contact_submissions table in Supabase:

1. Copy the SQL from `backend/src/complete_contact_submissions_setup.sql`
2. Paste it into the Supabase SQL editor
3. Execute the query

## Environment Variables

Ensure the following environment variables are set:

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

## Security Considerations

- Form submissions are rate-limited through the API
- RLS policies restrict data access
- Input validation prevents malicious data
- Service role key is used in backend/server-side code only (not exposed to frontend)

## Troubleshooting

### Common Issues

1. **Form not submitting**: Check browser console for network errors
2. **Database errors**: Verify Supabase credentials and table schema
3. **Validation errors**: Ensure all required fields are properly filled
4. **RLS policy errors**: Run the complete setup script to fix policies

### Diagnostic Scripts

Use `backend/src/diagnose_contact_submissions.sql` to check the current state of the table and policies.

### Logs

Check the browser console and server logs for detailed error messages.