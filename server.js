const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ===============================
   In-memory storage (demo)
================================ */
const users = {};                 // { username: password }
const chatHistory = {};           // { username: [ {user, bot, time} ] }
const conversationContext = {};   // { username: [ {role, content} ] }

/* ===============================
   AUTH ROUTES
================================ */

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (users[username]) {
    return res.json({ error: "Username already exists" });
  }

  users[username] = password;
  chatHistory[username] = [];
  conversationContext[username] = [];

  res.json({ success: true });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (!users[username]) {
    return res.json({ error: "User not found. Please signup." });
  }

  if (users[username] !== password) {
    return res.json({ error: "Invalid password" });
  }

  res.json({
    success: true,
    history: chatHistory[username]
  });
});

/* ===============================
   RULE-BASED RESPONSES
================================ */

function getRuleBasedResponse(msg) {
  if (/\b(hi|hello|hey|yo)\b/.test(msg)) {
    return "Hello! 😊 How can I help you today?";
  }

  if (/\b(bye|goodbye|exit)\b/.test(msg)) {
    return "Goodbye! 👋 Have a great day!";
  }

  if (/\b(how are you)\b/.test(msg)) {
    return "I'm doing great 😄 Thanks for asking!";
  }

  if (/\b(thank|thanks)\b/.test(msg)) {
    return "You're welcome! 🙌";
  }

  if (/\b(time)\b/.test(msg)) {
    return `Current time is ${new Date().toLocaleTimeString()} ⏰`;
  }

  if (/\b(date|today)\b/.test(msg)) {
    return `Today's date is ${new Date().toLocaleDateString()} 📅`;
  }

  // Math
  const mathMatch = msg.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
  if (mathMatch) {
    const a = Number(mathMatch[1]);
    const b = Number(mathMatch[3]);
    const op = mathMatch[2];

    let result;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b !== 0 ? a / b : "Infinity"; break;
    }
    return `${a} ${op} ${b} = ${result} 🔢`;
  }

  return null;
}

/* ===============================
   SMART AUTO RESPONSE
================================ */

function generateSmartResponse(message, context) {
  const msg = message.toLowerCase();

  const lastUserMsg = context
    .filter(m => m.role === "user")
    .slice(-1)[0]?.content;

  if (msg.includes("explain") || msg.includes("what is")) {
    return `Sure! Here's a simple explanation: "${message}" is a concept that depends on context. Could you tell me your level (beginner/intermediate)? 📘`;
  }

  if (msg.includes("how")) {
    return `Good question! To help with "${message}", let's go step by step. What part are you stuck on? 🧩`;
  }

  if (msg.includes("why")) {
    return `That's a thoughtful question 🤔 The reason depends on multiple factors. Can you give a bit more detail?`;
  }

  const fallbackReplies = [
    "Interesting 🤔 Can you explain more?",
    "I see! Tell me what you're trying to achieve.",
    "Let’s dig into that a bit more.",
    lastUserMsg
      ? `Earlier you mentioned "${lastUserMsg}". How does this connect?`
      : "I'm listening 👂 Tell me more."
  ];

  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

/* ===============================
   CHAT ROUTE
================================ */

app.post("/chat", (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({
      error: "Username and message are required"
    });
  }

  if (!users[username]) {
    return res.status(401).json({
      error: "User not logged in"
    });
  }

  const userMsg = message.toLowerCase().trim();

  let botReply = getRuleBasedResponse(userMsg);

  if (!botReply) {
    const context = conversationContext[username];
    botReply = generateSmartResponse(message, context);

    // Save context
    context.push({ role: "user", content: message });
    context.push({ role: "assistant", content: botReply });

    // Limit memory
    if (context.length > 12) {
      conversationContext[username] = context.slice(-12);
    }
  }

  // Save chat history
  chatHistory[username].push({
    user: message,
    bot: botReply,
    time: new Date().toISOString()
  });

  res.json({ reply: botReply });
});

/* ===============================
   SERVER START
================================ */

app.listen(PORT, () => {
  console.log(`
========================================
 🤖 CHATGPT-LITE SERVER RUNNING
========================================
 🌐 URL      : http://localhost:${PORT}
 👤 Users    : In-memory (demo)
 🧠 Memory   : Enabled
 💬 Auto AI  : Smart responses
========================================
`);
});
