# BuildConnect - Setup Guide

Welcome! This guide will help you set up and run the BuildConnect platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Resend account for email notifications (free tier works)

### Step 1: Install Dependencies

```bash
yarn install
# or
npm install
```

### Step 2: Environment Variables

Your `.env` file is already configured with the correct credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://oeccxntwqrlgwvretorl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend
RESEND_API_KEY=re_hGfrnERR_8b1Ng4EuEk87nL7x4x53uWt8
```

✅ All credentials are already set up!

### Step 3: Set Up Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: **oeccxntwqrlgwvretorl**
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

You should see a success message: "BuildConnect database schema created successfully!"

This will create all necessary tables:
- ✅ profiles
- ✅ contractors
- ✅ projects
- ✅ bids
- ✅ reviews
- ✅ All indexes and Row Level Security (RLS) policies

### Step 4: Run the Development Server

```bash
yarn dev
# or
npm run dev
```

The application will start at: **http://localhost:3000**

---

## 📋 Testing the Application

### Create Test Accounts

#### 1. Create a Builder Account
1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Select "I am a Builder"
4. Fill in details:
   - Full Name: John Builder
   - Email: john@example.com
   - Phone: 9876543210
   - Company Name: ABC Constructions
   - Password: password123
5. Click "Create Account"
6. You'll be redirected to the builder dashboard

#### 2. Create a Contractor Account
1. Open a new incognito/private browser window
2. Go to http://localhost:3000
3. Click "Get Started" or "Sign Up"
4. Select "I am a Contractor"
5. Fill in details:
   - Full Name: Sharma Contractor
   - Email: sharma@example.com
   - Phone: 9876543211
   - Company Name: Sharma Constructions
   - Password: password123
6. Click "Create Account"
7. You'll be redirected to the contractor dashboard

### Complete the Bidding Workflow

#### As Builder (Window 1):
1. **Complete Profile (Optional):**
   - Go to Profile section
   - Update any details

2. **Post a Project:**
   - Click "Post New Project"
   - Fill in project details:
     - Title: "Residential Building Construction"
     - Type: Residential
     - Description: "Need contractors for a 3-story residential building"
     - City: Patna
     - Location: "Boring Road, Near Gandhi Maidan"
     - Budget: ₹1500000 - ₹2000000
     - Select specializations: Plumbing, Electrical, Civil
     - Start Date: (any future date)
     - Duration: 60 days
     - Bidding Deadline: (any future datetime)
   - Click "Post Project"

3. **View Your Projects:**
   - Go to "My Projects"
   - You should see your newly posted project

#### As Contractor (Window 2):
1. **Complete Profile First:**
   - Go to "My Profile"
   - Add specializations: Plumbing, Electrical, Civil
   - Add service locations: Patna, Lucknow
   - Add experience years: 10
   - Add team size: 20
   - Add bio (optional)
   - Click "Save Changes"

2. **Browse Projects:**
   - Go to "Browse Projects"
   - You should see the project posted by the builder
   - Apply filters if needed

3. **Submit a Bid:**
   - Click on the project
   - Fill in bid details:
     - Quoted Price: ₹1700000
     - Duration: 55 days
     - Proposal: "We have extensive experience in residential construction..."
   - Click "Submit Bid"

4. **Check Email:**
   - Builder should receive an email: "New bid received"
   - Check the email address you used for the builder account

5. **View Your Bids:**
   - Go to "My Bids"
   - You should see your submitted bid with status "Pending"

#### As Builder (Window 1):
1. **View Bids:**
   - Go to "My Projects"
   - Click on your project
   - Click on "Bids" tab
   - You should see the contractor's bid

2. **Accept the Bid:**
   - Click "Accept Bid"
   - Confirm the action
   - Project status changes to "Awarded"

3. **Check Emails:**
   - Contractor receives: "Bid Accepted" email
   - Other contractors (if any) receive: "Bid Rejected" email

#### As Contractor (Window 2):
1. **Check Bid Status:**
   - Go to "My Bids"
   - Your bid status should now show "Accepted"
   - You'll see a green success message

2. **View Awarded Projects:**
   - Go to "My Profile"
   - Scroll down to see "Awarded Projects History"

---

## 🎯 Features Checklist

### ✅ Implemented Features

**Authentication:**
- [x] Sign up (Builder/Contractor)
- [x] Login
- [x] Logout
- [x] Protected routes with role-based access

**Builder Features:**
- [x] Dashboard with statistics
- [x] Post new projects
- [x] View all projects with filters
- [x] View project details
- [x] View bids on projects
- [x] Accept/Reject bids
- [x] Project status management

**Contractor Features:**
- [x] Dashboard with statistics
- [x] Browse projects with filters (city, type, search)
- [x] View project details
- [x] Submit bids
- [x] Update bids (before deadline)
- [x] View bid history with status
- [x] Profile management
- [x] Specializations & service locations
- [x] Portfolio display

**Email Notifications:**
- [x] Bid received notification (to builder)
- [x] Bid accepted notification (to contractor)
- [x] Bid rejected notification (to contractor)

**UI/UX:**
- [x] Modern, clean design with Tailwind CSS
- [x] Responsive (mobile, tablet, desktop)
- [x] Loading states
- [x] Error handling
- [x] Success messages
- [x] Badges (NEW, URGENT, status badges)

---

## 🔧 Troubleshooting

### Database Errors

**Error: "relation 'profiles' does not exist"**
- Solution: Run the `supabase-schema.sql` file in Supabase SQL Editor

**Error: "permission denied for table..."**
- Solution: Make sure you ran the entire schema file including RLS policies

### Email Not Sending

**Emails not being received:**
1. Check Resend dashboard for logs
2. Check spam/junk folder
3. Verify RESEND_API_KEY in `.env`
4. Note: Resend free tier uses `onboarding@resend.dev` - update in `lib/email.js` if you have a verified domain

### Authentication Issues

**Can't sign up:**
- Check Supabase dashboard → Authentication → Settings
- Make sure email authentication is enabled
- Check browser console for errors

**Can't login:**
- Verify credentials
- Check Supabase → Authentication → Users to see if user was created
- Try signing up again with a different email

### Contractor Profile Errors

**"Could not fetch contractor data":**
- This happens if contractor record wasn't created during signup
- Go to Supabase → Table Editor → contractors
- Manually create a record with your user_id

---

## 📁 Project Structure

```
buildconnect/
├── app/
│   ├── (public)/               # Public pages
│   │   ├── page.js            # Landing page
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── builder/               # Builder-only pages
│   │   ├── dashboard/         # Builder dashboard
│   │   ├── projects/          # Project management
│   │   │   ├── page.jsx       # List projects
│   │   │   ├── new/           # Create project
│   │   │   └── [id]/          # Project detail & bids
│   │   └── profile/           # Builder profile
│   ├── contractor/            # Contractor-only pages
│   │   ├── dashboard/         # Contractor dashboard
│   │   ├── projects/          # Browse projects
│   │   │   ├── page.jsx       # Browse all
│   │   │   └── [id]/          # Detail & submit bid
│   │   ├── bids/              # Bid history
│   │   └── profile/           # Contractor profile
│   └── api/                   # API routes
│       └── emails/            # Email notification APIs
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/                  # Auth forms
│   └── layout/                # Layout components
├── lib/
│   ├── supabase/              # Supabase clients
│   │   ├── client.js          # Browser client
│   │   └── server.js          # Server client
│   ├── email.js               # Email functions
│   └── utils.js               # Utilities
├── context/
│   └── UserContext.jsx        # User state management
├── middleware.js              # Route protection
└── supabase-schema.sql        # Database schema
```

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
6. Click "Deploy"

Your app will be live at: `https://your-project.vercel.app`

