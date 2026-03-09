#72X – Empowering South African Entrepreneurs

##72X (SeventyTwoX) is a web-based platform designed to support and grow small businesses in South Africa, particularly those operating in townships and rural communities.

The platform provides entrepreneurs with:

Practical business tools

Localised learning resources

Community collaboration

Mentorship opportunities

AI-powered business insights

72X follows a mobile-first, low-bandwidth-friendly approach, ensuring accessibility for users with limited connectivity.

The platform is structured around a three-tier package model and delivered through a phase-based rollout strategy to ensure stability and controlled feature growth.

### Package Structure
  Startup Package (Default – Phase 1)

All new users are automatically assigned to the Startup Package when they register.

This package focuses on onboarding entrepreneurs and providing essential tools for business organisation and learning.

Includes:

Overview Dashboard (with advertising space)

Business Schedule & Calendar

Learning Modules (gamified content)

Community Forum

Profile Management

At this stage, advanced features are visible but locked, allowing users to see what additional tools are available as they grow.

  Essential Package (Phase 2)

The Essential Package unlocks additional tools that help entrepreneurs expand their operations and engage more deeply with the platform.

Includes everything in Startup plus:

Marketplace (product and service listings)

Connections (networking with other entrepreneurs)

Mentorship Hub

Funding Finder

Data Input System for business performance tracking

AI Chatbot Assistance

App Store access (TenderyAI, Inventory, CRM, etc.)

This tier is designed for entrepreneurs ready to scale their businesses with structured tools and support networks.

  Premium Package (Phase 3)

The Premium Package provides full access to advanced tools and AI-driven insights that support strategic decision-making.

Includes everything in Startup and Essential plus:

Business Roadmap Generator

Advanced Analytics

Expert Q&A Sessions

AI Business Analyst

This package is intended for established entrepreneurs seeking deeper data insights and expert guidance.

####🚀 Phased Delivery Strategy

To maintain a stable platform while continuously developing new features, 72X is released in three development phases.

Phase 1 – Initial Launch (Startup Package)

Goal: Deliver a stable core platform.

Scope:

All Startup Package features fully implemented

Essential and Premium features visible but locked

User onboarding completed

Platform analytics enabled

This phase focuses on validating the core user experience and building trust with early users.

Phase 2 – Growth Tools Rollout (Essential Package)

Goal: Introduce monetisation and growth tools.

Scope:

Unlock Essential Package features

Enable performance tracking and structured business data input

Expand networking and mentorship functionality

Phase 3 – Advanced & AI Features (Premium Package)

Goal: Provide intelligent decision-support tools.

Scope:

Deploy advanced analytics

Launch AI-powered business insights

Enable expert-led guidance features

  ####Target Audience

72X is built for:

Small business owners in townships and rural communities

Early-stage entrepreneurs and startups

Freelancers and solo business operators

Community-based businesses seeking digital transformation

### Key Platform Features
#### Business Management Tools

Overview Dashboard

Business Schedule & Calendar

Data Input System (Essential+)

Business Roadmap (Premium)

  Learning & Development

Interactive Learning Modules

Gamified business education

Resource Library

Daily business tips

 Community & Collaboration

Community Forum

Entrepreneur Connections

Mentorship Hub (Essential+)

Marketplace (Essential+)

 AI & Smart Tools

AI Chatbot Assistance (Essential+)

AI Business Analyst (Premium)

 Expert Support

Expert Q&A Sessions (Premium)

 Business Applications

Accessible through the 72X App Store:

TenderyAI

Inventory Management

CRM tools

Additional third-party business apps

🛠 Technology Stack

Frontend:

React 19

TypeScript

Vite

UI & Styling:

Tailwind CSS

Headless UI

Lucide Icons

Data Visualization:

Recharts

Routing:

React Router DOM

 ####Mobile-First Design

72X is designed with accessibility and connectivity challenges in mind.

Features include:

Optimised for low-bandwidth environments

Mobile-friendly navigation

Touch-first interface

Responsive layouts

#### Revenue Model

72X follows a Freemium structure.

Platform Packages
Package	Description
Startup	Free access to core learning and community tools
Essential	Adds marketplace, mentorship, AI assistant and business tools
Premium	Full platform access with AI analytics and expert guidance
Software Tools

Additional optional tools available through the platform:

Tool	Price
Helpdesk	R299/month
Inventory Portal	R199/month
POS System	R149/month
Deployment & Branching Strategy

To ensure platform stability, development follows a phase-based Git branching structure.

####Branch Overview
main-phase-1 → Production branch (Startup features)

main-phase-2 → Development branch for Essential features

main-phase-3 → Future branch for Premium features
Workflow

Phase 1 features are built and deployed from main-phase-1

Essential features are developed in main-phase-2

Once stable, main-phase-2 merges into production

Premium development continues in main-phase-3

This approach:

Protects the live platform

Prevents unfinished features from reaching production

Enables parallel development

Allows easier rollback if issues occur

Feature Locking & Access Control

Locked features are restricted at multiple levels:

UI level – disabled buttons or upgrade prompts

Routing level – protected routes

Backend level – package validation checks

This ensures a secure and consistent upgrade experience.

#### Getting Started
Prerequisites

IDE: VS Code and IntelliJ

npm or yarn

Installation
git clone <repository-url>
cd 72x
npm install
Run Development Server
npm run dev

Visit:

http://localhost:5173
Other Commands
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint

📁 Project Structure
src/
├── components/
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── MobileNav.tsx
│   ├── Header.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── LearningModules.tsx
│   ├── Marketplace.tsx
│   ├── MentorshipHub.tsx
│   ├── Applications.tsx
│
├── styles/
└── main.tsx
🔮 Future Enhancements

Planned improvements for the platform include:

Offline mode for low connectivity areas

WhatsApp-based learning integration

Voice command features

Advanced payment integrations

AI-generated business reports

 Contributing

We welcome contributions from the community. Please review the contributing guidelines before submitting pull requests.

📄 License

This project is licensed under the MIT License.

📞 Support

Email: support@72Xsupport.co.za

Community: Available within the application
Help Docs: Accessible through the Resource Library

72X — Empowering entrepreneurs through structured growth, smart technology, and accessible digital tools.
