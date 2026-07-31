# AI-Powered Survey & Polling Platform

An advanced, multimodal, and multilingual survey platform built to collect and analyze responses across vast demographics seamlessly. 

## 🚀 Architecture & Stack

This project is structured as a scalable microservices-based application, composed of three main layers:

### 1. Frontend: Admin Dashboard & Citizen Portal (React + Vite)
- **Framework:** React, Tailwind CSS, Vite.
- **Role:** Houses the Admin Dashboard for creating, deploying, and tracking surveys, as well as the Citizen Interface for filling out surveys.
- **Key Features:**
  - **Citizen Interface:** Clean UI with an always-accessible text input and seamless voice recording that dynamically captures true responses without any mock data. Automatically captures geolocation and session metadata.
  - **Dynamic Translation System:** Instant translation across 10+ regional languages. Uses a robust MutationObserver backend to dynamically scan and translate all DOM elements seamlessly. Also includes synchronized BCP-47 mapped Text-to-Speech (TTS) "Listen Aloud" voices.
  - **Admin Dashboard:** Tracks real-time analytics, geolocation hotspots of responses, survey construction blocks, and a deployment center.
  - **Deployment Center:** Multi-channel distribution UI to push out surveys instantly via Web, SMS, and WhatsApp with precise, dynamic Survey IDs.

### 2. The AI Engine (FastAPI / Python)
- **Framework:** FastAPI, SentenceTransformers, Pandas.
- **Role:** The core intelligent brain of the platform.
- **Key Features:**
  - **Multilingual Translation Hub:** Uses Bhashini and Google Translation APIs to translate text arrays dynamically to any regional language without lag.
  - **Semantic AI Search:** Utilizes `BGE-M3` embeddings to perform RAG (Retrieval-Augmented Generation) and semantic analysis on open-ended citizen text/voice inputs. 
  - **Analytics & Processing:** Crunches the incoming data, extracting sentiment and intent from unstructured responses.

### 3. SMS & WhatsApp Communication Service (Spring Boot / Java)
- **Framework:** Spring Boot, Spring Data JPA, H2 In-Memory DB, Twilio SDK.
- **Role:** Handles outward distribution of notifications and survey links to targeted databases.
- **Key Features:**
  - **Twilio Integration:** Authenticates and constructs automated personalized messages.
  - **Multi-channel Dispatch:** Exposes a clean `/publish/{surveyId}` endpoint that accepts requests from the React admin panel and subsequently blasts messages across SMS and WhatsApp endpoints to registered phone numbers.
  - **Internal DB:** Simulates a citizen database (like Aadhar) to automatically resolve names and phone numbers during blast distributions.

---

## 💻 Installation & Setup Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Java (JDK 21+)
- Maven

### 1. Start the AI Engine (Python Backend)
```bash
cd services/ai-engine
# Create a virtual environment (optional but recommended)
python -m venv .venv
# Activate it (Windows)
.venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Runs on: http://localhost:8000*

### 2. Start the SMS Distribution Service (Java Backend)
```bash
cd services/sms-service
# Start the Spring Boot application using Maven Wrapper
.\mvnw spring-boot:run
```
*Runs on: http://localhost:8082*

### 3. Start the Frontend (React Web App)
```bash
cd apps/frontend
# Install packages
npm install
# Start the development server
npm run dev
```
*Runs on: http://localhost:5173*

---

## 🎯 Functional Flow

1. **Survey Creation:** Admin creates a dynamic survey on the web portal.
2. **Deployment:** Admin navigates to the Deployment Center, selects the survey, checks **SMS** and **WhatsApp**, and clicks Deploy.
3. **Distribution:** 
   - The React UI posts to the `sms_service` Java backend. 
   - The Java backend retrieves target demographic phone numbers and pings Twilio to send customized SMS invites with direct survey URL links (e.g. `?id=X`). 
   - For WhatsApp, a Click-to-Chat fallback opens a native Web WhatsApp tab for instant multi-number messaging.
4. **Citizen Engagement:** A citizen receives the SMS/WhatsApp link, opens it on their phone, and can respond either by **Typing** or via **Voice Recording**. The interface strictly records real responses and supports fully localized TTS.
5. **Real-time Analytics:** The AI Engine processes the citizen's response, analyzes sentiment, and plots the captured geolocation coordinate on the live Admin Dashboard map.
