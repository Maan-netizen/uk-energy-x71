# UK Day-Ahead Wind Forecast & Procurement Portal

Interactive decision-support dashboard for UK electricity suppliers in the Day-Ahead wholesale market, utilizing official Elexon BMRS datasets (`FUELHH` and `WINDFOR`).

---

## 📁 Repository Structure
```
├── backend/
│   ├── app.py              # FastAPI endpoints & Elexon processing
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Production backend image
├── frontend/
│   ├── src/
│   │   ├── App.js          # Interactive dashboard & visualization
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── vercel.json         # Vercel deployment routing
│   └── Dockerfile          # Multi-stage Nginx build
├── docker-compose.yml       # Local single-command orchestration
└── README.md
```

---

## 🚀 How to Run Locally

### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Option B: Manual Setup

1. **Backend:**
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate | On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

2. **Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deploy to Vercel (Step-by-Step)
1. Push this entire repository to your GitHub.
2. Go to **[vercel.com](https://vercel.com)** and click **Add New > Project**.
3. Select your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Under **Environment Variables**, set:
   - `REACT_APP_API_URL`: `<URL of your deployed backend, e.g. on Render/Heroku>`
6. Click **Deploy**.

*(Tip: You can deploy the backend on Render.com Web Service by pointing to the `backend` folder with start command `uvicorn app:app --host 0.0.0.0 --port $PORT`).*

---

## 🤖 AI Tools Disclosure
In accordance with challenge requirements, AI tools were leveraged to assist with rapid prototyping, schema validation, and drafting unit test mocks.
