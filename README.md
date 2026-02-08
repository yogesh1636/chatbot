# 🤖 Chatbot Project (Supabase Backend)

A simple web-based chatbot built with HTML, JavaScript, and Supabase backend.

## 📁 Project Structure
```
chatbot/
├── frontend/
│   ├── index.html
│   └── script.js
├── SUPABASE_SETUP.md
└── README.md
```

## 🚀 Setup Instructions

### 1. Supabase Setup
Follow the detailed instructions in `SUPABASE_SETUP.md`

### 2. Configure API Keys
Update `frontend/script.js` with your Supabase credentials:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. Open Frontend
Open `frontend/index.html` in your browser

## 💬 Usage
1. Sign up or login with username/password
2. Type a message in the input field
3. Click "Send" or press Enter
4. Receive instant chatbot response
5. Chat history is automatically saved

## 🧠 Chatbot Features
- Greetings (hello, hi)
- Farewells (bye, exit)
- Time and date queries
- Math calculations (2+2, 5*3)
- Jokes and humor
- General conversation

## 🔧 Technologies
- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Database**: Supabase Database

## 🎯 Features
- ✅ User authentication (signup/login)
- ✅ Chat history storage
- ✅ Real-time messaging
- ✅ Rule-based responses
- ✅ Math calculations
- ✅ Time/date queries
- ✅ Responsive design

## 🔮 Future Enhancements
- AI API integration (OpenAI/Gemini)
- Real-time chat with WebSockets
- Voice interaction
- File sharing
- Group chats
