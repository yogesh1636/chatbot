🤖 AI Chatbot Project

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://yourusername.github.io/chatbot/index.html)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://github.com/yogesh1636/chatbot)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green)](https://supabase.com)

A feature-rich AI chatbot with authentication, chat history management, 900+ trivia games, and interactive animations built with HTML, JavaScript, and Supabase backend.

🚀 Quick Start

Option 1: GitHub Pages (Recommended)
1. [Open Live Demo](https://yogesh1636.github.io/chatbot/index.html) - Click to use immediately
2. Sign up with username, email, password (age 18+)
3. Explore welcome dashboard and start chatting

 Option 2: Local Setup
```bash
git clone https://github.com/yourusername/chatbot.git
cd chatbot
# Open frontend/index.html in your browser
```

  Supabase Configuration
Update credentials in `script.js`:
```javascript
const SUPABASE_URL = 'https://nvdznelwrkvmbudscqcy.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

Run SQL setup from `DATABASE_SETUP.md` to create required tables.

→ 📁 Project Structure
```
chatbot/
├── frontend/
│   └── index.html           # Main UI (login, dashboard, chat)
├── script.js                # Core logic & Supabase integration
├── games-database.js        # 900+ trivia questions database
├── images/
│   ├── logo.jpg            # Chatbot logo
│   └── bg.png              # Background image
├── DATABASE_SETUP.md        # SQL schema & setup
├── SUPABASE_SETUP.md        # Backend configuration
└── README.md
```

→ 🌐 GitHub Pages Deployment

  Deploy Your Own Version:
1. **Fork this repository**
2. Go to **Settings** > **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** > **/ (root)**
5. Click **Save**
6. Access at: `https://yourusername.github.io/chatbot/frontend/`

* Important Notes:
- Main entry point: `frontend/index.html`
- Update Supabase credentials before deployment
- Ensure `images/` folder is committed
- Database setup required for full functionality

→ 🎯 Features

* Authentication & Security
- ✅ User signup with username, email, password
- ✅ Age verification (18+ required)
- ✅ Gender selection & terms acceptance
- ✅ Secure password hashing via Supabase
- ✅ Session management

* Chat Interface
- ✅ Welcome dashboard with 3-panel layout
- ✅ Real-time messaging with typing indicators
- ✅ Chat history sidebar (last 20 conversations)
- ✅ Archive & delete chat options
- ✅ Toast notifications
- ✅ Responsive design with glass-morphism effects

* Interactive Content
- ✅ **900+ Trivia Games** across 9 categories:
  - Geography (100), Science (100), History (100)
  - Math (200), Animals (100), Technology (100)
  - Sports (100), Movies (100), Food (100)
- ✅ **20 Jokes** with no-repeat system
- ✅ **25 Facts** with smart rotation
- ✅ **15 Quotes** from famous personalities
- ✅ **10 Riddles** with hints
- ✅ **7 Stories** for entertainment

* Smart Features
- ✅ Math calculations (e.g., "2+2", "5*3")
- ✅ Time & date queries
- ✅ Context-aware responses
- ✅ No-repeat content tracking
- ✅ Game answer validation with feedback
- ✅ Confetti animations on correct answers

* Visual Effects
- ✅ Confetti celebrations
- ✅ Shake, tada, neon-glow animations
- ✅ Custom gradient scrollbars
- ✅ Floating particles background
- ✅ Smooth transitions & hover effects
- ✅ Theme toggle support

→ 🧠 Chatbot Capabilities

* Conversation
- Greetings: "hello", "hi", "hey"
- Farewells: "bye", "goodbye", "exit"
- Identity: "who are you", "your name"
- Help: "help", "what can you do"

* Entertainment
- Jokes: "tell me a joke", "make me laugh"
- Facts: "tell me a fact", "interesting fact"
- Quotes: "inspire me", "quote"
- Stories: "tell me a story"
- Games: "play a game", "trivia"
- Riddles: "riddle me", "puzzle"

* Utilities
- Time: "what time is it", "current time"
- Date: "what's the date", "today's date"
- Math: "calculate 15*8", "what is 100/5"

→ 🔧 Technologies

* Frontend
- **HTML5** - Semantic structure
- **Tailwind CSS** - Utility-first styling
- **JavaScript (ES6+)** - Core functionality
- **Google Fonts (Poppins)** - Typography

* Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - User authentication
- **Supabase Realtime** - Live data sync

* Database Schema
```sql
-- users table
username (TEXT, PRIMARY KEY)
email (TEXT, UNIQUE)
password (TEXT)
age (INTEGER, CHECK >= 18)
gender (TEXT)
created_at (TIMESTAMP)

-- chat_history table
id (SERIAL, PRIMARY KEY)
username (TEXT, FOREIGN KEY)
user_message (TEXT)
bot_reply (TEXT)
archived (BOOLEAN)
created_at (TIMESTAMP)
```

→ 📱 Usage Guide

1. **Sign Up**: Create account with username, email, password (18+)
2. **Welcome Dashboard**: View bot info, user manual, creator details
3. **Start Chat**: Click "Start Chat" button
4. **Quick Actions**: Use buttons for jokes, facts, games, etc.
5. **Chat History**: View, archive, or delete past conversations
6. **Play Games**: Answer trivia questions, get confetti on correct answers
7. **Get Help**: Type "help" to see all commands

→ 🔮 Future Enhancements

- [ ] AI API integration (OpenAI GPT-4, Google Gemini)
- [ ] Voice input/output with Web Speech API
- [ ] Multi-language support
- [ ] User profile customization
- [ ] Export chat history (PDF/TXT)
- [ ] Dark/Light theme persistence
- [ ] Real-time multiplayer games
- [ ] Leaderboard system
- [ ] File/image sharing
- [ ] Group chat functionality

→ 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

→ 📄 License

This project is open source and available under the MIT License.

→ 👨‍💻 Author

Created with ❤️ by [Yogesh1636]

---

**⭐ Star this repo if you find it helpful!**
