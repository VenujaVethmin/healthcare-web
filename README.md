# 🏥 Health-i — Smart Healthcare Management System

![Health-i Banner](https://via.placeholder.com/1200x400?text=Health-i+Smart+Healthcare+System)

Welcome to **Health-i**, an intelligent and secure healthcare platform that helps patients and doctors manage appointments, reminders, and health records in real-time.

🌐 **Live Demo:** [https://health-i.live](https://health-i.live)

---

## ✨ Features

- 🔐 Authentication via **Email/Password** & **Google OAuth**
- 📅 Smart appointment scheduling with **email reminders**
- 🔄 Real-time backend with **JWT-based authentication**
- 📬 **Email notifications** 20 minutes before appointments
- 🛠️ Built with **Express.js**, **Prisma**, **Passport.js**, and **Nodemailer**

---

## 🚀 Tech Stack

| Tech           | Description                             |
|----------------|-----------------------------------------|
| **Node.js**    | Backend runtime                         |
| **Express.js** | Web framework                           |
| **Prisma**     | ORM for database                        |
| **Passport.js**| Authentication (local & Google)         |
| **JWT**        | Secure token-based auth                 |
| **Nodemailer** | For sending appointment emails          |
| **Cron Jobs**  | Schedule reminders                      |

---

## 🖼️ Screenshots

> Add your own screenshots here

---

## ⚡ Preview Animation

<div style="text-align:center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTRycjFqemN1ZnplZ2p1aXpwN2x5aDg3YTRzeXk5eWcwM2s1aWIybCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pKcTlS9As2ZzG/giphy.gif" alt="Health-i Animation" width="500" />
</div>

---

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/health-i.git

# Install dependencies
cd health-i
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm run dev
