👕 T-Shirt E-Commerce Platform

A modern, production-style Full Stack T-Shirt E-Commerce Platform built with React + TypeScript + Tailwind CSS on the frontend and Java 26 + Spring Boot + Maven + MySQL on the backend.

The project is designed as a complete real-world e-commerce system covering the entire lifecycle:

Product → Cart → Checkout → Payment → Inventory → Order → Shipping → Delivery → Review → Return → Refund

It also includes a secure Admin Panel with product management, category management, customers, orders, inventory, analytics, notifications and system settings.

📌 Project Status

🚧 Development / Production-Style Portfolio Project

The architecture is intentionally designed to be scalable, secure and maintainable rather than being a simple CRUD shopping application.

✨ Features

🛍️ Customer Features

Modern responsive storefront

Light / Dark mode

Premium animated UI

Scroll-based animations

Product collections

Product search

Search autocomplete

Product filtering

Price filtering

Size filtering

Color filtering

Category filtering

Product sorting

Pagination / Load More

Product details page

Product image gallery

Product thumbnails

Color selection

Size selection

Size guide

Quantity selection

Add to Cart

Buy Now

Wishlist

Recently Viewed Products

Product recommendations

Frequently Bought Together

Similar Products

Price-drop alerts

Back-in-stock alerts

Customer reviews

Star ratings

Verified purchase reviews

Review images

Helpful review votes

Customer profile

Multiple addresses

Default address

Address validation

Pincode serviceability

Shipping method selection

Coupon application

Checkout

Online payment

Cash on Delivery

Order history

Order tracking

Order cancellation

Return requests

Refund tracking

Notifications

🔐 Authentication & Security

Customer registration

Customer login

Forgot password

Email OTP verification

JWT authentication

Access token / refresh-token architecture

Role-Based Access Control

Admin authentication

Protected customer routes

Protected admin routes

Ownership-based authorization

Password hashing

CORS configuration

Security headers

API rate limiting architecture

Global exception handling

Input validation

Secure environment configuration

Payment webhook verification

Idempotency protection

Duplicate payment protection

Roles

CUSTOMER
ADMIN

👨‍💼 Admin Panel

The Admin Panel is designed as a complete e-commerce command center.

Dashboard

Total Revenue

Total Orders

Total Customers

Total Products

Low Stock Products

Pending Payments

Returns

Refunds

Recent Orders

Recent Customers

Sales Overview

Product Management

Add Product

Edit Product

Delete / Deactivate Product

Product Description

Product Images

Multiple Images

Product Category

Product Variants

Size

Color

SKU

Price

Compare-at Price

Stock

Product Status

Featured Products

Category Management

Admin can:

Create category

Update category

Deactivate category

Delete category when safe

View category products

Set category image

Set category description

Set display order

Activate / deactivate category

Example categories:

Oversized
Regular Fit
Polo
Graphic
Printed
Plain
Premium
New Arrivals

Categories are database-driven and connected to products. They are not hard-coded frontend values.

Customer Management

Admin can:

View customers

Search customers

Filter customers

View customer profile

Update customer information

Deactivate customer

Delete customer where permitted

View customer orders

View total spending

View addresses

View reviews

View account status

For production safety, customer accounts should normally be deactivated/soft-deleted rather than physically deleting historical order/payment records.

Order Management

View orders

Search orders

Filter orders

View order details

Order status

Payment status

Shipment status

Cancel order

Process return

Process refund

Customer order history

Inventory Management

Product stock

Variant stock

Available stock

Reserved stock

Low-stock alerts

Stock adjustments

Inventory reservation

Reservation expiry

Stock movement history

Inventory restock

Overselling prevention

Payment Management

Payment list

Payment status

Payment method

Successful payments

Failed payments

Pending payments

Refunds

Payment transaction reference

Payment webhook status

Analytics

Analytics includes:

Total sales

Net sales

Gross sales

Revenue

Total orders

Average order value

Online payments

COD payments

UPI payments

Card payments

Net banking

Failed payments

Refund amount

Discount amount

