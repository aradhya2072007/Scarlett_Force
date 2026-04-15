# EventSphere 🌐

**EventSphere** is a modern, premium full-stack event organizing platform designed to recommend events based on a user's personality traits. It dynamically matches your personalized profile with event tags, offering a curated "For You" experience alongside powerful standard filtering tools.

## 🚀 Key Features

*   **AI-like Recommendation Engine**: Take an interactive multi-step personality quiz. An algorithm computes a trait matrix (Social, Tech, Creative, Energetic, etc.) and uses intelligent scoring to recommend events that match exactly who you are.
*   **Stunning Modern UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion. Heavily features glassmorphism, depth-based card designs, dynamic gradient glow effects, and hyper-smooth animations.
*   **Event Dashboard**: A personalized hub showcasing your AI traits, your upcoming event RSVPs, and your top recommendations.
*   **Robust Event Filtering**: Use standard manual overrides including text search, category dropdowns, and dynamic price ranges natively right alongside the AI toggle.
*   **Event RSVP System**: Built-in capacity management system automatically switching to "Waitlisted" when an event is full.

---

## 🛠 Tech Stack

**Frontend:**
*   Next.js 14 (App Router)
*   React
*   Tailwind CSS (Highly customized tokens)
*   Framer Motion (Transitions & Micro-interactions)
*   Axios (API fetching)
*   React Hot Toast (Sleek alerts)

**Backend:**
*   Node.js & Express.js
*   MongoDB + Mongoose
*   JSON Web Tokens (JWT) & bcrypt.js for Auth

---

## 💻 How to Run It Locally

### 1. Prerequisites
You need **Node.js** and **MongoDB** installed on your system.

### 2. Environment Setup
Since environment variables (`.env`) are ignored by Git, you **must** manually create them after cloning the repository.

1. **Inside the `backend` folder**, create a file named `.env` and add:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/eventsphere
JWT_SECRET=eventsphere_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

2. **Inside the `frontend` folder**, create a file named `.env.local` and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Install Dependencies
A root `package.json` allows you to install both layers easily. In the root directory run:
```bash
npm run install-all
```

### 3. Seed the Database
Populate the database with a rich set of 24 realistic events and an Admin user:
```bash
npm run seed
```

### 4. Start the Application
Spin up both the Express API and the Next.js frontend concurrently!
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 🔐 Demo / Provided Accounts

After running the seed script, log in with the admin account to experience it immediately:

**Email:** `admin@eventsphere.com`
**Password:** `Admin@12345`

*Enjoy exploring EventSphere!*
