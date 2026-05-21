# Order Flow 

A real-time AI-powered food delivery ordering platform built with React, TanStack Router, Socket.IO, and live rider dispatch integration.

This project simulates a modern delivery ecosystem similar to Swiggy, Zomato, or Uber Eats where:

- Customers place food orders
- Orders are sent in real time to delivery riders
- The nearest available rider receives the order
- Riders can accept deliveries
- Customers receive live dispatch updates
- Real-time rider tracking is supported

---

# Features

## Customer Ordering
- Browse restaurants
- Add items to cart
- Place orders instantly
- Live order confirmation
- Waiting state while searching for rider
- Rider assignment updates
- Live delivery tracking

---

## Real-Time Dispatch System
- Socket.IO integration
- Instant order broadcasting
- Rider acceptance flow
- Order locking mechanism
- Prevents multiple riders accepting same order

---

## Smart Rider Assignment
- Finds nearest online rider
- Uses real-time rider coordinates
- Distance-based dispatch logic
- Simulated India-wide rider locations

---

## Live Rider Tracking
- Real-time rider location updates
- Dynamic map tracking
- Customer sees rider movement
- Delivery progress updates

---

## Rider Simulation
- Multiple riders supported
- Dynamic rider login
- Rider identity persistence
- Randomized rider locations across India

---

# Tech Stack

## Frontend
- React
- TypeScript
- TanStack Router
- TailwindCSS
- Framer Motion
- Socket.IO Client

## Maps
- Leaflet
- OpenStreetMap

## Backend Communication
- Socket.IO

---
# Important Project Architecture ⚠️

This system consists of **3 connected projects** that work together in real time.

All 3 projects must be running simultaneously for the delivery flow to work correctly.

---

# Projects Overview

## 1. Order Flow (Customer App)
Frontend application where customers:
- Browse restaurants
- Place food orders
- Track delivery partners
- Receive live order updates

Runs on:

```bash
http://localhost:3000
# Project Structure

```bash
src/
│
├── components/
├── routes/
├── store/
├── lib/

  
├── data/
├── styles/
└── socket/
