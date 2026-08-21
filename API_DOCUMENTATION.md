# WELLORA (সাজঘর) - Complete Backend API Specification

> **Environment Base URL**: Specified via `NEXT_PUBLIC_BASE_URL` in `.env.local`  
> **Default Authorization Header**: `Authorization: <Bearer_Token>`  
> **Content-Type**: `application/json` (or `multipart/form-data` for file uploads)

---

## Table of Contents
1. [Authentication & Auth Management (`/auth`)](#1-authentication--auth-management-auth)
2. [User Account & Admin Management (`/users`)](#2-user-account--admin-management-users)
3. [User Profile & Experiences (`/profile`)](#3-user-profile--experiences-profile)
4. [Product Catalog & Reviews (`/products`)](#4-product-catalog--reviews-products)
5. [Orders & Checkout Management (`/orders`)](#5-orders--checkout-management-orders)
6. [Distributor & Affiliate Network (`/distributors`)](#6-distributor--affiliate-network-distributors)
7. [Super Admin Telemetry & Settings (`/admin`)](#7-super-admin-telemetry--settings-admin)
8. [Customer Wishlist (`/wishlist`)](#8-customer-wishlist-wishlist)
9. [Loyalty & Rewards Program (`/loyalty`)](#9-loyalty--rewards-program-loyalty)

---

## 1. Authentication & Auth Management (`/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Path**: `/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "password": "SecurePassword123!",
    "role": "customer" // "customer" | "distributor" | "admin"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { "id": "usr_901", "name": "Sarah Jenkins", "email": "sarah@example.com", "role": "customer" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 1.2 Login User
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "sarah@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "usr_901", "name": "Sarah Jenkins", "email": "sarah@example.com", "role": "customer" }
  }
  ```

### 1.3 Get Logged-In User (`getMe`)
- **Method**: `GET`
- **Path**: `/auth/me`
- **Auth Required**: Yes
- **Response `200 OK`**:
  ```json
  {
    "id": "usr_901",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "role": "customer"
  }
  ```

### 1.4 Logout
- **Method**: `POST`
- **Path**: `/auth/logout`
- **Auth Required**: Yes

### 1.5 Forgot & Reset Password
- **Method**: `POST` | **Path**: `/auth/forgot-password` (`{ "email": string }`)
- **Method**: `POST` | **Path**: `/auth/reset-password` (`{ "email": string, "otp": string, "newPassword": string }`)
- **Method**: `POST` | **Path**: `/auth/verify-otp` (`{ "email": string, "otp": string }`)

---

## 2. User Account & Admin Management (`/users`)

### 2.1 Get All Users (Admin)
- **Method**: `GET`
- **Path**: `/users?search=&role=&page=1&limit=10`
- **Auth Required**: Yes (Admin)

### 2.2 Get / Update / Delete User by ID
- `GET /users/:id` — Get public profile
- `PATCH /users/:id` — Update user details or upload avatar (`FormData`)
- `DELETE /users/:id` — Delete user account

---

## 3. User Profile & Experiences (`/profile`)

- `GET /profile/my-profile` — Fetch current user full profile
- `PATCH /profile/update-profile` — Update bio/avatar (`FormData`)
- `POST /profile/manage/:model` — Add items (e.g. addresses)
- `PATCH /profile/manage/:model/:id` — Edit item
- `DELETE /profile/manage/:model/:id` — Remove item

---

## 4. Product Catalog & Reviews (`/products`)

### 4.1 Get All Products
- **Method**: `GET`
- **Path**: `/products?category=Serum&search=snail&sort=price-low&page=1&limit=12`
- **Auth Required**: No
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "prod-cosrx-snail",
      "brand": "COSRX",
      "name": "Advanced Snail 96 Mucin Power Essence",
      "category": "Serum",
      "price": 1850,
      "points": 18,
      "image": "/assets/products/cosrx.jpg",
      "altText": "COSRX Snail Essence bottle",
      "description": "Formulated with 96.3% Snail Secretion Filtrate...",
      "volume": "100ml / 3.38 fl.oz",
      "keyIngredients": ["Snail Secretion Filtrate", "Sodium Hyaluronate"],
      "skinType": ["Dry", "Sensitive"],
      "isTrending": true,
      "rating": 4.9,
      "reviewsCount": 128,
      "inStock": true,
      "distributorCommissionRate": 0.18
    }
  ]
  ```

### 4.2 Get Product By ID
- **Method**: `GET`
- **Path**: `/products/:id`

### 4.3 Admin Product Operations
- `POST /products` — Create new product (`FormData`)
- `PATCH /products/:id` — Update product details
- `DELETE /products/:id` — Delete product from catalog

### 4.4 Product Reviews
- `GET /products/:productId/reviews` — Fetch product reviews
- `POST /products/:productId/reviews` — Submit review (`{ "rating": 5, "comment": "Amazing serum!" }`)

---

## 5. Orders & Checkout Management (`/orders`)

### 5.1 Customer: Create Storefront Order
- **Method**: `POST`
- **Path**: `/orders`
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "items": [
      { "productId": "prod-cosrx-snail", "quantity": 2 }
    ],
    "shippingAddress": {
      "name": "Sarah Jenkins",
      "phone": "+880 1700 000000",
      "address": "House 24, Road 8, Dhanmondi",
      "city": "Dhaka",
      "district": "Dhaka"
    },
    "paymentMethod": "cod" // "cod" | "bkash" | "nagad" | "card"
  }
  ```

### 5.2 Customer: Get My Orders
- **Method**: `GET`
- **Path**: `/orders/my-orders?status=Processing&page=1`

### 5.3 Distributor: Create Partner Order
- **Method**: `POST`
- **Path**: `/orders/distributor`
- **Request Body**:
  ```json
  {
    "customerName": "Rahim Uddin",
    "phoneNumber": "+880 1711 999888",
    "deliveryAddress": "Agrabad, Chittagong",
    "items": [{ "productId": "prod-cosrx-snail", "quantity": 1 }],
    "channel": "WhatsApp"
  }
  ```

### 5.4 Admin: Get All Orders & Update Status
- `GET /admin/orders?status=Processing` — Get order queue
- `PATCH /admin/orders/:id/status` — Update status (`{ "status": "Shipped" }`)

---

## 6. Distributor & Affiliate Network (`/distributors`)

- `GET /distributors/me` — Distributor profile overview
- `GET /distributors/wallet` — Wallet available & pending commissions
- `POST /distributors/wallet/withdraw` — Request payout (`{ "amount": 5000, "method": "bkash", "accountNumber": "01700000000" }`)
- `GET /distributors/analytics` — Sales telemetry & performance charts
- `GET /distributors/team` — Sub-affiliates & team override commissions
- `POST /distributors/referrals/generate` — Create custom referral link
- `GET /distributors/marketing-assets` — Access high-converting video/image kits

---

## 7. Super Admin Telemetry & Settings (`/admin`)

- `GET /admin/stats` — MTD Revenue, Active Orders, Active Distributors, Low Stock Count
- `GET /admin/distributors` — List all distributor partners
- `PATCH /admin/distributors/:id/status` — Approve or Suspend distributor (`{ "status": "approved" | "suspended" }`)
- `PATCH /admin/products/:id/stock` — Update stock level (`{ "stock": 50 }`)
- `GET /admin/marketing-kits` & `POST /admin/marketing-kits` — Upload and list campaign kits
- `GET /admin/settings` & `PATCH /admin/settings` — Update store settings, commission rates, support emails

---

## 8. Customer Wishlist (`/wishlist`)

- `GET /wishlist` — Fetch customer saved products
- `POST /wishlist` — Add item (`{ "productId": "prod-cosrx-snail" }`)
- `DELETE /wishlist/:productId` — Remove item from wishlist

---

## 9. Loyalty & Rewards Program (`/loyalty`)

- `GET /loyalty/my-points` — Fetch available points & tier progress
- `GET /loyalty/history` — Point earnings & redemption history
- `POST /loyalty/redeem` — Apply points discount (`{ "points": 200 }`)
