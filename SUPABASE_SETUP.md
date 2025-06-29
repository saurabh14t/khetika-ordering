# Supabase Database Setup Guide

This guide will help you set up Supabase database for your ERP Ordering System.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `erp-ordering-system`
   - Database Password: (create a strong password)
   - Region: Choose closest to your location
6. Click "Create new project"

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon public key

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials.

## Step 4: Set Up Database Tables

1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire content from `database-setup.sql` file
3. Paste it into the SQL Editor
4. Click "Run" to execute the script

This will create:
- `customers` table
- `inventory` table  
- `orders` table
- `order_items` table
- Indexes for performance
- Triggers for automatic updates
- Sample data

## Step 5: Verify Setup

1. Go to Table Editor in Supabase dashboard
2. You should see all 4 tables created
3. Check that sample data is populated

## Step 6: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. The application should now fetch real data from Supabase

## Database Schema Overview

### Customers Table
- `id`: UUID (Primary Key)
- `name`: Customer name
- `email`: Unique email address
- `phone`: Phone number
- `company`: Company name
- `total_orders`: Number of orders
- `total_spent`: Total amount spent
- `last_order`: Date of last order
- `status`: active/inactive/vip
- `created_at`, `updated_at`: Timestamps

### Inventory Table
- `id`: UUID (Primary Key)
- `name`: Product name
- `sku`: Unique SKU
- `category`: Product category
- `quantity`: Current stock
- `min_quantity`: Minimum stock level
- `price`: Product price
- `status`: in-stock/low-stock/out-of-stock
- `created_at`, `updated_at`: Timestamps

### Orders Table
- `id`: UUID (Primary Key)
- `customer_id`: Reference to customers table
- `customer_name`: Customer name (denormalized)
- `order_date`: Order date
- `status`: pending/processing/shipped/delivered/cancelled
- `total`: Order total
- `items_count`: Number of items
- `created_at`, `updated_at`: Timestamps

### Order Items Table
- `id`: UUID (Primary Key)
- `order_id`: Reference to orders table
- `inventory_id`: Reference to inventory table
- `product_name`: Product name (denormalized)
- `quantity`: Item quantity
- `price`: Item price
- `created_at`: Timestamp

## Features Included

### Automatic Updates
- Inventory status updates based on quantity
- Customer stats updates when orders are created
- Timestamps automatically managed

### Sample Data
- 6 sample customers
- 8 sample inventory items
- 6 sample orders with items
- Realistic Indian pricing in INR

### Performance Optimizations
- Indexes on frequently queried columns
- Efficient joins and relationships
- Optimized queries for analytics

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Check that variable names are correct

2. **Database connection errors**
   - Verify your Supabase URL and key
   - Check that your project is active
   - Ensure RLS (Row Level Security) is configured properly

3. **Missing tables**
   - Run the SQL script again
   - Check for any error messages in the SQL editor

4. **Sample data not appearing**
   - Check that the INSERT statements executed successfully
   - Verify the data in Table Editor

### Security Notes

- The current setup uses the anon key for client-side access
- For production, consider implementing Row Level Security (RLS)
- Add authentication for user-specific data access

## Next Steps

1. **Add Authentication**: Implement user login/signup
2. **Row Level Security**: Add RLS policies for data protection
3. **Real-time Updates**: Enable real-time subscriptions
4. **File Storage**: Add product images using Supabase Storage
5. **Email Notifications**: Set up email triggers for order updates

## Support

If you encounter any issues:
1. Check the Supabase documentation
2. Review the error messages in browser console
3. Verify your database schema matches the expected structure 