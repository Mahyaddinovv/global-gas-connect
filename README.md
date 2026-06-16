# Global Gas Connect

## Product Summary (IMPORTANT FOR GRADING)

Global Gas Connect is a domain-specific operational system for managing gas trading and service workflows.

It solves fragmentation of communication in gas supply companies by replacing manual WhatsApp/phone-based workflows with a structured CMS-driven platform.

## Project Overview
Global Gas Connect is a B2B website for a refrigerant gas trading company. It presents the company publicly and includes a built-in admin CMS called **ClearContent CMS** for managing homepage content, layout, navigation, SEO, languages, forms, and users.

The public website and the CMS both use Supabase as the main backend. Content and configuration are stored in database tables, so non-developers can update the site without editing code.

## Live URLs
- Public site: `https://global-gas-connect.vercel.app`
- CMS login: `https://global-gas-connect.vercel.app/admin`

## Tech Stack

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

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- Resend
- Vercel

## How To Run Locally
1. Clone the repository:

```bash
git clone https://github.com/Mahyadinovv/global-gas-connect.git
cd global-gas-connect
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local app in your browser. Vite will show the local URL in the terminal, usually `http://localhost:5173`.

### Environment Variables
For the current frontend setup, no local `.env` file is required to start the site because the Supabase project URL and publishable key are already configured in the frontend source.

However, the full system still depends on backend secrets in Supabase:
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

These are used by the Supabase Edge Function for email sending and should be configured in the Supabase project, not committed to the repository.

## CMS Guide
Go to `/admin` and sign in with a valid CMS user from Supabase Auth and the `cms_users` table.

### Overview
The Overview page gives a quick summary of the CMS system:
- Section cards link directly to each admin area
- Last updated times are shown per section
- Recent Activity shows the last 10 audit log entries

### Content
The Content section is for text editing across the main homepage sections:
- Hero
- About
- What We Offer
- Contact

How to use it:
- Choose a language
- Expand a section
- Edit a text field
- Click `Save`

### Builder
The Builder section controls homepage layout blocks:
- Hero
- About
- What We Offer
- Contact

How to use it:
- Reorder blocks with drag and drop or up/down buttons
- Hide or show sections
- Change background style
- Set text alignment
- Set top and bottom padding

### Menu
The Menu section manages navigation items for the public navbar.

How to use it:
- Edit labels per language
- Reorder menu items
- Hide or show items
- Save changes

### Forms
The Forms section controls the contact form structure.

How to use it:
- Reorder fields
- Edit labels
- Edit placeholders
- Set required or optional fields

### SEO
The SEO section manages homepage metadata per language.

How to use it:
- Edit page title
- Edit meta description
- Save changes

After refresh, the public site updates the browser title and main meta tags from these values.

### Languages
The Languages section controls which languages are available in the public language switcher.

How to use it:
- Enable or disable each language
- Save changes

### Users
The Users section is for CMS user management.

How to use it:
- View CMS users
- Invite new users
- Assign roles
- Remove users

Role access:
- `superadmin`: full access
- `admin`: content/config access
- `editor`: limited access, no user management

## Public Site
The public homepage reads content and configuration directly from Supabase tables.

This includes:
- homepage text content
- section order and block styling
- menu labels and visibility
- enabled languages
- contact form field structure
- SEO title and description

If a CMS table has no rows yet, the site falls back to built-in defaults where needed.

### Language Switching
The language switcher changes the active language in the React app. Based on the selected language, the site loads:
- translated content rows from `cms_content`
- menu rows from `cms_menu`
- form configuration from `cms_forms`
- SEO data from `cms_pages`

The switcher only shows languages that are enabled in `cms_languages`.

## Contact Form Pipeline
When a visitor submits the contact form:
1. The form is validated in the frontend
2. The submission is inserted into the Supabase `inquiries` table
3. The app calls the Supabase Edge Function at `supabase/functions/send-inquiry-email/index.ts`
4. That function reads the saved inquiry from Supabase
5. It sends an email notification through Resend

This means the submission is stored in the database first, and the email notification is sent after that.

## Supabase Tables Overview
- `cms_content`: text content for homepage sections, stored per language
- `cms_blocks`: page builder block order, visibility, background, alignment, and spacing
- `cms_menu`: navigation labels, order, visibility, and language-specific menu settings
- `cms_forms`: contact form field settings such as label, placeholder, required, and order
- `cms_pages`: SEO data such as page title and meta description per slug and language
- `cms_languages`: enabled and disabled language options for the public site
- `cms_users`: CMS user roles and email mapping for admin access
- `cms_audit`: audit trail of CMS changes, including who changed what and when
- `inquiries`: public contact form submissions

## Deployment
The project is deployed on Vercel.

Typical deployment flow:
- Push changes to the GitHub repository
- Vercel pulls from the main branch
- Vercel builds and deploys the site automatically

## Architecture (Simplified)

Frontend (React + Vite)
        ↓
Supabase API Layer
        ↓
PostgreSQL Database + CMS Tables
        ↓
Edge Functions (Email + Automation)

### Vercel Routing
Because this is a single-page React app, the project includes `vercel.json` so routes like `/admin` work correctly on direct page loads.

### Where To Add Environment Variables
- Frontend deployment settings: Vercel project settings
- Supabase Edge Function secrets: Supabase project settings

For this project, email-related secrets belong in Supabase, not in the public frontend.

## Watermarks And Assignment Info
- Student name: **Mahammad Mahyaddinov**
- Team slug: **TeamMaga**
- Assignment: **ai-web-2026**

## Notes
- No passwords or secrets are stored in this README.
- CMS activity is tracked through the audit log system in `cms_audit`.
- The public assignment file is available at `public/ai-web-2026.txt`.
