# 🧪 Cuemath AI Tutor Screener
An advanced, AI-powered pedagogical assessment tool designed for **Cuemath** to screen tutor candidates. This application simulates a real-world teaching scenario with a math-anxious 9-year-old student named Rohan.
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq-Llama3-orange?style=for-the-badge)
## 🚀 Features
- **Voice-Enabled Simulation**: Realistic voice conversation with an AI student using Web Speech API.
- **Savage AI Evaluator**: A ruthless auditing system that detects "jargon," generic scripts, and irrelevant math explanations.
- **Real-time Confusion Detection**: The AI student (Rohan) proactively flags tutor errors and nonsense during the session.
- **Dynamic Scoring Dashboard**: High-contrast evaluation across 5 dimensions: Clarity, Empathy, Simplify, English, and Patience.
- **Interactive Whiteboard**: Direct drawing integration for explaining conceptual math.
- **PDF Report Generation**: Instant professional report download for recruitment teams.
## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **AI Engine**: Groq SDK (Llama-3-70B) for sub-second latency.
- **Animations**: Framer Motion for a premium, high-end UI experience.
- **Styling**: Tailwind CSS with custom glassmorphism and neural-core UI patterns.
## 📦 Setup & Installation
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/sonikadeshwal/cuemath-pro-screener
   cd cuemath-pro-screener
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. **Run the Project**:
   ```bash
   npm run dev
   ```
## 📊 Scoring System
The system utilizes a **Savage Evaluation Formula**:
- **Gateway Rule**: If the tutor doesn't teach math (e.g., says "I like you"), they receive an automatic **0**.
- **Independent Grading**: No "averaging." You can be top-tier in English but fail in Math.
- **Simplified Score**: `(Sum of Dimensions) * 2`.
---
*Created for the Cuemath Engineering Build Challenge.*
