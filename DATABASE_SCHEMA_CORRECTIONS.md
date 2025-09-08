# Database Schema Corrections for Phase 2 Implementation

## Overview
This document explains the corrections made to the Phase 2 database schema implementation to align with the actual Supabase database structure used in the Bondly CRM system.

## Database Structure Analysis

### Companies Table
The CRM system uses a [companies](file://c:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\frontend\src\lib\stores\mock-data.ts#L218-L218) table (not [accounts](file://c:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\backend\src\create_account_table.sql#L2-L2)) with the following characteristics:
- Primary key: `id` (UUID type)
- Table name: `companies` (plural)

### Contacts Table
The CRM system uses a [contacts](file://c:\Users\sathi\OneDrive\Desktop\NextGen_AI\Travels\backend\src\create_contact_table.sql#L1-L1) table with the following characteristics:
- Primary key: `id` (SERIAL/INTEGER type)
- Table name: `contacts` (plural)

## Corrections Made

### 1. Transactions Table
**Original (incorrect):**
```sql
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  account_id INT REFERENCES accounts(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Corrected:**
```sql
CREATE TABLE IF NOT EXISTS public.transactions (
  id SERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Changes:**
- Changed `account_id` to `company_id`
- Changed data type from `INT` to `UUID` to match the companies table primary key
- Changed reference from `accounts` to `companies`

### 2. Customer Service Table
**Original (incorrect):**
```sql
CREATE TABLE IF NOT EXISTS public.customer_service (
  id SERIAL PRIMARY KEY,
  account_id INT REFERENCES accounts(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Corrected:**
```sql
CREATE TABLE IF NOT EXISTS public.customer_service (
  id SERIAL PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Changes:**
- Changed `account_id` to `company_id`
- Changed data type from `INT` to `UUID` to match the companies table primary key
- Changed reference from `accounts` to `companies`

## Backend API Route Corrections

### Accounts Routes
Updated all references from `account` to `company` and adjusted data types accordingly.

### Service Routes
Updated all references from `account` to `company` and adjusted data types accordingly.

## Frontend Component Corrections

### Transactions Tab
Updated component to use `companyId` instead of `accountId` and adjusted API endpoints.

### Service Lifecycle Tab
Updated component to use `companyId` instead of `accountId` and adjusted API endpoints.

## Store Corrections

### Transactions Store
Updated type definitions to use `company_id: string` (UUID) instead of `account_id: number`.

### Service Lifecycle Store
Updated type definitions to use `company_id: string` (UUID) instead of `account_id: number`.

## Summary

These corrections ensure that the Phase 2 implementation properly aligns with the existing Supabase database schema used by the Bondly CRM system. The key changes were:

1. **Table Name Consistency**: Using `companies` instead of `accounts`
2. **Data Type Alignment**: Using UUID for company references instead of INTEGER
3. **API Endpoint Updates**: Adjusting all backend routes to use correct table names
4. **Frontend Component Updates**: Updating all components to use correct prop names and data types
5. **Store Type Definitions**: Updating Zustand store types to match the corrected schema

All these changes maintain backward compatibility while ensuring the new features work correctly with the existing database structure.