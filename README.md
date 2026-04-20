<div align="center">

# 🎯 Cuemath AI Screener

### An AI-powered candidate screening platform built for the Cuemath AI Builder Challenge

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Vercel-black?style=for-the-badge)](https://cuemath-pro-screene34567.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq%20LLaMA%203.3-F55036?style=for-the-badge)](https://groq.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## 📌 What is this?

**Cuemath AI Screener** is a fully functional, AI-powered screening platform that automates the initial interview round for Cuemath Pro tutor candidates. Instead of scheduling calls or manually reviewing applications, the platform conducts a structured, conversational AI screening — evaluating candidates on teaching aptitude, subject knowledge, and communication — and generates a downloadable PDF report with scores and recommendations.

Built end-to-end in under 48 hours as part of the **Cuemath AI Builder Build Challenge**.

---

## ✨ Features

- 🤖 **AI-Driven Screening** — LLaMA 3.3 70B (via Groq API) conducts a dynamic, multi-turn screening conversation tailored to Cuemath's hiring criteria
- 📊 **Automated Scoring** — Candidates are evaluated across key dimensions: subject expertise, teaching clarity, problem-solving approach, and communication
- 📄 **PDF Report Export** — One-click export of a structured screening report using jsPDF + AutoTable — ready to share with hiring teams
- ✨ **Polished Animations** — Smooth, professional UI transitions powered by Framer Motion for a premium candidate experience
- ⚡ **Blazing Fast Inference** — Groq's LPU hardware delivers near-instant AI responses, keeping the screening flow frictionless
- 📱 **Fully Responsive** — Mobile-first design with Tailwind CSS — works seamlessly on any device

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **AI / LLM** | Groq API — LLaMA 3.3 70B |
| **PDF Export** | jsPDF + jspdf-autotable |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Live Demo

👉 **[cuemath-pro-screene34567.vercel.app](https://cuemath-pro-screene34567.vercel.app/)**

---

## 🏃 Run Locally

```bash
# Clone the repository
git clone https://github.com/sonikadeshwal/cuemath-pro-screener.git
cd cuemath-pro-screener

# Install dependencies
npm install

# Add your environment variable
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Get a free Groq API key at** [console.groq.com](https://console.groq.com)

---

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 📁 Project Structure

```
cuemath-pro-screener/
├── app/
│   ├── api/           # Next.js API routes (Groq integration)
│   ├── components/    # Reusable UI components
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main screener page
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 💡 How It Works

```
Candidate lands on platform
        ↓
Enters name, role, subject preferences
        ↓
AI screening session begins (Groq / LLaMA 3.3 70B)
        ↓
Multi-turn conversation evaluates:
  → Subject knowledge
  → Teaching methodology
  → Communication clarity
  → Problem-solving approach
        ↓
AI generates structured score + summary
        ↓
Candidate / recruiter exports PDF report
```

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 👩‍💻 Built By

**Sonika Deshwal**
B.Tech CSE (AI & ML) · Lovely Professional University · Batch 2023–27

[![Portfolio](https://img.shields.io/badge/Portfolio-sonikadeshwal.netlify.app-blueviolet?style=flat-square)](https://sonikadeshwal.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-sonikadeshwal-181717?style=flat-square&logo=github)](https://github.com/sonikadeshwal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/sonikadeshwal)

---

<div align="center">
  <sub>Built with ❤️ for the Cuemath AI Builder Challenge · Deployed on Vercel</sub>
</div>
