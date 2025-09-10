# Bondly Database Schema Documentation

This document describes the database schema for the Bondly (Customer Relationship Management) system.  
The database is implemented in **PostgreSQL** (compatible with Supabase) and contains 8 main tables.

---

## 1. Overview

The schema supports core Bondly functions:
- **Sales Management**: Campaigns, Opportunities, Leads
- **Customer Records**: Accounts, Contacts
- **Service & Activities**: Tasks, Events
- **Products & Pricing**: Products, Pricebooks

---

## 2. Table Descriptions

### 2.1 `campaign`
Stores marketing campaign information.

| Column            | Type              | Description |
|-------------------|-------------------|-------------|
| campaign_id       | SERIAL PK         | Unique ID for campaign. |
| campaign_name     | VARCHAR(80)       | Name of the campaign. |
| type              | TEXT              | Campaign type (picklist). |
| status            | TEXT              | Current status (picklist). |
| start_date        | DATE               | Campaign start date. |
| end_date          | DATE               | Campaign end date. |
| budgeted_cost     | NUMERIC(18,0)     | Estimated cost. |
| actual_cost       | NUMERIC(18,0)     | Actual cost incurred. |
| expected_revenue  | NUMERIC(18,0)     | Projected revenue. |
| number_of_leads   | INTEGER           | Leads generated. |
| number_of_responses | INTEGER         | Responses received. |
| created_at        | TIMESTAMP         | Record creation timestamp. |

---

### 2.2 `account`
Represents companies or organizations.

| Column           | Type              | Description |
|------------------|-------------------|-------------|
| account_id       | SERIAL PK         | Unique ID. |
| account_name     | VARCHAR(255)      | Account name. |
| account_number   | VARCHAR(50)       | Optional internal reference number. |
| account_owner    | UUID              | Owner's user ID. |
| account_source   | TEXT              | Lead source. |
| billing_address  | TEXT              | Billing address. |
| shipping_address | TEXT              | Shipping address. |
| phone            | VARCHAR(20)       | Contact number. |
| fax              | VARCHAR(20)       | Fax number. |
| industry         | TEXT              | Industry type. |
| annual_revenue   | NUMERIC(18,0)     | Annual revenue. |
| number_of_locations | INTEGER        | Location count. |
| website          | TEXT              | Website URL. |
| description      | TEXT              | Notes. |
| created_at       | TIMESTAMP         | Record creation timestamp. |

---

### 2.3 `opportunity`
Sales opportunities linked to accounts.

| Column          | Type               | Description |
|-----------------|--------------------|-------------|
| opportunity_id  | SERIAL PK          | Unique ID. |
| opportunity_name| VARCHAR(120)       | Name/title. |
| account_id      | INTEGER FK         | References `account.account_id`. |
| opportunity_owner | UUID             | Owner's user ID. |
| stage           | TEXT               | Sales stage. |
| close_date      | DATE               | Expected close date. |
| amount          | NUMERIC(16,2)      | Deal value. |
| probability     | NUMERIC(3,0)       | Probability % of closing. |
| type            | TEXT               | Opportunity type. |
| lead_source     | TEXT               | Lead source. |
| description     | TEXT               | Additional notes. |
| stage_detail    | TEXT               | Stage-specific info. |
| forecast_category | TEXT              | Sales forecast category. |
| created_at      | TIMESTAMP          | Record creation timestamp. |

---

### 2.4 `lead`
Potential customers before becoming contacts/accounts.

| Column        | Type              | Description |
|---------------|-------------------|-------------|
| lead_id       | SERIAL PK         | Unique ID. |
| lead_name     | VARCHAR(255)      | Lead's full name. |
| company_name  | VARCHAR(255)      | Company they belong to. |
| lead_owner    | UUID              | Owner's user ID. |
| title         | VARCHAR(128)      | Job title. |
| lead_source   | TEXT              | Source of lead. |
| status        | TEXT              | Current lead status. |
| email         | TEXT              | Email address. |
| phone         | VARCHAR(20)       | Phone number. |
| created_at    | TIMESTAMP         | Record creation timestamp. |