Shipping revenue

Top-selling products

Top categories

Customer analytics

Return analytics

Refund analytics

Date filters

Custom date range

Export-ready reporting

Example:

Sales
₹5,42,850

Orders
428

Online Payments
₹4,85,200

Refunds
₹32,500

Settings

Admin settings are divided into:

Store Settings
Profile Settings
Security Settings
Payment Settings
Shipping Settings
Tax Settings
Notification Settings
Email Settings
Order Settings
Inventory Settings
Coupon Settings
System Settings

Store Settings

Store name

Store logo

Favicon

Store email

Support email

Support phone

Store address

Currency

Timezone

Security Settings

Change password

Two-factor authentication architecture

Login session management

Logout all devices

Failed login protection

Admin activity logs

Payment Settings

Payment gateway enable/disable

Test mode

Production mode

Currency

Webhook status

Shipping Settings

Standard shipping

Express shipping

Free shipping

Shipping zones

Delivery charges

Free shipping threshold

Pincode serviceability

Order Settings

Cancellation rules

Return window

Auto-cancel unpaid orders

Order completion rules

Inventory Settings

Low-stock threshold

Reservation timeout

Auto-release reservation

Back-in-stock notifications

🧱 Technology Stack

Frontend

Technology

Purpose

React

UI

TypeScript

Type safety

Vite

Frontend build tool

Tailwind CSS

Styling

Zustand

Client state management

TanStack React Query

Server state / API caching

React Router

Routing

Animation Library

UI animations

Scroll Animation

Reveal / scroll effects

Icon Library

UI icons

Backend

Technology

Purpose

Java JDK 26

Backend language/runtime

Spring Boot

Backend framework

Spring Web

REST APIs

Spring Security

Authentication / authorization

JWT

Authentication

Spring Data JPA

Database access

Hibernate

ORM

Maven 3.9

Build / dependency management

Bean Validation

Request validation

Spring Actuator

Health / monitoring

Database

MySQL

DevOps / Production

Docker
Git
GitHub
GitHub Actions
Nginx
Redis (planned / scalable cache layer)
Flyway (database migrations)

🏗️ High-Level Architecture

                         USER
                          │
                          ▼
                    React Frontend
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
     Zustand        React Query        React Router
        │                 │
        └─────────────────┼─────────────────┘
                          │
                          ▼
                     REST API
                          │
                          ▼
                  Spring Boot Backend
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Spring Security     Services        Validation
        │                 │
        ▼                 ▼
       JWT            Repositories
                          │
                          ▼
                        MySQL
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           Orders     Inventory    Products

🧩 Backend Architecture

The backend follows a layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

Supporting layers:

DTO
Mapper
Validation
Security
Exception Handler
Specification
Configuration

Example:

ProductController
       ↓
ProductService
       ↓
ProductRepository
       ↓
MySQL

Business logic stays inside services rather than controllers.

📁 Frontend Folder Structure

frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── recently-viewed/
│   │   ├── products/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── reviews/
│   │   ├── notifications/
│   │   └── recommendations/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Shop/
│   │   ├── Product/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Profile/
│   │   └── Admin/
│   │
│   ├── layouts/
│   │   ├── StoreLayout/
│   │   └── AdminLayout/
│   │
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── lib/
│   ├── types/
│   ├── routes/
│   └── App.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md

📁 Backend Folder Structure

backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── tshirt/
│   │   │
│   │   │           ├── config/
│   │   │           ├── security/
│   │   │           ├── common/
│   │   │           ├── exception/
│   │   │           │
│   │   │           ├── auth/
│   │   │           ├── user/
│   │   │           ├── product/
│   │   │           ├── category/
│   │   │           ├── variant/
│   │   │           ├── cart/
│   │   │           ├── wishlist/
│   │   │           ├── address/
│   │   │           ├── checkout/
│   │   │           ├── order/
│   │   │           ├── payment/
│   │   │           ├── inventory/
│   │   │           ├── coupon/
│   │   │           ├── shipping/
│   │   │           ├── review/
│   │   │           ├── notification/
│   │   │           ├── returnorder/
│   │   │           ├── refund/
│   │   │           ├── analytics/
│   │   │           └── admin/
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   │
│   └── test/
│
├── pom.xml
└── Dockerfile