### Update Email FROM Address

For production, you should use a verified domain in Resend:

1. Go to Resend dashboard
2. Add and verify your domain
3. Update `lib/email.js`:
   ```javascript
   const FROM_EMAIL = 'BuildConnect <noreply@yourdomain.com>';
   ```

---

## 📊 Database Schema Overview

### Tables:
1. **profiles** - User basic info (both builders & contractors)
2. **contractors** - Contractor-specific data
3. **projects** - Projects posted by builders
4. **bids** - Bids submitted by contractors
5. **reviews** - Reviews/ratings (for future use)

### Key Relationships:
- profiles ← contractors (one-to-one)
- profiles ← projects (one-to-many, builder)
- projects ← bids (one-to-many)
- profiles ← bids (one-to-many, contractor)

---

## 🐛 Known Limitations (MVP)

- No real payment integration (just showing amounts)
- No real-time notifications (email only)
- No file upload for project documents or portfolio images yet
- No advanced search/filtering
- No contractor verification process (just a status field)
- No messaging system between builders and contractors

These can be added in future iterations!

---

## 🎉 Success!

If you've followed all steps, you should now have a fully functional BuildConnect platform!

**What's working:**
✅ User signup and authentication
✅ Builder can post projects
✅ Contractor can browse and bid on projects
✅ Builder can view and accept/reject bids
✅ Email notifications at key points
✅ Profile management for contractors
✅ Dashboard with statistics

**Need help?**
- Check the troubleshooting section above
- Review the code comments
- Check browser console for errors
- Check Supabase logs for database errors

Happy building! 🏗️