---

### 2.5 `contact`
Individual contacts linked to accounts.

| Column        | Type              | Description |
|---------------|-------------------|-------------|
| contact_id    | SERIAL PK         | Unique ID. |
| contact_name  | VARCHAR(255)      | Contact's name. |
| account_id    | INTEGER FK        | References `account.account_id`. |
| email         | TEXT              | Email address. |
| phone         | VARCHAR(20)       | Landline number. |
| mobile        | VARCHAR(20)       | Mobile number. |
| title         | TEXT              | Job title. |
| mailing_address | TEXT             | Mailing address. |
| department    | TEXT              | Department name. |
| birthdate     | DATE              | Birth date. |
| contact_owner | UUID              | Owner's user ID. |
| created_at    | TIMESTAMP         | Record creation timestamp. |

---

### 2.6 `activity`
Tasks, calls, or events related to contacts.

| Column        | Type              | Description |
|---------------|-------------------|-------------|
| activity_id   | SERIAL PK         | Unique ID. |
| activity_type | UUID              | Activity type ID (lookup). |
| subject       | TEXT              | Short description. |
| related_to    | TEXT              | General related object. |
| contact_id    | INTEGER FK        | References `contact.contact_id`. |
| assigned_to   | UUID              | User assigned to activity. |
| due_date      | DATE              | Task due date. |
| start_end_datetime | TIMESTAMP    | Start/end date-time. |
| status        | TEXT              | Activity status. |
| priority      | TEXT              | Priority level. |
| description   | TEXT              | Detailed notes. |
| created_at    | TIMESTAMP         | Record creation timestamp. |

---

### 2.7 `product`
Products or services offered.

| Column         | Type              | Description |
|----------------|-------------------|-------------|
| product_id     | SERIAL PK         | Unique ID. |
| product_name   | VARCHAR(255)      | Name. |
| product_code   | VARCHAR(255)      | Internal code. |
| product_description | TEXT         | Description. |
| product_family | TEXT              | Product family/group. |
| standard_price | NUMERIC(16,2)     | Base price. |
| created_at     | TIMESTAMP         | Record creation timestamp. |

---

### 2.8 `pricebook`
Price lists for products.

| Column           | Type              | Description |
|------------------|-------------------|-------------|
| pricebook_id     | SERIAL PK         | Unique ID. |
| pricebook_name   | VARCHAR(255)      | Name of pricebook. |
| product_id       | INTEGER FK        | References `product.product_id`. |
| pricebook_entry_currency | NUMERIC(16,2) | Currency value. |
| list_price       | NUMERIC(16,2)     | Listed price for this pricebook. |
| created_at       | TIMESTAMP         | Record creation timestamp. |

---

## 3. Relationships

- **Account ↔ Opportunity**: One account can have many opportunities.
- **Account ↔ Contact**: One account can have many contacts.
- **Contact ↔ Activity**: Activities can be linked to a contact.
- **Product ↔ Pricebook**: A product can be part of many pricebooks.
- **Foreign Keys**:
  - `opportunity.account_id` → `account.account_id`
  - `contact.account_id` → `account.account_id`
  - `activity.contact_id` → `contact.contact_id`
  - `pricebook.product_id` → `product.product_id`

---

## 4. Indexing
Indexes improve lookup speed for common queries:
- `campaign_name`, `account_name`, `opportunity_name`, `lead_name`, `contact_name`, `product_name`, `pricebook_name`.

---

## 5. Notes
- `UUID` fields are meant for linking to Supabase Auth users.
- `TEXT` used for picklist values to allow flexibility. Can be replaced with `ENUM` for strict lists.
- `created_at` auto-generated for auditing.
