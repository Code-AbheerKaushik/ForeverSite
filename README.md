# Full-Stack E-Commerce Platform (MERN)

A robust, enterprise-grade, full-stack e-commerce application engineered with the **MERN** stack (MongoDB, Express.js, React, Node.js). This platform provides a seamless, high-performance shopping experience integrated with a secure, role-based authorization system, structured database management, dynamic cart operations, checkouts, and a comprehensive admin panel for inventory and order management.

---

## 🚀 Key Features

*   **Secure Authentication & Authorization:** Implements robust JSON Web Token (JWT) token-based authentication and BCrypt password hashing. Fully equipped with route-guarding middleware to restrict access to sensitive customer endpoints and admin panels.
*   **Dynamic Product Catalog:** Interactive catalog rendering featuring seamless product filtering, search functionalities, detail views, and real-time inventory checks.
*   **Intuitive Checkout & Cart Engine:** Dynamic client-side and server-side synchronized shopping cart with automatic price calculation, quantity adjustments, and custom validations.
*   **Admin Control Center:** Fully-featured admin dashboard providing secure CRUD operations for product inventory and comprehensive order monitoring.
*   **User Profile & Order History:** Dedicated user portal displaying historical purchase records, shipment statuses, and personal details.
*   **Responsive Modern UI:** Crafted using React 19 and Tailwind CSS for mobile-first responsiveness, featuring micro-interactions and smooth user transitions.

---

## 🛠️ Architecture & Tech Stack

### Frontend
*   **Framework:** React 19 (Functional components, custom Hooks, Context API)
*   **Routing:** React Router v7
*   **Styling:** Tailwind CSS (with PostCSS and Autoprefixer)
*   **Build Tooling & Testing:** Create React App (react-scripts), Jest, React Testing Library

### Backend
*   **Runtime Environment:** Node.js
*   **Server Framework:** Express.js 5
*   **Database:** MongoDB Atlas (Mongoose ODM)
*   **Authentication & Security:** JWT (JSON Web Tokens), BCrypt, CORS, Body-Parser
*   **Data Validation:** Joi (Schema-based request payload validation)

---

## 📂 Project Structure

```
├── backend/            # Express REST API, Mongoose Models, Controllers, Middlewares
└── frontend/           # React SPA components, context stores, styling configuration
```
