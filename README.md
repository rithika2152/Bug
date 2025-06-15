# 🐞 FealtyX Bug & Task Tracker

A role-based bug and task tracking application built using **Next.js**, designed for developers and managers to manage project workflows efficiently. This application allows Developers to log, update, and track bugs and tasks, while Managers can review progress, approve closures, and monitor team productivity.

---

## 🚀 Features

- 🔐 **Authentication**  
  Role-based login using mock credentials (Developer or Manager)

- 📋 **Dashboard**  
  Personalized dashboards based on role:
  - Developers see their tasks and time logs
  - Managers see all bugs with filter/sort and approval functionality

- 🐛 **Bug/Task Management**  
  - Create, edit, delete, and close tasks
  - Manager approval system for task closures

- ⏱ **Time Tracking**  
  - Developers can log time spent on each task
  - Managers can view time logs per developer

- 📈 **Trend Chart**  
  Visualize number of tasks worked per day using a line graph

- 💻 **Tech Stack**
  - Next.js (React Framework)
  - Zustand (State Management)
  - Tailwind CSS (Styling)
  - Recharts (Charts & Graphs)

---

## 📁 Folder Structure

/bug-tracker
├── components/
├── context/
├── data/
├── pages/
├── public/
├── styles/
└── utils/

---
##📦 Deployment
The app is ready to be deployed on platforms like Vercel or Netlify.

📹 Demo
🔗 Live Demo: https://bug-tracker-rithika.netlify.app/

🎥 Video Walkthrough:https://drive.google.com/file/d/1FE0nqbH1ruOERM3UH3sMWCcDtCz3xJFO/view?usp=drive_link

👩‍💻 Author
Developed by G L Rithika

## 🧪 Mock Credentials

```json
[
  {
    "username": "dev1",
    "password": "dev123",
    "role": "developer"
  },
  {
    "username": "manager1",
    "password": "mgr123",
    "role": "manager"
  }
]

---




