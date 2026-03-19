

# Local Farmers' Market E-Commerce Platform

## Overview
A web-based marketplace connecting farmers in Kabale, Uganda with buyers. Three user roles: **Farmers**, **Buyers**, and **Admins** — each with dedicated dashboards and features.

## Backend (Supabase Cloud)
- **Authentication**: Email/password signup & login for all roles
- **User roles table**: Separate roles table (farmer, buyer, admin) with RLS
- **Profiles table**: Name, phone number, location, avatar
- **Products table**: Name, description, price, category (Vegetables, Fruits, Grains, Dairy, Livestock), images, quantity, farmer_id
- **Orders table**: Buyer places orders, tracks status (pending → confirmed → delivered)
- **Feedback/Reviews table**: Buyers leave ratings & comments on products
- **Storage bucket**: For product images and avatars

## Pages & Features

### 1. Landing Page
- Hero section showcasing fresh farm produce
- Featured products grid
- How it works section
- Call-to-action to sign up as Farmer or Buyer

### 2. Auth Pages
- **Register**: Choose role (Farmer or Buyer), enter name, email, phone, location, password
- **Login**: Email + password
- **Forgot password** flow

### 3. Farmer Dashboard
- **My Products**: List, add, edit, delete products with images, price, category, stock quantity
- **Orders**: View incoming orders, update status (confirm, mark delivered)
- **Profile**: Edit personal info

### 4. Buyer Dashboard
- **Browse Products**: Filter by category (Vegetables, Fruits, Grains, Dairy, Livestock), search by name
- **Product Detail**: View product info, farmer info, reviews
- **Order**: Place order with quantity, simulated Mobile Money payment form
- **My Orders**: Track order history & status
- **Leave Feedback**: Rate & review purchased products
- **Profile**: Edit personal info

### 5. Admin Dashboard
- **User Management**: View all users, activate/deactivate accounts
- **Product Approval**: Review & approve/reject farmer product listings
- **Order Overview**: View all orders and their statuses
- **Feedback Moderation**: Review and remove inappropriate feedback
- **Sales Reports**: Charts showing orders over time, top products, revenue stats

### 6. Shared
- Responsive navigation with role-based menu items
- Toast notifications for actions
- Mobile-friendly design

