# Database Setup Instructions

## 🗄️ **Step 1: Access Your Supabase Dashboard**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `vknqythzsdpwyycfmujz`

## 🔧 **Step 2: Run the SQL Script**

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the entire contents of `supabase-setup.sql` into the editor
4. Click **"Run"** to execute the script

## ✅ **Step 3: Verify Tables Created**

After running the script, you should see these tables in your **"Table Editor"**:

- ✅ `contacts` - For managing contacts
- ✅ `companies` - For managing companies  
- ✅ `deals` - For managing sales deals
- ✅ `tasks` - For managing tasks
- ✅ `profiles` - For user profiles
- ✅ `subscriptions` - For subscription data
- ✅ `payment_methods` - For payment methods
- ✅ `invoices` - For invoice data

## 🧪 **Step 4: Test the Dashboard**

1. Start your frontend development server: `npm run dev`
2. Navigate to `/dashboard/contacts` - Should show sample contacts
3. Navigate to `/dashboard/companies` - Should show sample companies
4. Navigate to `/dashboard/deals` - Should show sample deals
5. Navigate to `/dashboard/tasks` - Should show sample tasks

## 🚨 **Troubleshooting**

If you get errors:

1. **Check RLS Policies** - Make sure Row Level Security is properly configured
2. **Verify Environment Variables** - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. **Check Console Logs** - Look for any error messages in the browser console

## 📊 **Sample Data**

The script includes sample data for testing:
- 3 sample contacts
- 3 sample companies  
- 3 sample deals
- 3 sample tasks

You can modify or add more data through the Supabase dashboard or by updating the SQL script.