🗄️ Main Database Modules

The database is organized around the following core entities:

users
roles
user_roles

categories

products
product_images
product_variants

carts
cart_items

wishlists
wishlist_items

customer_addresses

orders
order_items

payments
refunds

inventory_reservations
inventory_movements

coupons
coupon_usage

shipments
shipment_tracking

reviews
review_images
review_votes

notifications
notification_preferences

recently_viewed_products

product_recommendations

👕 Product Architecture

A product does not directly represent every purchasable SKU.

Product
   │
   ├── Images
   │
   ├── Category
   │
   └── Variants
          │
          ├── Color
          ├── Size
          ├── SKU
          ├── Price
          └── Stock

Example:

Black Oversized T-Shirt

S  → SKU-001 → Stock 20
M  → SKU-002 → Stock 15
L  → SKU-003 → Stock 0
XL → SKU-004 → Stock 8

This architecture allows variant-level inventory and back-in-stock notifications.

🛒 Cart Architecture

User
 ↓
Cart
 ↓
CartItem
 ↓
ProductVariant
 ↓
Stock Validation
 ↓
Quantity Update
 ↓
Checkout

The frontend uses Zustand for fast UI state, while the authenticated backend cart is persisted in MySQL.

❤️ Wishlist Architecture

Supports:

Guest Wishlist
       ↓
localStorage
       ↓
Login
       ↓
Guest → Server Merge
       ↓
MySQL Wishlist

Features:

Persistent wishlist

Guest wishlist

Login merge

Duplicate prevention

Price-drop detection

Back-in-stock alerts

Wishlist → Cart

📦 Checkout Flow

Cart
 ↓
Address
 ↓
Pincode Serviceability
 ↓
Shipping Method
 ↓
Coupon
 ↓
Order Summary
 ↓
Inventory Reservation
 ↓
Payment
 ↓
Order Creation
 ↓
Confirmation

💳 Payment Lifecycle

Checkout
   ↓
Inventory Reservation
   ↓
Payment Order Creation
   ↓
Payment Gateway
   ↓
Payment Success / Failure
   ↓
Webhook Verification
   ↓
Payment Record
   ↓
Order Confirmation
   ↓
Reservation Consume / Release

Important protections:

Idempotency

Webhook signature verification

Duplicate payment protection

Payment state validation

📦 Inventory Reservation

Overselling prevention is a core part of the architecture.

Available Stock
      ↓
Reservation
      ↓
Payment
  ┌───┴────┐
  ↓        ↓
Success   Failed/Timeout
  ↓        ↓
Consume   Release

Atomic stock validation is used so two customers cannot successfully purchase the same final inventory unit.

🧾 Order Price Snapshot

Order items store the price at purchase time.

Example:

Today:
T-Shirt = ₹1,299

Order Created:
OrderItem.price = ₹1,299

Tomorrow:
Product Price = ₹1,599

The old order still displays:

₹1,299

The order does not depend on the product's current price.

🚚 Shipping Architecture

Address
   ↓
Pincode
   ↓
Serviceability
   ↓
Shipping Zone
   ↓
Shipping Method
   ├── Standard
   ├── Express
   └── Free
   ↓
Shipping Charge
   ↓
Shipment
   ↓
Tracking
   ↓
Delivered

Shipment statuses:

PENDING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED

⭐ Review System

Reviews support:

1–5 star ratings

Rating aggregation

Verified purchase

Review text

Review images

Helpful votes

Edit review

Delete review

Admin moderation

Example:

5 ★★★★★  72%
4 ★★★★☆  18%
3 ★★★☆☆   6%
2 ★★☆☆☆   2%
1 ★☆☆☆☆   2%

Average Rating: 4.6

🔔 Notification System

Events:

