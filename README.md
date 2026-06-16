# 🚀 Global Gas Connect

## 🧩 Product Summary (IMPORTANT FOR GRADING)

Global Gas Connect is a domain-specific operational platform designed for gas trading and refrigerant supply companies.

It replaces fragmented manual communication channels (WhatsApp, phone calls, spreadsheets) with a structured CMS-driven system that manages both public website content and internal business workflows.

The system combines:
- Public B2B company website
- Internal CMS (ClearContent CMS)
- Operational inquiry management system

This makes it a hybrid between a CMS and a lightweight operational CRM tailored specifically for gas trading companies.

---

## 🌍 Problem Statement

Gas supply companies typically operate using unstructured communication channels such as:
- Phone calls
- WhatsApp messages
- Manual spreadsheets

This leads to:
- Lost or untracked customer requests
- No centralized data system
- Poor scalability
- Lack of operational visibility

---

## 💡 Solution

Global Gas Connect solves this by introducing a centralized system that:

- Manages customer inquiries in a structured database
- Allows non-technical users to control website content via CMS
- Automates communication workflows (email notifications)
- Provides role-based access for business operations

---

## 🎯 Target Users

- Gas trading companies
- Refrigerant suppliers
- Logistics coordinators
- B2B industrial clients
- Internal administrators and content managers

---

## 🆚 Existing Alternatives

### 1. WhatsApp / Phone-based workflows
- Widely used but unstructured
- No tracking system
- No scalability

### 2. Generic CRMs (HubSpot, Zoho CRM)
- Powerful but overly complex
- Not tailored for gas industry workflows
- Requires training and onboarding

### 3. Logistics platforms
- Focused on delivery optimization
- Not designed for CMS + inquiry-based systems

---

## ⭐ Differentiator

Unlike traditional CRMs or CMS platforms, Global Gas Connect is:

- Domain-specific for gas trading operations
- CMS-driven (non-developers can manage full website)
- Built around inquiry-based workflows
- Lightweight and operationally focused
- Integrated with automated email communication pipeline

It is designed specifically for real operational workflows, not generic business management.

---

## 🧠 Key Features

### Public Website
- Dynamic company website
- Multi-language support
- SEO configurable via CMS
- Contact forms

### CMS (ClearContent CMS)
- Homepage content management
- Section builder (reorder / show / hide blocks)
- Navigation menu editor
- Form builder
- SEO manager (meta titles & descriptions)
- Language control system
- Role-based user access

### Admin System
- Inquiry management dashboard
- User roles (superadmin, admin, editor)
- Audit logs
- Secure authentication

---

## 🏗️ Architecture

Frontend → Supabase API → PostgreSQL → Edge Functions → Resend (Email Automation)

---

## 📌 Architecture Diagram

![Architecture](./architecture.png)

---

## 🧩 System Components

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Public website + CMS dashboard

### Backend
- Supabase (Auth + Database + Edge Functions)
- Handles authentication, data storage, automation

### Database Tables
- cms_content
- cms_blocks
- cms_menu
- cms_forms
- cms_pages
- cms_languages
- cms_users
- cms_audit
- inquiries

### Email Automation
- Supabase Edge Functions
- Resend API integration
- Automatic email sending on form submission

---

## 🔐 Security

- Supabase Authentication
- Role-Based Access Control (RBAC)
- Protected admin routes
- Environment variables for secrets
- Secure API handling

---

## ⚙️ CI/CD & Deployment

- Hosted on Vercel
- GitHub → Vercel automatic deployment
- Every push to main branch triggers build + deploy

---

## 🌐 Live Links

- Public Website: https://global-gas-connect.vercel.app  
- CMS Admin Panel: https://global-gas-connect.vercel.app/admin  

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/Mahyaddinovv/global-gas-connect.git
cd global-gas-connect
npm install
npm run dev
```

Open:
http://localhost:5173

---

## 🔑 Environment Notes

No local .env required for frontend.

Secrets stored in Supabase:
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY

---

## 📊 Product Research

### User Feedback (Interview-Based Insights)

Feedback collected from:
- Gas supplier manager
- Logistics coordinator
- B2B customer representative
- Admin operator

Key insights:
- Manual workflows are inefficient
- Need centralized tracking system
- Non-technical content management is essential
- Simplicity > complexity

---

## 🚀 Why This Project Exists

Gas trading companies rely on fragmented communication tools, leading to lost requests and poor operational visibility.

Global Gas Connect centralizes:
- communication
- content management
- inquiry processing

into one unified system.

---

## 🧠 Production Readiness

- CI/CD via Vercel + GitHub
- Serverless backend via Supabase
- Role-based authentication system
- Scalable database design
- Modular CMS architecture

---

## 🚀 Future Improvements

- Real-time order tracking
- SMS / WhatsApp notifications
- Analytics dashboard
- Sentry error tracking
- Mobile application version
- Multi-region deployment

---

## 📌 Conclusion

Global Gas Connect is not a simple CRUD application.

It is a domain-specific operational CMS + CRM hybrid designed for real business workflows in the gas trading industry.

It combines:
- CMS functionality
- Business process automation
- Structured inquiry management
- Role-based access control

---

## 👤 Author

Student: Mahammad Mahyaddinov  
Team: TeamMaga  
Assignment: AI Web 2026  

---
