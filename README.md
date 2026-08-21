# MOSPI Survey System

> **Team Name:** CODE SENTINELS  
> **Institute:** Bannari Amman Institute of Technology  

The **MOSPI Survey System** is a next-generation, AI-driven survey platform designed for large-scale data collection. It completely revolutionizes the survey lifecycle by introducing AI-assisted survey creation, multimodal deployment, robust offline-first synchronization, and real-time dashboard analytics.

---

## 🌟 Key Features

### 1. AI Survey Builder
- **Smart Generation:** Enter a prompt (e.g., "Monthly Per Capita Expenditure on food") and the AI will automatically fetch relevant questions from the historical database, detect missing contexts, and generate standard questions matching MOSPI methodologies.
- **Form Designer:** Drag-and-drop interface for structuring questions, skip logic, and validation rules.

### 2. Multimodal Deployment
- **Web App:** A React-based responsive portal for enumerators and nodal officers.
- **WhatsApp Integration:** Automated outreach and interactive survey completion directly via WhatsApp.
- **SMS Gateway:** Fallback mechanism and notifications via SMS.

### 3. Core Architecture
- **Microservices Setup:** Independent services for AI interactions, core business logic, SMS routing, and OTP validation.
- **Resilient & Fast:** Built with Spring Boot (Core & SMS) and FastAPI (AI Engine) for high throughput.

---

## 📂 Project Structure

```
.
├── apps/
│   └── frontend/          # React + Vite web portal (Dashboard, Builder, Registry)
├── services/
│   ├── ai-engine/         # FastAPI + Python + Gemma LLM for semantic question generation
│   ├── core-backend/      # Spring Boot server for database and main business logic
│   ├── sms-service/       # Spring Boot service for Twilio/WhatsApp integration
│   └── otp-service/       # Auth/OTP handling service
└── docs/                  # Assorted documentation and diagrams
```

*(Note: The `datavalidation` module operates as a separate standalone entity and is tracked independently).*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+ and Maven
- Python 3.10+
- [Ollama](https://ollama.ai/) running `gemma3:4b` model (for the AI Engine)

### 1. Start the Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

### 2. Start the AI Engine
Ensure Ollama is running and has the required model pulled.
```bash
cd services/ai-engine
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start Core & SMS Services
Ensure you have your application properties (e.g., DB credentials, Twilio keys) properly configured.
```bash
cd services/core-backend
mvn spring-boot:run

cd ../sms-service
mvn spring-boot:run
```

---

## 👥 The Team

- **Yogeswaran V** – AI Engineer  
- **Sabesh Pranith J** – AI Engineer  
- **Mohith S** – Backend Developer  
- **Thithiksaa S K** – Frontend Developer  

---

## 📜 License
This project was developed for the **MOSPI Survey Innovation Hackathon (Statathon 26)**. All rights reserved by the respective team members and institutions.