Order Created
Payment Success
Order Confirmed
Shipment Created
Shipped
Out For Delivery
Delivered
Review Reminder
Price Drop
Back In Stock
Return Approved
Refund Completed
Low Stock

Notification channels:

Email
In-App
Admin Notification

🔄 Return & Refund Flow

Delivered Order
      ↓
Return Request
      ↓
Eligibility Check
      ↓
Admin Approval
      ↓
Pickup
      ↓
Quality Check
      ↓
Refund
      ↓
Payment Gateway Refund
      ↓
Refund Completed
      ↓
Inventory Restock

🔎 Search & Product Discovery

The search system supports:

Search
 ↓
Autocomplete
 ↓
Typo Tolerance
 ↓
Product Search
 ↓
Category Search
 ↓
Filters
 ↓
Sort
 ↓
Recently Viewed
 ↓
Related Products
 ↓
Recommendations

Shop URL examples:

/shop?category=oversized
/shop?category=oversized&size=L
/shop?category=oversized&size=L&color=black
/shop?category=oversized&size=L&color=black&sort=price-low

🤖 Recommendation System

Initial rule-based recommendation architecture:

User Signals
    │
    ├── Viewed Products
    ├── Wishlist
    ├── Cart
    ├── Purchases
    └── Categories
          ↓
Recommendation Engine
          ↓
Similar Products
Frequently Bought Together
Popular Products
Personalized Products

Future versions can replace the rule engine with an ML-based recommendation system without changing the frontend contract.

⚡ Performance

Production optimization includes:

Frontend

Code splitting

Route lazy loading

Image lazy loading

WebP / AVIF support

Responsive images

React optimization

TanStack Query caching

API prefetching

Bundle optimization

Animation optimization

Reduced-motion accessibility

Backend

DTO projections

N+1 query prevention

Database indexes

Connection pooling

Query optimization

Redis caching architecture

Pagination

Rate limiting

Transaction management

🔍 SEO

SEO-ready architecture includes:

SEO-friendly URLs

Dynamic product titles

Meta descriptions

Canonical URLs

Sitemap

Robots.txt

Open Graph

Product structured data

Aggregate rating structured data

Image alt text

Example:

/product/black-oversized-cotton-tshirt

🐳 Docker

Planned production architecture:

Docker
│
├── Frontend
│     └── Nginx
│
├── Backend
│     └── Spring Boot
│
└── Database
      └── MySQL

The database may also be deployed separately as a managed production database.

🔄 CI/CD

GitHub Actions pipeline:

git push
   ↓
Install Dependencies
   ↓
Lint
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Build
   ↓
Docker Build
   ↓
Security Scan
   ↓
Deploy

🧪 Testing Strategy

Frontend

Component testing

Hook testing

Store testing

Form validation testing

API integration testing

E2E testing

Backend

Unit tests

Repository tests

Service tests

Controller tests

Security tests

Integration tests

Payment tests

Inventory concurrency tests

Critical Test

Customer A ──┐
             ├── Last T-Shirt
Customer B ──┘

Expected:

A → SUCCESS
B → OUT OF STOCK

This verifies overselling protection.

📊 Monitoring

Production monitoring architecture:

Application
     ↓
Spring Actuator
     ↓
Health Checks
     ↓
Metrics
     ↓
Logs
     ↓
Error Tracking

Important metrics:

API response time

4xx errors

5xx errors

Database connection pool

CPU

Memory

Cache hit rate

Payment failures

Checkout failures

Inventory failures

⚙️ Requirements

Before running the project, install:

Node.js
npm
Java JDK 26
Maven 3.9+
MySQL 8+
Git

Optional:

Docker
Docker Compose
Redis

🚀 Getting Started

1. Clone Repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

🎨 Frontend Setup

cd frontend
npm install

Create:

.env

Example:

VITE_API_BASE_URL=http://localhost:8080/api/v1

Start development server:

npm run dev

Frontend:

http://localhost:5173

☕ Backend Setup

Go to backend:

cd backend

Create MySQL database:

CREATE DATABASE tshirt_ecommerce;

Configure environment variables.

