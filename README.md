# Fast Fuel Project

Fast Fuel is a **full-stack food ordering web application** designed to simulate a real restaurant ordering workflow.  
The project combines a modern responsive frontend focused on **UI/UX and performance** with a structured backend API responsible for order processing, product management, and administrative controls.

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

Fast Fuel was designed with an **app-like browsing experience inside the browser**.  
The layout uses a fixed navigation header and footer to simulate the flow of a mobile application, allowing users to navigate quickly between sections while keeping key actions always accessible.

A central feature of this design is the **Fast Thru mode**, represented by a prominent button in the footer navigation. This feature allows returning customers who already know the menu to skip traditional browsing and move directly into a rapid ordering interface.

In Fast Thru mode:

- All products are displayed as large clickable buttons
- Items can be added to the cart instantly
- The cart preview remains easily accessible
- The checkout flow becomes significantly faster

This creates a **"drive-thru style" online ordering experience**, where customers can place orders quickly without navigating through multiple product pages.

Users who prefer a traditional browsing experience can still navigate through category pages and view full product descriptions before ordering.

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

Clone the repository and install dependencies:

```bash
git clone https://github.com/fabioesilveira/FAST-FUEL-PROJECT
cd FAST-FUEL-PROJECT
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

#### Example:

```bash
http://localhost:5173
```

> ⚠️ This project requires the Fast Fuel backend to be running.
>  
> See the backend repository for setup instructions:
> https://github.com/fabioesilveira/Back-end-FAST-FUEL

---

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