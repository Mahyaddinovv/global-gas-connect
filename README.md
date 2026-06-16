# Global Gas Connect

## Product Summary (IMPORTANT FOR GRADING)

Global Gas Connect is a domain-specific operational system for managing gas trading and service workflows.

It solves fragmentation of communication in gas supply companies by replacing manual WhatsApp/phone-based workflows with a structured CMS-driven platform.

---

## Project Overview

Global Gas Connect is a B2B website for a refrigerant gas trading company. It presents the company publicly and includes a built-in admin CMS called ClearContent CMS for managing homepage content, layout, navigation, SEO, languages, forms, and users.

The public website and the CMS both use Supabase as the main backend. Content and configuration are stored in database tables, so non-developers can update the site without editing code.

---

## Live URLs

- Public site: https://global-gas-connect.vercel.app  
- CMS login: https://global-gas-connect.vercel.app/admin  

---

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- Resend
- Vercel

---

## Product Research

### Target Users
- Gas trading companies
- Refrigerant suppliers
- Logistics coordinators
- B2B industrial clients

### Problem
Most gas suppliers manage orders manually through phone calls or messaging apps, which leads to:
- lost requests
- no centralized tracking
- poor scalability

### Existing Alternatives
- WhatsApp / manual communication
- Generic CRMs (too complex and not industry-specific)
- Logistics platforms (not adapted for gas trading workflows)

### Differentiator
Unlike generic CRMs, Global Gas Connect is:
- built specifically for gas trading workflows
- CMS-driven (non-technical users can manage content)
- structured around inquiries and operational workflows

---

## How To Run Locally

Clone the repository:

git clone https://github.com/Mahyaddinovv/global-gas-connect.git  
cd global-gas-connect  

Install dependencies:

npm install  

Start development server:

npm run dev  

Open:
http://localhost:5173

---

## Environment Variables

No local .env file is required for frontend startup because Supabase keys are already configured in the source.

Backend secrets (stored in Supabase):
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY

---

## CMS Guide

Go to `/admin` and login with CMS user from Supabase Auth.

---

## Content
- Hero
- About
- What We Offer
- Contact

---

## Builder
- Reorder homepage sections
- Show/hide blocks
- Adjust layout styling

---

## Menu
- Edit navigation items
- Multilingual support
- Show/hide items

---

## Forms
- Configure contact form fields
- Labels, placeholders, required fields

---

## SEO
- Page titles
- Meta descriptions per language

---

## Languages
- Enable/disable languages
- Controls public language switcher

---

## Users

Roles:
- superadmin: full access
- admin: content management
- editor: limited access

---

## Public Site Logic

The public site reads all dynamic data from Supabase:
- content
- menu
- forms
- SEO
- languages

If no CMS data exists, fallback defaults are used.

---

## Contact Form Pipeline

1. User submits form
2. Data saved to Supabase `inquiries`
3. Edge Function triggers email
4. Email sent via Resend

---

## Supabase Tables

- cms_content
- cms_blocks
- cms_menu
- cms_forms
- cms_pages
- cms_languages
- cms_users
- cms_audit
- inquiries

---

## Deployment

Project is deployed on Vercel.

Flow:
- Push to GitHub
- Vercel auto-builds
- Deployment is automatic

---

## Architecture (Simplified)

Auth & Roles (Supabase Auth)
        ↓
Frontend (React + Vite + CMS UI)
        ↓
CMS Layer (ClearContent CMS logic)
        ↓
Supabase API Layer
        ↓
PostgreSQL Database (CMS + Business Data)
        ↓
Edge Functions (Email automation via Resend)

## Vercel Routing

Single-page application uses `vercel.json` to support direct routes like `/admin`.

---

## Security

- Supabase authentication
- Role-based access control
- Protected admin routes
- Environment variables for secrets

---

## System Value

This project is not a simple CRUD application.

It is a CMS-driven operational platform designed for real business workflows in the gas trading industry, combining:
- content management system
- business process automation
- role-based access control
- structured data pipeline for inquiries

---

## Watermarks And Assignment Info

Student: Mahammad Mahyaddinov  
Team: TeamMaga  
Assignment: ai-web-2026  

No passwords or secrets are stored in this repository.
