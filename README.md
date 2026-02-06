# Notes & Bookmarks Manager (NBM)

A modern, responsive web application to manage **notes** and **bookmarks** efficiently.  
Built with **Next.js (App Router)**, **Node.js**, **MongoDB**, and **Tailwind CSS**.  

Users can **register, login, create notes, save bookmarks, mark favorites, and reset passwords via OTP**. Fully responsive dark theme with smooth animations.

---

## 🌟 Features

### Core Features
- **User Authentication** using JWT  
- **Notes Management**
  - Create, edit, delete notes  
  - Add **tags** (comma-separated)  
  - Mark notes as **favorites**  
  - Pagination and search  
- **Bookmarks Management**
  - Add bookmarks via URL   
  - Edit, delete, mark as favorite  
  - Pagination and search  

### Bonus Features
- **Register & Login via email OTP verification**  
- **Forgot Password** with email OTP  
- Smooth **animations** for modals and page transitions  
- **Dark theme** with modern UI  
- **Mobile-friendly hamburger menu**  
- Responsive layout for desktop & mobile

---

## 🔹 Tech Stack

**Frontend:**
- Next.js (App Router)
- React
- Tailwind CSS
- Vercel deployment

**Backend:**
- Node.js + Express
- MongoDB (Atlas or local)
- JWT authentication
- Nodemailer for email OTPs
- Render deployment

---

## 🔹 Demo

- Frontend deployed on **Vercel**: `https://notes-bookmarks-frontend.vercel.app`
- Backend deployed on **Render**: `https://notes-bookmarks-backend-uzya.onrender.com`

---

## 🔹 Installation

### 1. Backend
1. Clone backend repo:
   ```bash
   git clone https://github.com/krishna3032004/Notes-Bookmarks-backend.git
   cd notes-bookmarks-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with:
   ```bash
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password_or_app_password
   ```
4. Start server:
   ```bash
   npm start
   ```
The backend will run on http://localhost:5000.

### 2. Frontend
1. Clone frontend repo:
   ```bash
   git clone https://github.com/krishna3032004/Notes-Bookmarks-frontend.git
   cd notes-bookmarks-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run frontend locally:
   ```bash
   npm run dev
   ```
