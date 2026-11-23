# MentorLagbe — Client

A modern tuition and mentorship platform that connects students with tutors across Bangladesh. Students can explore tuition opportunities, apply to listings, save their favorites, and connect with mentors. Tutors can publish tuition listings, manage applicants, and grow their reach with PRO membership.

## 🌐 Live Website

**[Visit MentorLagbe](https://web-mentor-lagbe.vercel.app/)**

## 📌 Project Overview

MentorLagbe is designed to make finding tuition opportunities and connecting with the right mentors easier. It provides separate experiences for students, mentors, and administrators.

The platform includes a responsive interface, role-based dashboards, tuition management, application workflows, and premium membership options.

## ✨ Features

### 👨‍🎓 For Students
- Browse approved and active tuition listings.
- Search and filter tuition opportunities.
- View detailed tuition information.
- Apply directly to tuition listings.
- Bookmark and manage saved tuitions.
- Track applications and learning activities.
- Access a personal student dashboard.

### 👨‍🏫 For Mentors
- Create and manage tuition listings.
- Receive and manage student applications.
- Track tuition approval status.
- Manage mentor profiles.
- Access a dedicated mentor dashboard.
- Upgrade to PRO for additional features.

### 🛡️ For Administrators
- Manage registered users.
- Review submitted tuition listings.
- Approve or reject tuition submissions.
- Manage platform activities.
- Monitor transactions.

### 💎 Membership
- Free and PRO membership plans.
- Role-based pricing for students and mentors.
- Stripe-powered checkout.
- PRO membership benefits and verification badges.

### 🎨 General
- Responsive design for mobile, tablet, and desktop.
- Role-based navigation and dashboards.
- Authentication and protected routes.
- Interactive UI with loading and feedback states.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 |
| Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Better Auth |
| Database Integration | MongoDB |
| Payments | Stripe |
| Icons | Lucide React, React Icons |
| UI Components | shadcn/ui, Base UI |
| Notifications | React Hot Toast |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Tamiim-Iqbal/mentorLagbe-client.git
```

### 2. Navigate to the Project

```bash
cd mentorLagbe-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Configure the required environment variables for:

- Backend API URL
- Better Auth configuration
- MongoDB connection
- Stripe integration

Use the exact variable names and values expected by the application's configuration. Never commit your `.env.local` file or expose secret keys.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## 🌍 Deployment

The client application is deployed on **Vercel**.

Production URL:

https://web-mentor-lagbe.vercel.app/

For deployment, configure all required environment variables in the Vercel project settings and deploy the application.

## 🔗 Related Repository

**Backend Repository:**  
https://github.com/Tamiim-Iqbal/mentorLagbe-server

## 👨‍💻 Developer

**Tamim Iqbal**

- GitHub: [@Tamiim-Iqbal](https://github.com/Tamiim-Iqbal)

---

<p align="center">
  Built to make finding the right tutor and teaching opportunities easier.
</p>