# EstateLens AI - Full-Stack Property Valuation Platform

## 🚀 Deployment Note: MongoDB DNS Fix
If you encounter `querySrv ETIMEOUT` errors during deployment, use the **Direct Connection String** instead of the `+srv` format. This bypasses DNS resolution issues common on some hosting providers.

**Required Environment Variables:**
- `MONGODB_URI` (Frontend) & `MONGO_URI` (Backend):
  *Use the direct connection string provided in your secure dashboard (non-SRV format).*

EstateLens is a professional, decoupled house price prediction platform built with **Next.js 14**, **FastAPI**, and **Random Forest Regression**. It features a modern SaaS UI, secure JWT authentication, and SHAP-based AI explainability.

## 🚀 Live Access

- **Landing Page**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Market Dashboard**: [https://your-app.vercel.app/dashboard](https://your-app.vercel.app/dashboard)
- **ML API Service**: [https://your-ml.onrender.com](https://your-ml.onrender.com)
- **Interactive API Docs (Swagger)**: [https://your-ml.onrender.com/docs](https://your-ml.onrender.com/docs)

---

## 🏗️ Architecture Overview

### 1. Frontend (Next.js 14)
- **Framework**: App Router with Client & Server Components.
- **Authentication**: NextAuth.js with Credentials provider and MongoDB adapter.
- **Styling**: Tailwind CSS with custom branding and dark-mode gradients.
- **Visualization**: Recharts for real-time feature impact analysis.

### 2. ML API (FastAPI)
- **Model**: Random Forest Regressor (R² Score: 0.86).
- **Explainability**: Integrated SHAP (TreeExplainer) for per-prediction factor breakdowns.
- **Inference**: High-speed REST endpoints with Pydantic validation.

### 3. Data Layer (MongoDB)
- **Persistance**: Mongoose-driven schemas for Users and Prediction histories.
- **Caching**: Global connection singleton for optimized serverless performance.

---

## 🚥 Quick Start (Local Development)

### 1. Set Environment Variables
Create `.env.local` in `frontend/`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
MONGODB_URI=your_mongodb_uri
ML_API_URL=http://localhost:8000
```

### 2. Train and Run ML API
```bash
cd ml_api
pip install -r requirements.txt
python train.py
uvicorn main:app --reload --port 8000
```

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Deployment Instructions

### Vercel (Frontend)
1. Import the `frontend/` folder.
2. Add the environment variables from `.env.local`.
3. Set the root directory to `frontend/`.

### Render (ML API)
1. Import the `ml_api/` folder.
2. The `render.yaml` will automatically configure:
   - Python 3.11 Runtime
   - `pip install -r requirements.txt`
   - `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

Built with ❤️ by **RealEstateAI Team**.
