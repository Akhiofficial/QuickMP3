# 🎵 QuickMP3 - Ultimate YouTube to MP3 Converter

QuickMP3 is a premium, high-performance full-stack web application designed for seamless YouTube video metadata extraction and high-quality MP3 conversion. Built with modern web technologies, it offers a sleek user experience and robust processing capabilities.

---

## ✨ Features

- **🚀 Instant Extraction:** Rapidly fetch metadata (title, thumbnail, duration) from any YouTube URL.
- **🎵 High-Quality Conversion:** Optimized MP3 conversion using `yt-dlp` and `ffmpeg`.
- **💎 Premium UI:** A modern, aesthetic interface with smooth animations powered by Framer Motion.
- **🛡️ Robust Backend:** Express.js server with rate limiting, error handling, and MongoDB integration.
- **🐳 Docker Ready:** Containerized backend for consistent deployment across environments.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Language:** TypeScript

### Backend
- **Server:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Processing:** [yt-dlp](https://github.com/yt-dlp/yt-dlp) & [FFmpeg](https://ffmpeg.org/)
- **Authentication:** JWT & Cookie-based auth

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [FFmpeg](https://ffmpeg.org/download.html)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)

### 📥 Installation & Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd YtMP3
```

#### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```
Start the backend:
```bash
npm run dev
```

#### 3. Frontend Configuration
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 🏗️ Project Structure

```text
YtMP3/
├── frontend/           # Next.js frontend application
│   ├── src/app/        # App router and pages
│   └── src/components/ # Reusable UI components
├── backend/            # Express.js backend API
│   ├── src/modules/    # Feature-based business logic
│   ├── src/services/   # yt-dlp and FFmpeg wrappers
│   └── src/core/       # DB connection and middleware
└── README.md           # Root documentation
```

---

## 🎓 Credits

Developed with ❤️ as part of the FullStack Project cohort at **Sheryians Coding School**.

---

## 📄 License
This project is licensed under the ISC License.
