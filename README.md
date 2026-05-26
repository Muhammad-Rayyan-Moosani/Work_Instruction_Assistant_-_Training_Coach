# Vite + React + Flask Boilerplate

A full-stack application boilerplate with a React frontend (using Vite) and a Flask backend.

## Project Structure

```
Prebuilt_MVP/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main App component
│   │   ├── App.css        # App styles
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   ├── .env.example       # Environment variables template
│   └── package.json       # Node dependencies
│
├── backend/               # Flask backend
│   ├── app/
│   │   ├── __init__.py   # Flask app factory
│   │   └── routes.py     # API routes
│   ├── run.py            # Application entry point
│   ├── requirements.txt  # Python dependencies
│   ├── .env              # Environment variables
│   └── .env.example      # Environment variables template
│
└── .gitignore            # Git ignore file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python run.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done during setup):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
DATABASE_URL=sqlite:///app.db
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/example` - Example GET endpoint
- `POST /api/example` - Example POST endpoint

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `python run.py` - Start Flask server

## Technologies Used

### Frontend
- React 18
- Vite
- JavaScript/JSX

### Backend
- Flask 3.0.0
- Flask-CORS 4.0.0
- Python-dotenv 1.0.0

## License

MIT