Example:

DB_URL=jdbc:mysql://localhost:3306/tshirt_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=your_secure_secret

PAYMENT_KEY_ID=your_key
PAYMENT_KEY_SECRET=your_secret

MAIL_HOST=your_smtp_host
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password

Run:

mvn clean install

Start application:

mvn spring-boot:run

Backend:

http://localhost:8080

🔑 Environment Variables

Never commit secrets to GitHub.

Use:

.env
application-local.yml
application-prod.yml

and add secrets to .gitignore.

Example:

.env
.env.*
!.env.example

application-local.yml

🌱 Database Migration

For production, database schema changes should be version controlled using migrations.

Example:

V1__initial_schema.sql
V2__product_variants.sql
V3__wishlist.sql
V4__reviews.sql
V5__notifications.sql

Recommended migration tool:

Flyway

🔌 API Structure

Base URL:

/api/v1

Authentication

POST /auth/register
POST /auth/login
POST /auth/verify-otp
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/refresh

Products

GET /products
GET /products/{slug}
POST /admin/products
PUT /admin/products/{id}
DELETE /admin/products/{id}

Categories

GET /categories
POST /admin/categories
PUT /admin/categories/{id}
DELETE /admin/categories/{id}

Cart

GET /cart
POST /cart/items
PUT /cart/items/{id}
DELETE /cart/items/{id}
DELETE /cart

Wishlist

GET /wishlist
POST /wishlist/items/{productId}
DELETE /wishlist/items/{productId}
POST /wishlist/merge
DELETE /wishlist

Orders

GET /orders
GET /orders/{id}
POST /orders
POST /orders/{id}/cancel

Payments

POST /payments/create
POST /payments/verify
POST /payments/webhook

Reviews

GET /products/{id}/reviews
POST /products/{id}/reviews
PUT /reviews/{id}
DELETE /reviews/{id}
POST /reviews/{id}/helpful

Addresses

GET /addresses
POST /addresses
PUT /addresses/{id}
DELETE /addresses/{id}
PATCH /addresses/{id}/default

🔒 API Security

Public endpoints:

GET /products
GET /categories
GET /products/{slug}

Customer protected endpoints:

