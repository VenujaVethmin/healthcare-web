# 🏥 Health-i — Smart Healthcare Management System



> **Health-i** is a comprehensive healthcare platform that seamlessly connects patients and healthcare providers, streamlining appointment management, medical records, and communication in one secure ecosystem.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/your-username/health-i)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/health-i/pulls)

🌐 **Live Demo:** [https://health-i.live](https://health-i.live)

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Installation & Setup](#-installation--setup)
- [🔧 Configuration](#-configuration)
- [📊 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [💬 Support](#-support)

---

## ✨ Key Features

### For Patients
- 🔐 **Secure Authentication** via Email/Password & Google OAuth
- 📅 **Smart Appointment Scheduling** with intuitive calendar interface
- 📱 **Mobile-Responsive Dashboard** for on-the-go management
- 🔔 **Customizable Reminders** (email, SMS, push notifications)
- 📝 **Digital Health Records** storage and access
- 💬 **Secure Messaging** with healthcare providers

### For Healthcare Providers
- 📊 **Patient Management Dashboard** with comprehensive views
- 🗓️ **Advanced Calendar Management** with conflict resolution
- 📈 **Analytics Dashboard** for appointment trends and patient metrics
- 📋 **Digital Prescription Management** with dosage tracking
- 🔍 **Patient History Viewer** for comprehensive care

---

## 🚀 Tech Stack

### Backend
| Technology     | Purpose                                |
|----------------|----------------------------------------|
| **Node.js**    | Server runtime environment             |
| **Express.js** | Web application framework              |
| **Prisma**     | Next-generation ORM                    |
| **PostgreSQL** | Robust relational database             |
| **JWT**        | Secure authentication tokens           |
| **Passport.js**| Authentication middleware (local & OAuth) |
| **Socket.io**  | Real-time updates and notifications    |

### APIs & Services
| Service        | Purpose                                |
|----------------|----------------------------------------|
| **Nodemailer** | Email delivery for notifications       |
| **Twilio**     | SMS reminders and alerts               |
| **Google Calendar API** | Calendar integration          |
| **Cron Jobs**  | Scheduled tasks and reminders          |

### Security
- 🔒 **HIPAA Compliant** data storage and transmission
- 🛡️ **End-to-end encryption** for sensitive communications
- 🔐 **Rate limiting** and brute force protection
- 📜 **Comprehensive audit logs** for system activities

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/health-i.git

# Navigate to project directory

cd backend

////////

cd frontend

# Install dependencies 
npm install

# Set up environment variables
cp .env.example .env

# Initialize the database
npx prisma genarete

npx prisma db push

# Start the development server
npm start
```

The server will be running at `http://localhost:3000`

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/health_i"

# Authentication
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

# Email (Nodemailer)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="no-reply@health-i.live"
EMAIL_PASSWORD="your-email-password"



---



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For support and questions, please open an issue or contact us at support@health-i.live
