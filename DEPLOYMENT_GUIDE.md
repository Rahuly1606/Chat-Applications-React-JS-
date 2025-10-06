# Deployment Guide for Chat Application

## 🚨 Important Notice
This chat app uses **Socket.IO** for real-time messaging. Vercel's serverless architecture has **limitations with WebSocket connections**.

## ✅ Recommended Approach: Split Deployment

### Backend Deployment (Railway - FREE & Easy)

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project** → **Deploy from GitHub**

3. **Select your repository**

4. **Configure Backend:**
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. **Add Environment Variables in Railway:**
   ```
   MONGODB_URI=mongodb+srv://rahulftz12:Rahul%401606@cluster0.mo9pb.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster0
   PORT=5001
   JWT_SECRET=mysecretkey
   CLOUDINARY_CLOUD_NAME=dt8xx5yyr
   CLOUDINARY_API_KEY=699977261195478
   CLOUDINARY_API_SECRET=CqsNt_0g2uH2yCMvpMKVKbCHn2Q
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Copy the deployed backend URL** (e.g., `https://your-app.railway.app`)

### Frontend Deployment (Vercel)

1. **Update Frontend Configuration**
   
   In `frontend/src/lib/axios.js` and any Socket.IO connection file, update the API base URL to your Railway backend URL.

2. **In `frontend/src/store/useAuthStore.js`:**
   ```javascript
   const BASE_URL = import.meta.env.MODE === "development" 
     ? "http://localhost:5001" 
     : "https://your-backend.railway.app";
   ```

3. **Deploy to Vercel:**
   - Connect your GitHub repository
   - **Root Directory:** Leave empty or use `/`
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install --prefix frontend`

4. **Environment Variables in Vercel:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

5. **Update Backend CORS** with your Vercel URL in Railway environment variables:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

---

## 🔄 Alternative: Deploy Both on Railway

If you prefer to deploy everything on Railway:

1. **Create Railway Project** from GitHub
2. **Root Directory:** Leave empty
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
5. Add all environment variables
6. Railway will handle both frontend serving and backend APIs

---

## 📋 Current Vercel Setup (Frontend Only)

To use the `vercel-frontend-only.json` configuration:

1. Rename it to `vercel.json`:
   ```bash
   mv vercel-frontend-only.json vercel.json
   ```

2. Update your backend URL in frontend code

3. Deploy backend separately on Railway/Render

---

## ⚠️ Note on Socket.IO and Vercel

Vercel serverless functions have a **10-second execution limit** and don't support persistent connections. This makes Socket.IO unreliable on Vercel for the backend. Use Railway, Render, or Heroku for the backend instead.