/cart/**
/wishlist/**
/orders/**
/addresses/**
/reviews/**

Admin protected endpoints:

/admin/**

Authorization:

JWT
 ↓
Authentication
 ↓
Role Check
 ↓
Resource Ownership
 ↓
Controller

🖥️ Admin Routes

/admin
/admin/products
/admin/categories
/admin/orders
/admin/customers
/admin/payments
/admin/inventory
/admin/coupons
/admin/shipping
/admin/returns
/admin/refunds
/admin/reviews
/admin/notifications
/admin/analytics
/admin/settings

🎨 UI / UX Design

The storefront follows a premium fashion-commerce visual direction inspired by modern minimalist fashion websites.

Design principles:

Clean typography

Large product imagery

Spacious layouts

Strong visual hierarchy

Minimal navigation

Premium product cards

Smooth hover effects

Scroll animations

Light / Dark mode

Responsive design

Mobile-first layouts

Accessible interactions

📱 Responsive Design

Supported layouts:

Mobile
Tablet
Laptop
Desktop
Large Desktop

Navigation, product grids, checkout and admin dashboard are designed to adapt to different screen sizes.

🌗 Theme System

The application supports:

Light Mode
Dark Mode

Theme preference can be persisted across sessions.

All major components should use semantic theme tokens instead of hard-coded colors.

📈 Development Roadmap

Phase 1 — Frontend Foundation

React + Vite

TypeScript

Tailwind CSS

Design system

Navbar

Theme system

Hero section

Collections

Product cards

Phase 2 — Customer Shopping

Product details

Cart

Wishlist

Authentication

Shop

Search

Filters

Product API integration

Phase 3 — Backend Core

Product entity

Product images

Categories

Variants

SKU

Stock

Product APIs

Admin product management

Phase 4 — Authentication

Spring Security

JWT

RBAC

Admin authentication

Protected APIs

Phase 5 — Commerce

Backend cart

Guest cart

Cart merge

Checkout

Address

Shipping

Coupons

Orders

Payments

Phase 6 — Operations

Inventory reservation

Shipment

Notifications

Returns

Refunds

Reviews

Phase 7 — Intelligence

Search engine

Recently viewed

Wishlist 2.0

Similar products

Frequently bought together

Recommendations

Phase 8 — Production

Performance

SEO

Security hardening

Docker

CI/CD

Monitoring

Testing

Deployment

🧭 Project Development Steps

01. React + Vite + TypeScript + Tailwind
02. Global Design System + Navbar
03. Hero Section
04. Collection / Product Section
05. Product Details
06. Cart + Wishlist
07. Authentication UI
08. Shop + Search + Filters
09. Product API + React Query
10. Spring Boot Product Backend
10.5 Product Variants
11. Admin Product Management
12. Admin Authentication + JWT + RBAC
13. Backend Cart + Inventory
13.5 Guest Cart + Merge
14. Checkout
15. Order Management
16. Payment Gateway
17. Inventory Reservation
18. Coupon Engine
19. Shipping + Delivery
20. Customer Profile + Address
21. Reviews + Ratings
22. Notifications
23. Returns + Refunds
24. Admin Dashboard + Analytics
25. Search Engine
26. Wishlist 2.0 + Recommendations
27. Performance + SEO + Production
28. Testing + Security + Deployment + Monitoring

🏆 Production Goals

The final application aims to provide:

✅ Secure Authentication
✅ Role-Based Authorization
✅ Real Database Persistence
✅ Atomic Inventory
✅ Payment Lifecycle
✅ Order Management
✅ Shipping
✅ Returns / Refunds
✅ Reviews
✅ Notifications
✅ Search
✅ Recommendations
✅ Admin Analytics
✅ SEO
✅ Performance Optimization
✅ Docker
✅ CI/CD
✅ Monitoring

🤝 Contributing

Fork the repository.

Create a feature branch.

git checkout -b feature/your-feature

Make your changes.

Run tests.

mvn test
npm test

Commit changes.

git commit -m "feat: add product recommendation system"

Push:

git push origin feature/your-feature

Open a Pull Request.

📝 Commit Convention

Recommended Conventional Commits:

feat: new feature
fix: bug fix
refactor: code refactoring
docs: documentation
style: UI/style changes
test: tests
perf: performance improvement
security: security improvement
chore: configuration/tooling

Examples:

git commit -m "feat: add wishlist merge"
git commit -m "feat: add product variants"
git commit -m "fix: prevent inventory overselling"
git commit -m "perf: optimize product queries"
git commit -m "security: add admin role protection"

📄 License

This project is currently intended as a portfolio / learning / development project.

Add your preferred license before public production distribution.

👨‍💻 Author

Krishna Singh

Full Stack Developer

Core Focus

React
TypeScript
Tailwind CSS
Java
Spring Boot
MySQL
REST APIs
Spring Security
JWT
Docker
Git / GitHub

⭐ Project Vision

The goal of this project is not simply to build a shopping UI.

The goal is to build a real-world, scalable and production-style e-commerce architecture where every major business workflow is handled correctly:

                    CUSTOMER
                       │
                       ▼
                    PRODUCT
                       │
                       ▼
                      CART
                       │
                       ▼
                    CHECKOUT
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
         INVENTORY             PAYMENT
             │                   │
             └─────────┬─────────┘
                       ▼
                      ORDER
                       │
                       ▼
                    SHIPPING
                       │
                       ▼
                   DELIVERY
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
           REVIEW              RETURN
                                 │
                                 ▼
                               REFUND

The platform is designed so that individual modules can evolve independently while maintaining clear boundaries between frontend, backend, database, security, payments and inventory.

🚀 Final Vision

A premium T-shirt e-commerce platform built with modern frontend engineering, secure Java backend architecture, transactional MySQL data management and production-focused DevOps practices.

⭐ If you find this project useful, consider giving the repository a star.
