# Fast Fuel 🍔

Fast Fuel is a full-stack food ordering web application focused on performance, UI/UX, and real-world order workflows.
Built with React, TypeScript, Node.js, and MySQL, it simulates a complete food ordering and admin management system.

## Tech Stack

### Frontend
- React
- TypeScript
- Material UI
- React Router

### Backend
- Node.js
- Express
- MySQL
- MVC + Service Layer Architecture

### Other
- JWT Authentication
- bcrypt
- REST API

## Features

### User
- Category-based product browsing
- Persistent shopping cart (localStorage)
- Guest and authenticated checkout
- Address auto-fill support
- Order status tracking

### Checkout
- Full order lifecycle: received → in progress → sent → completed
- Tax, delivery fee, discounts, and total calculation
- Order confirmation with unique order code

### Admin Dashboard
- Order management by status
- Update order lifecycle in real time
- Contact messages management
- Secure admin access

## Order Snapshot System

Orders store a snapshot of product data (name, price, category, image) at purchase time.
This guarantees historical accuracy even if products are later updated or removed.

## Authentication & Security
- Password hashing with bcrypt
- Token-based authentication (JWT)
- Protected admin routes
- Role-based access control

## Architecture

- Frontend: component-driven, mobile-first design
- Backend: MVC pattern with service layers
- Clear separation of concerns
- Scalable and maintainable structure

## UI/UX Focus

- Mobile-first responsive design
- Consistent spacing and visual hierarchy
- Smooth scroll and sticky interactions
- Cross-browser tested (Chrome, Safari, Mobile)

## Project Status

This project is actively maintained and continuously improved as part of a professional portfolio.

## License

This project is licensed under the MIT License **for educational and portfolio purposes only**.

Commercial use, redistribution, or deployment for profit is **not permitted** without prior written consent from the author.

© Fabio Silveira

