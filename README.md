# Fast Fuel 🍔

Fast Fuel is a **full-stack food ordering web application** focused on performance, UI/UX, and real-world order workflows.  
It simulates a complete food ordering experience, from product browsing to checkout and admin order management.

🔗 **Live Demo (Frontend):** https://fast-fuel-project-git-main-fabioesilveiras-projects.vercel.app/  
📦 **Backend Repo:** https://github.com/fabioesilveira/Back-end-FAST-FUEL

---

## Table of Contents
- Overview
- Tech Stack
- Features
- Order Snapshot System
- Authentication & Security
- Architecture
- UI/UX Focus
- Getting Started
- Environment Variables
- API Overview
- Project Status
- License
- Author

---

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
- Cross-browser tested (Chrome, Safari, Mobile)

---

## Getting Started (Frontend)

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation
```bash
npm install
```

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
```