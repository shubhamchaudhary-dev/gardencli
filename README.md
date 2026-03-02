# 📚 Offline Learn CLI

### *An offline-first terminal learning platform built for low-connectivity environments*

**Offline Learn CLI** is a powerful, interactive, terminal-based learning platform designed for students with unreliable internet access.

It transforms your terminal into a complete offline education system — supporting quizzes, dashboards, PDF exports, peer-to-peer sharing, and optional leaderboard sync.

Built for resilience.  
Built for accessibility.  
Built for the real world.

---

## 🌐 Repository

👉 **GitHub:**  
https://github.com/shubhamchaudhary-dev/offline-learn

---

## 🎥 Demo Video

## Video
[![Watch the Demo](https://img.youtube.com/vi/GVgb1UgsC_E/hqdefault.jpg)](https://www.youtube.com/watch?v=GVgb1UgsC_E)

---

## 📸 Preview

<img width="1919" height="1079" alt="Terminal Dashboard" src="https://github.com/user-attachments/assets/ef4dfb82-dd23-4552-8013-8b9b95c15238" />

<img width="1919" height="1079" alt="Progress Dashboard" src="https://github.com/user-attachments/assets/af924237-90f8-430d-b171-be0c637c8508" />

<img width="1919" height="1025" alt="PDF Export" src="https://github.com/user-attachments/assets/2173bf0e-97a4-4a7c-b25e-3c65327818b3" />

<img width="1919" height="1079" alt="QR Sharing" src="https://github.com/user-attachments/assets/ff4955cd-e331-4569-a213-2c3aa58a48a9" />

---

## 🌍 Why This Project Exists

Millions of students globally face:

- Limited internet connectivity  
- Expensive mobile data  
- Cloud-dependent learning systems  
- Interrupted educational access  

Most platforms assume constant internet.

**Offline Learn does not.**

It ensures:

- 📚 Learning continues offline  
- ⚡ Instant local performance  
- 🎯 Interactive quizzes  
- 🏆 Motivation via gamification  
- 📡 LAN-based peer sharing  
- 🌍 Optional global leaderboard sync  

---

## 🎯 Core Capabilities

Offline Learn turns your terminal into a full learning ecosystem.

---

## 📚 Multi-Course Learning System

Built-in courses include:

- Mathematics  
- Physics  
- Biology  
- Computer Science  
- English Grammar  

Each course provides:

- Structured topics  
- Curated quiz sets  
- Persistent score tracking  
- Fully offline availability  

---

## 📝 Interactive Quiz Engine

A responsive CLI quiz system featuring:

- Instant answer validation  
- Score calculation  
- Persistent storage using LowDB  
- Clean terminal interaction  
- Retry & improvement flow  

Designed for fast, distraction-free practice.

---

## 📊 Progress Dashboard

Built with Blessed + Blessed-Contrib:

- Performance graphs  
- Historical score tracking  
- Learning consistency metrics  
- Badge visualization  
- Real-time terminal dashboard UI  

All stored locally in lightweight JSON.

---

## 🏅 Gamification System

Students unlock badges like:

- 🏆 Perfectionist Badge  
- 🎓 Scholar Badge  
- 🔁 Consistent Learner Badge  

Gamification increases engagement and motivation — even offline.

---

## 📄 PDF Export Engine

Generate professionally formatted PDFs:

- Structured course material  
- Clean formatting  
- Print-ready design  
- Saved inside `/exports`  

Built using PDFKit.

---

## 🌍 Global Leaderboard (Optional Online Mode)

When internet becomes available:

- Sync scores  
- Compare performance globally  
- Lightweight Express backend  
- No heavy cloud dependency  

Offline-first. Online-optional.

---

## 📡 Peer-to-Peer LAN Sharing

Share courses across local network:

- QR code generation  
- Socket.io transfer  
- No internet required  
- Instant device-to-device sharing  

Perfect for classrooms and low-bandwidth environments.

---

## ⚙️ Tech Stack

- Node.js  
- Commander.js — CLI routing  
- Blessed + Blessed-Contrib — dashboard UI  
- LowDB — local database  
- Fuse.js — search  
- PDFKit — PDF generation  
- Express — leaderboard API  
- Socket.io — LAN sharing  

---

## 🏗 Architecture Philosophy

- Offline-first design  
- Modular CLI structure  
- Lightweight JSON storage  
- Zero paid API dependency  
- Minimal latency  
- Fully portable  

---

## 🚀 How to Run

### 1️⃣ Install dependencies

```sh
npm install
