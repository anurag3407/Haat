# 🚀 Single Command Development Setup

## ✅ What's Changed

The Haat development environment now starts with a **single command**!

### 🔧 New Development Command
```bash
npm run dev
```

This single command now:
- ✅ Starts the **frontend** (React + Vite) on `http://localhost:5173`
- ✅ Starts the **backend** (Node.js + Express) on `http://localhost:5000`
- ✅ Uses **concurrently** to run both servers simultaneously
- ✅ Color-coded terminal output (backend=yellow, frontend=blue)
- ✅ Auto-restarts both servers on file changes (nodemon for backend, Vite HMR for frontend)
- ✅ Kills all processes if one fails (`--kill-others-on-fail`)

### 📁 Updated Scripts in package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --names \"backend,frontend\" --prefix-colors \"yellow,blue\" --kill-others-on-fail",
    "dev:frontend": "vite",
    "dev:backend": "cd backend && npm run dev",
    "dev:both": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --names \"backend,frontend\" --prefix-colors \"yellow,blue\""
  }
}
```

### 🎯 Benefits
1. **One Command**: No need to open multiple terminals
2. **Color Coding**: Easy to distinguish frontend vs backend logs
3. **Auto Restart**: Both servers restart automatically on code changes
4. **Error Handling**: If one server crashes, both are restarted
5. **Clean Output**: Prefixed logs with server names

### 💻 Development Workflow
```bash
# Clone the repository
git clone https://github.com/anurag3407/Haat.git
cd Haat

# Install dependencies (installs both frontend and backend)
npm install

# Start development (both servers with one command)
npm run dev

# Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

### 🔄 Alternative Commands (if needed)
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend  
- `npm run dev:both` - Same as `npm run dev` (legacy)

## 🌟 Developer Experience Improvements

### Terminal Output Example
```
[backend] 🚀 Server running on port 5000
[backend] 🌐 Environment: development
[backend] ✅ Connected to MongoDB Atlas
[frontend] 
[frontend]   VITE v7.0.6  ready in 613 ms
[frontend]   ➜  Local:   http://localhost:5173/
[frontend]   ➜  Network: http://170.2.3.159:5173/
```

### Auto-Restart on Changes
- **Frontend**: Vite's HMR provides instant updates
- **Backend**: Nodemon restarts server on file changes
- **Database**: Automatic reconnection on connection loss

The development setup is now **production-ready** and **developer-friendly**! 🎉
