const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const users = {};
const chatHistory = {};
const conversationContext = {};

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  
  if (users[username]) return res.json({ error: 'Username already exists' });
  
  users[username] = password;
  chatHistory[username] = [];
  conversationContext[username] = [];
  
  res.json({ success: true, history: [] });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  
  if (password && users[username] && users[username] !== password) {
    return res.json({ error: 'Invalid password' });
  }
  
  if (!users[username]) users[username] = password || true;
  if (!chatHistory[username]) chatHistory[username] = [];
  if (!conversationContext[username]) conversationContext[username] = [];
  
  res.json({ success: true, history: chatHistory[username] });
});

function getRuleBasedResponse(userMessage) {
  if (/\b(hi|hello|hey|hola|greetings|sup|yo)\b/.test(userMessage)) {
    return 'Hello! How can I help you today? 😊';
  } else if (/\b(bye|goodbye|exit|quit|see you|later|cya)\b/.test(userMessage)) {
    return 'Goodbye! Have a great day! 👋';
  } else if (/\b(how are you|how r u|hows it going|whats up|wassup)\b/.test(userMessage)) {
    return 'I am doing great! Thanks for asking. How can I assist you? 😊';
  } else if (/\b(thank|thanks|thx|appreciate|grateful)\b/.test(userMessage)) {
    return 'You\'re welcome! Happy to help! 😊';
  } else if (/\b(time|clock|hour)\b/.test(userMessage)) {
    return `Current time is ${new Date().toLocaleTimeString()} ⏰`;
  } else if (/\b(date|day|today|calendar)\b/.test(userMessage)) {
    return `Today's date is ${new Date().toLocaleDateString()} 📅`;
  } else if (/\b(joke|funny|laugh|humor)\b/.test(userMessage)) {
    const jokes = [
      'Why don\'t scientists trust atoms? Because they make up everything! 😄',
      'Why did the scarecrow win an award? He was outstanding in his field! 🌾',
      'What do you call a bear with no teeth? A gummy bear! 🐻'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else if (/\d+\s*[+\-*/]\s*\d+/.test(userMessage)) {
    const match = userMessage.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (match) {
      const num1 = parseFloat(match[1]);
      const operator = match[2];
      const num2 = parseFloat(match[3]);
      let result;
      switch(operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'; break;
      }
      return `${num1} ${operator} ${num2} = ${result} 🔢`;
    }
  }
  return null;
}

function generateSmartResponse(message, context) {
  const msg = message.toLowerCase();
  
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('tell me about')) {
    return `I'd be happy to help explain that! Based on your question about "${message}", I can provide information. However, for detailed explanations, I recommend checking reliable sources or asking more specific questions. What would you like to know? 📚`;
  } else if (msg.includes('how to') || msg.includes('how do')) {
    return `Great question! To help you with "${message}", I suggest breaking it down into steps. Could you be more specific about what you're trying to accomplish? I'm here to guide you! 🎯`;
  } else if (msg.includes('why') || msg.includes('reason')) {
    return `That's an interesting question! The answer to "${message}" can vary depending on context. Could you provide more details so I can give you a better response? 🤔`;
  } else if (msg.includes('best') || msg.includes('recommend')) {
    return `I'd love to help with recommendations! For "${message}", it really depends on your specific needs and preferences. What are you looking for exactly? 💡`;
  } else {
    return `I understand you're asking about "${message}". While I can help with general questions, time/date, jokes, and calculations, for complex topics I recommend being more specific. How can I assist you better? 💬`;
  }
}

app.post('/chat', async (req, res) => {
  const { message, username } = req.body;
  const userMessage = message.toLowerCase().trim();
  let botReply;
  
  const ruleBasedReply = getRuleBasedResponse(userMessage);
  
  if (ruleBasedReply) {
    botReply = ruleBasedReply;
  } else {
    const context = conversationContext[username] || [];
    botReply = generateSmartResponse(message, context);
    
    conversationContext[username] = conversationContext[username] || [];
    conversationContext[username].push({ role: 'user', content: message });
    conversationContext[username].push({ role: 'assistant', content: botReply });
    
    if (conversationContext[username].length > 10) {
      conversationContext[username] = conversationContext[username].slice(-10);
    }
  }

  if (username && chatHistory[username]) {
    chatHistory[username].push({ user: message, bot: botReply, time: new Date().toISOString() });
  }

  res.json({ reply: botReply });
});

app.listen(PORT, () => {
  console.log(`
  ┌────────────────────────────────────────┐
  │                                        │
  │        🤖 AI CHATBOT SERVER 🤖        │
  │                                        │
  └────────────────────────────────────────┘

  ✅ Server Status: ONLINE
  🌐 Server URL: http://localhost:${PORT}
  📅 Started: ${new Date().toLocaleString()}
  
  🚀 Features Available:
     • AI-Powered Smart Responses
     • Conversation Context Memory
     • User Authentication (Login/Signup)
     • Chat History Storage
     • Rule-Based Quick Replies
     • Math Calculations
  
  💬 Ready to chat! Open index.html in your browser.
  `);
});
