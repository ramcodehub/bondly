# CRM Database Schema Documentation

This document describes the database schema for the CRM system implemented in **Supabase/PostgreSQL**.  
It covers table structures, relationships, and data types for easy reference in your IDE.

---

## 1. Table: `accounts`

Stores company or organization information.

| Column              | Data Type       | Description                                     | Notes              |
|---------------------|-----------------|-------------------------------------------------|--------------------|
| account_id          | SERIAL (PK)     | Unique identifier for the account               | Auto-increment     |
| account_name        | VARCHAR(255)    | Name of the account                             | **Required**       |
| account_number      | VARCHAR(50)     | Internal/auto-generated account number          | Optional           |
| account_owner       | UUID            | Reference to user who owns the account          | Optional           |
| account_source      | TEXT            | Source of account lead (e.g., Web, Trade Show)  | Optional           |
| billing_address     | TEXT            | Billing address                                 | Optional           |
| shipping_address    | TEXT            | Shipping address                                | Optional           |
| phone               | VARCHAR(20)     | Phone number                                    | Optional           |
| fax                 | VARCHAR(20)     | Fax number                                      | Optional           |
| industry            | TEXT            | Industry category                               | Optional           |
| annual_revenue      | NUMERIC(18,2)   | Annual revenue                                  | Optional           |
| number_of_locations | INT             | Number of company locations                     | Optional           |
| website             | TEXT            | Company website                                 | Optional           |
| description         | TEXT            | Additional details                              | Optional           |

---

## 2. Table: `contacts`

Stores contact person information, linked to an account.

| Column         | Data Type     | Description                                   | Notes              |
|----------------|--------------|-----------------------------------------------|--------------------|
| contact_id     | SERIAL (PK)  | Unique identifier for the contact             | Auto-increment     |
| contact_name   | VARCHAR(255) | Full name (First + Last)                      | **Required**       |
| account_id     | INT (FK)     | Linked account (`accounts.account_id`)        | **Required**       |
| email          | TEXT         | Contact email address                         | Optional           |
| phone          | VARCHAR(20)  | Landline phone number                         | Optional           |
| mobile         | VARCHAR(20)  | Mobile phone number                           | Optional           |
| title          | TEXT         | Job title                                     | Optional           |
| mailing_address| TEXT         | Mailing address                               | Optional           |
| department     | TEXT         | Department name                               | Optional           |
| birthdate      | DATE         | Date of birth                                 | Optional           |
| contact_owner  | UUID         | Reference to system user                      | Optional           |

---

## 3. Table: `products`

Stores product catalog data.

| Column              | Data Type       | Description                                   | Notes              |
|---------------------|-----------------|-----------------------------------------------|--------------------|
| product_id          | SERIAL (PK)     | Unique product identifier                     | Auto-increment     |
| product_name        | VARCHAR(255)    | Product name                                  | **Required**       |
| product_code        | VARCHAR(255)    | Product code or SKU                           | Optional           |
| product_description | TEXT            | Detailed product description                  | Optional           |
| product_family      | TEXT            | Product category                              | Optional           |
| standard_price      | NUMERIC(16,2)   | Standard selling price                        | Optional           |

---

## 4. Table: `cases`

Stores customer service cases/issues.

| Column       | Data Type     | Description                                       | Notes              |
|--------------|--------------|---------------------------------------------------|--------------------|
| case_id      | SERIAL (PK)  | Unique identifier for the case                     | Auto-increment     |
| case_number  | VARCHAR(50)  | Case tracking number                               | Optional           |
| subject      | TEXT         | Short summary of the case                          | Optional           |
| description  | TEXT         | Detailed case description                          | Optional           |
| status       | TEXT         | Case status (Open, Closed)                         | Optional           |
| priority     | TEXT         | Priority level (High, Medium, Low)                 | Optional           |
| account_id   | INT (FK)     | Linked account (`accounts.account_id`)             | Optional           |
| contact_id   | INT (FK)     | Linked contact (`contacts.contact_id`)             | Optional           |
| date_opened  | DATE         | Date case was opened                               | Optional           |

---

## 5. Table: `assets`

Tracks assets owned by customers.

| Column       | Data Type     | Description                                       | Notes              |
|--------------|--------------|---------------------------------------------------|--------------------|
| asset_id     | SERIAL (PK)  | Unique identifier for the asset                    | Auto-increment     |
| asset_name   | TEXT         | Asset name                                        | Optional           |
| asset_number | TEXT         | Asset reference number                            | Optional           |
| account_id   | INT (FK)     | Linked account (`accounts.account_id`)             | Optional           |
| product_id   | INT (FK)     | Linked product (`products.product_id`)             | Optional           |
| serial_number| TEXT         | Manufacturer serial number                        | Optional           |
| install_date | DATE         | Installation date                                 | Optional           |
| status       | TEXT         | Asset status                                      | Optional           |

---

## 6. Table: `service_contracts`

Tracks contracts linked to accounts.

| Column              | Data Type       | Description                                   | Notes              |
|---------------------|-----------------|-----------------------------------------------|--------------------|
| contract_id         | SERIAL (PK)     | Unique identifier for the contract            | Auto-increment     |
| contract_name       | TEXT            | Name of the contract                          | Optional           |
| account_id          | INT (FK)        | Linked account (`accounts.account_id`)        | Optional           |
| start_date          | DATE            | Contract start date                           | Optional           |
| end_date            | DATE            | Contract end date                             | Optional           |
| status              | TEXT            | Contract status                               | Optional           |
| total_contract_value| NUMERIC(16,2)   | Total value of the contract                   | Optional           |

---

## Relationships Diagram (Logical)

