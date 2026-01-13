# University Club Hub

A comprehensive platform for university clubs, managing events, memberships, and real-time communication.

## Features

-   **User Roles**: Student and ClubAdmin.
-   **Club Management**: Create and manage clubs.
-   **Event System**: Create events, register students, and verify attendance via QR Code.
-   **Real-time Chat**: Live chat rooms for club members using Socket.io.
-   **Modern UI**: Built with React, Vite, Tailwind CSS (Glassmorphism), and Framer Motion.

## Prerequisites

-   Node.js (v14+)
-   MongoDB (running locally or cloud URI)

## Setup Instructions

### 1. Backend Setup

Navigate to the `backend` folder:

```bash
cd backend
```

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/clubhub
JWT_SECRET=your_jwt_secret_key_here
```

Install dependencies and start the server:

```bash
npm install
npm start
```

The server will run on `http://localhost:5000`.

### 2. Frontend Setup

Navigate to the `frontend` folder:

```bash
cd frontend
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`.

## Usage Guide

1.  **Register/Login**: Create an account.
2.  **Club Discovery**: Browse clubs. Note: Use Postman or direct DB access to create initial clubs or promote a user to `ClubAdmin` role if no UI exists for that yet.
3.  **Chat**: Join a club (add your ID to members array in DB manually or implement join button logic if not fully automated) to access the chat.
4.  **Admin Dashboard**: Navigate to `/admin` to create events.
5.  **Scanner**: Navigate to `/scanner` to verify event attendance.

## Technologies

-   **Backend**: Node.js, Express, Mongoose, Socket.io, JWT, BCrypt.
-   **Frontend**: React, Vite, Tailwind CSS, Axios, Socket.io-Client, Framer Motion, React Hot Toast, QRCode, Html5-Qrcode.
