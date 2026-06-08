# InsightForge AI 🔮

An industrial-grade AI/Data Science Analytics Platform built with a production-style full-stack architecture. Upload datasets, run analytics, and generate ML predictions — all through a clean, modern dashboard.

🌐 **Live Demo:** [insightforge-ai.up.railway.app](https://insightforge-ai.up.railway.app)

---

## ✨ Features

- 📁 **CSV Upload & Analytics** — Upload any dataset and instantly get descriptive statistics, missing value detection, and column summaries
- 🤖 **ML Predictions** — Train a Linear Regression model on your data and visualize predictions with interactive charts
- 🔐 **JWT Authentication** — Secure register/login system with bcrypt password hashing
- 📊 **Interactive Dashboard** — Real-time stats, animated counters, and dataset history
- ☁️ **Cloud Deployed** — Fully live on Railway with a production MySQL database

---

## 🛠️ Tech Stack

**Backend**
- Python, FastAPI, Uvicorn
- SQLAlchemy ORM, MySQL
- pandas, NumPy, scikit-learn
- JWT (python-jose), bcrypt

**Frontend**
- React, Tailwind CSS
- Axios, React Router
- Recharts, Framer Motion

**DevOps**
- Docker, Docker Compose
- Railway (Cloud Deployment)
- Git, GitHub

---

## 🏗️ Architecture
insightforge-ai/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLAlchemy engine and session
│   │   ├── models.py        # Database models (User, Dataset)
│   │   ├── auth.py          # JWT and bcrypt logic
│   │   ├── routers/
│   │   │   ├── upload.py    # CSV upload endpoints
│   │   │   ├── predict.py   # ML prediction endpoints
│   │   │   └── auth.py      # Auth endpoints
│   │   └── services/
│   │       ├── analytics.py # pandas data processing
│   │       └── ml.py        # scikit-learn ML logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard, Upload, Predict
│   │   ├── api/             # Axios client
│   │   └── main.jsx
│   └── Dockerfile
└── docker-compose.yml
---

## 🚀 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create a new account | ❌ |
| POST | `/auth/login` | Login and get JWT token | ❌ |
| POST | `/upload` | Upload CSV and get analytics | ✅ |
| GET | `/datasets` | Get all uploaded datasets | ✅ |
| POST | `/predict` | Run ML prediction on CSV | ✅ |

---

## 🖥️ Running Locally

### Prerequisites
- Python 3.11+
- Node.js 20+
- MySQL
- Docker (optional)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

---

## 📸 Screenshots

### Login Page
Clean, modern authentication with navy + purple theme.

### Dashboard
Real-time stats with animated counters and dataset history table.

### Upload & Analytics
CSV upload with instant pandas-powered analytics, missing value detection, and data preview.

### ML Predictions
Linear Regression model with R² score gauge, MSE card, and predicted values bar chart.

---

## 👨‍💻 Author

**Vivaswaan Nanda**
- GitHub: [@bigvivas1705](https://github.com/bigvivas1705)
- LinkedIn: [your linkedin url]

---

## 📄 License

MIT License