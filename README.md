# 🏥 HealthAI - Next-Generation Clinical Intelligence Platform

HealthAI is a robust, modern healthcare management system designed to connect patients and doctors while leveraging the power of local and cloud AI to provide automated clinical insights. 

The platform features a secure **Django Backend** with role-based access control, a sleek **React Frontend**, and deep integration with **Ollama** and **Google Gemini** for privacy-first, intelligent medical report analysis and patient chatting.

## ✨ Features

*   **🔒 Role-Based Access Control (RBAC):** Separate, secure dashboards for Doctors and Patients.
*   **📂 Digital Medical Vault:** Patients can securely upload PDF medical reports, which the system stores, parses, and extracts text from automatically.
*   **🤖 Local AI Chatbot (Ollama):** A 100% private, intelligent health assistant powered by local Llama models (e.g., `phi3`, `mistral`, or `tinyllama`) that reads your medical history and chats with you.
*   **📰 AI Clinical Research Engine:** Fetches the latest medical news via RSS feeds and uses Google Gemini to generate rapid executive summaries for doctors.
*   **✨ Premium UI:** Built with Vite, React, and Tailwind CSS, featuring glassmorphism, responsive design, and smooth animations.

## 🖼️ Screenshots

*(Drag and drop your project screenshots here!)*
1. **Homepage:** `[Add Homepage Screenshot]`
2. **Dashboard:** `[Add Dashboard Screenshot]`
3. **Medical Research Engine:** `[Add Research Engine Screenshot]`
4. **AI Assistant Chat:** `[Add Chat Screenshot]`

## 🛠️ Technology Stack

**Frontend:**
*   React 18
*   Vite
*   Tailwind CSS
*   Lucide React (Icons)
*   React Router DOM

**Backend:**
*   Django & Django REST Framework
*   SQLite (Development) / PostgreSQL (Production ready)
*   PyPDF2 (Medical document parsing)
*   Requests (Ollama integration)
*   Google GenAI SDK

**AI & Machine Learning:**
*   **Ollama:** Local LLM engine for secure, offline patient chatting.
*   **Google Gemini:** Cloud LLM for summarizing dense medical research articles.

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)
*   [Ollama](https://ollama.com/) (For local AI chat)

### 1. Clone the Repository
```bash
git clone https://github.com/MYGITACCOUNT-10/AI_Health.git
cd AI_Health
```

### 2. Backend Setup
Navigate into the backend directory and set up your Python virtual environment.
```bash
cd backend
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/config` directory with your Gemini API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

Run the database migrations and start the server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, install the packages, and start Vite.
```bash
cd frontend
npm install
npm run dev
```

### 4. AI Setup
Make sure the Ollama application is running on your machine. Open a new terminal and pull the required model (we use `phi3` by default):
```bash
ollama pull phi3
```

You can change the default model at any time inside `backend/ai_engine/services/chat_service.py`.

---

