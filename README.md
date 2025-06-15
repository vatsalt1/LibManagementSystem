# 📚 BibloSphere – Smart Library Management System

**BibloSphere** is a modern, full-stack Library Management System built using React, Node.js, Express, and MongoDB. Designed for institutions, private reading clubs, or individuals, it allows users to explore, request, and manage books, while providing admins with powerful tools to oversee the entire library ecosystem.

---

## ✨ Key Features

### 👤 User Registration & Login
- Users can **sign up** using their email address.
- A **One-Time Password (OTP)** is sent to the registered email for verification using `nodemailer`.
- Stateless **JWT-based authentication** secures session tokens without maintaining server-side state.
- Logged-in users can explore books, request rentals, and manage their profile.

### 📖 Book Browsing & Management
- Users can:
  - View books categorized by genres (Technology, Health, Leadership, etc.)
  - Mark books as **favorites**
  - **Request** a book for rental
  - View their **rental** and **request history**

- Admins can:
  - Add new books with details
  - Edit or delete books
  - See all rental/return records
  - Approve or reject book requests

### 📊 Admin Dashboard
- A dedicated interface with access to:
  - All users and their rental activities
  - Pending and past book requests
  - Book inventory editing

### 🔐 Stateless Authentication
- Login generates a **JWT token** which is stored client-side (e.g., localStorage).
- Every protected route checks the validity of the token.
- Stateless authentication ensures better scalability and decoupling of session management from backend memory.

---

## 🧰 Technologies Used

### 🖼️ Frontend (React App)
- **React.js**: Component-based architecture for building dynamic UI.
- **Redux**: Centralized state management for user, admin, and app-wide state like profile toggles.
- **Tailwind CSS**: A utility-first CSS framework used to rapidly build responsive designs.
- **React Router DOM**: For handling routing between pages like login, dashboard, books, etc.
- **React Icons**: Icon packs used for UI elements (e.g., notification bell).
- **React Draggable**: Enables dragging of sidebar or cards for better user interaction (legacy support).

### 🧠 Backend (Node.js + Express)
- **Express.js**: A fast web framework for Node.js used to build the RESTful APIs.
- **MongoDB**: A NoSQL database to store user information, books, rental requests, etc.
- **Mongoose**: An Object Data Modeling (ODM) tool for MongoDB used to define schemas and interact with the database.
- **jsonwebtoken (JWT)**: Used to issue and validate user tokens for secure stateless authentication.
- **nodemailer**: Sends OTPs to users' emails as part of the registration verification process.
- **dotenv**: Loads environment variables securely from a `.env` file.

---

## 🧪 How It Works

- On **registration**, the backend:
  1. Generates a 6-digit OTP.
  2. Sends the OTP to the user’s email using `nodemailer`.
  3. Waits for OTP verification to complete.
  4. On successful verification, issues a **JWT** token and stores the user in the database.

- On **book requests**:
  - Users request a book → the backend stores this request.
  - Admins can approve or reject it from their dashboard.
  - The status updates are reflected immediately in the user's rental history.

- **Admin controls** use additional backend checks to restrict certain endpoints (e.g., book creation/deletion) to authorized users.

---

## 🔧 Getting Started

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the backend root:
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### 3. Run the App

#### Backend
```bash
npm start
```

#### Frontend
```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Security Highlights

- **JWT-based authentication** avoids server-side session management.
- Passwords are stored securely using bcryptjs (or planned extensions).
- **Email-based OTP verification** ensures email ownership and reduces spam/bot accounts.
- Admin privileges are tightly scoped in backend controllers.

---

## 💡 Future Roadmap

- Role-based Access Control (RBAC) for multi-level admin users
- Push notifications for book request approvals
- Book availability counters and due-date tracking
- Advanced analytics dashboard for insights

---

## 🤝 Contributing

If you'd like to contribute, feel free to:
1. Fork the repo
2. Create a new feature branch
3. Submit a pull request

All contributions are welcome — whether it's bug fixes, performance improvements, UI/UX tweaks, or feature ideas.

