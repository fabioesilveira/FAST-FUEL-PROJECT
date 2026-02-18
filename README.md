# Fast Fuel Project

Fast Fuel is a **full-stack food ordering web application** focused on performance, UI/UX, and real-world order workflows.  
It simulates a complete food ordering experience, from product browsing to checkout and admin order management.

🔗 **Live Demo (Frontend):** https://fast-fuel-project-git-main-fabioesilveiras-projects.vercel.app/  
📦 **Backend Repo:** https://github.com/fabioesilveira/Back-end-FAST-FUEL

---

## Table of Contents
- Overview
- Usage
- Tech Stack
- Features
- Order Snapshot System
- Authentication & Security
- Architecture
- UI/UX Focus
- Getting Started
- Project Status
- License
- Author

## Usage

Fast Fuel supports both authenticated users and guest checkout for a flexible real-world ordering experience.

### Customer Experience

- Create an account or proceed with **Easy Checkout as a Guest**
- Browse products through category pages or explore featured items on the Home page
- Use the **Fast Thru** button when your order is ready for a quick and streamlined checkout
- Search categories or individual products using the Home page search icon with dynamic feedback messages
- Adjust cart quantities directly from the Fast Thru preview menu or within the checkout flow.
- Complete checkout using:
  - Email format validation (client-side)  
  - US address lookup (API-powered with address filtering)

### Order Tracking & Support

- Track order status whether logged in or as a guest
- Guest users can manually look up orders using email and order number
- Logged users can view their persistent order history
- Send messages to the store through the Contact feature

###  Admin Panel

Server-side protected admin access enables real-time order management and automatic message updates at short polling intervals.

**Demo Admin Credentials:**

```json
{
  "email": "fast-fuel@admin.com",
  "password": "FastFuel123!"
}
```

## Overview

Fast Fuel was built as a **portfolio-grade project** to demonstrate:
- Scalable frontend architecture
- Clean backend design with MVC + service layers
- Secure authentication and role-based access
- Realistic e-commerce and order lifecycle logic
- Strong attention to UI/UX and mobile-first behavior

---

## Tech Stack

### Frontend
- React
- TypeScript
- Material UI (MUI)
- React Router
- Vite

### Backend
- Node.js
- Express
- MySQL
- MVC + Service Layer Architecture

### Other
- JWT Authentication
- bcrypt (password hashing)
- REST API
- LocalStorage persistence

---

## Features

### User
- Category-based product browsing
- Persistent shopping cart (localStorage)
- Guest and authenticated checkout
- Address auto-fill support
- Order status tracking

### Checkout
- Full order lifecycle:  
  **received → in progress → sent → completed**
- Tax, delivery fee, discounts, and total calculation
- Order confirmation with unique order code

### Admin Dashboard
- Secure admin authentication
- Order management by status
- Real-time lifecycle updates
- Contact message management

---

## Order Snapshot System

Orders store a **snapshot of product data** at purchase time:
- Product name
- Price
- Category
- Image

This guarantees **historical accuracy**, even if products are later edited or removed from the catalog.

---

## Authentication & Security
- Password hashing with **bcrypt**
- Token-based authentication using **JWT**
- Protected admin routes
- Role-based access control (user / admin)

---

## Architecture

### Frontend
- Component-driven structure
- Mobile-first responsive design
- Clear separation of UI, hooks, and services

### Backend
- MVC pattern
- Service layer abstraction
- Clear separation of concerns
- Designed for scalability and maintainability

---

## UI/UX Focus
- Mobile-first responsive layout
- Consistent spacing and visual hierarchy
- Smooth animations and transitions
- Sticky navigation and scroll behavior
- Cross-browser tested on Chrome and Safari across desktop and mobile environments
- Mobile responsiveness validated on iPhone devices (medium through Pro Max)
- Optimized for modern viewport ranges with mobile-first breakpoints
- Additional support for very small devices and small notebooks is planned for future enhancement

---

## Getting Started (Frontend)

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_API_URL=your_backend_url_here
```

### Run the Development Server

```bash
npm run dev
```

### The app will be available at:

http://localhost:5173


> ⚠️ This project requires the Fast Fuel backend to be running.
>  
> See the backend repository for setup instructions:
> https://github.com/fabioesilveira/Back-end-FAST-FUEL

## Project Status

This project is actively maintained and continuously improved as part of a professional portfolio.

---

## License

All rights reserved.

This project is intended strictly for educational and portfolio demonstration purposes.

Commercial use, redistribution, or deployment for profit is not permitted without prior written consent from the author.

---

## Author

**Fabio Silveira**  
Full-Stack Developer with strong focus on Frontend UI/UX  

© 2026 Fabio Silveira