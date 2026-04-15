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
*(If you do not have MongoDB running locally, update the `MONGODB_URI` string in `backend/.env` with your MongoDB Atlas cluster string!)*

### 2. Install Dependencies
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
## 👨‍💻 Contributor
- Xaan (Collaborator)
*Enjoy exploring EventSphere!*
