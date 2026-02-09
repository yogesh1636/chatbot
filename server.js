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
    return 'Goodbye! 👋 It was wonderful chatting with you! Come back anytime for more fun conversations! ✨😊';
  } else if (/\b(how are you|how r u|hows it going|whats up|wassup)\b/.test(userMessage)) {
    const responses = [
      'I\'m doing fantastic! 😊 Thanks for asking! How are you doing today? ✨',
      'Excellent! I\'m always excited to chat. How can I help you today? 🚀',
      'Feeling great! There\'s nothing like a good conversation! What\'s on your mind? 💭'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } else if (/\b(thank|thanks|thx|appreciate|grateful)\b/.test(userMessage)) {
    const responses = [
      'You\'re absolutely welcome! 😊 Happy to help! What else can I do for you? ✨',
      'That\'s so kind of you to say! I\'m here to help anytime! 💫',
      'My pleasure! Is there anything else you\'d like to know or do? 🎯'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } else if (/\b(time|clock|hour)\b/.test(userMessage)) {
    return `⏰ Current time is ${new Date().toLocaleTimeString()} 🕐`;
  } else if (/\b(date|day|today|calendar)\b/.test(userMessage)) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return `📅 Today is ${today.toLocaleDateString('en-US', options)} ✨`;
  } else if (/\b(joke|funny|laugh|humor)\b/.test(userMessage)) {
    const jokes = [
      '😄 Why don\'t scientists trust atoms? Because they make up everything!',
      '🌾 Why did the scarecrow win an award? He was outstanding in his field!',
      '🐻 What do you call a bear with no teeth? A gummy bear!',
      '🥚 Why don\'t eggs tell jokes? They\'d crack each other up!',
      '🍝 What do you call a fake noodle? An impasta!',
      '💻 Why do programmers prefer dark mode? Because light attracts bugs!'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else if (/\b(fact|facts|interesting|did you know|amazing)\b/.test(userMessage)) {
    const facts = [
      '🐙 Octopuses have three hearts and blue blood!',
      '🍯 Honey never spoils! 3000-year-old honey is still edible!',
      '🦩 A group of flamingos is called a "flamboyance"!',
      '🍌 Bananas are berries, but strawberries aren\'t!',
      '🧠 Your brain uses 20% of your body\'s energy!'
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  } else if (/\b(quote|inspiration|motivate|inspire|wisdom)\b/.test(userMessage)) {
    const quotes = [
      '✨ "The only way to do great work is to love what you do." - Steve Jobs',
      '🚀 "Innovation distinguishes between a leader and a follower." - Steve Jobs',
      '🌟 "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
      '💪 "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill'
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else if (/\b(help|commands|what can you do|features)\b/.test(userMessage)) {
    return `🤖 I'm your AI assistant! Here's what I can do:\n\n✨ 📝 Create content (stories, poems, jokes)\n🎮 🎲 Interactive games and riddles\n🧮 📊 Math calculations and trivia\n⏰ 📅 Time and date information\n💡 📚 Inspiration, facts, and guidance\n\nTry asking me anything or use the quick action buttons! 🚀`;
  } else if (/\d+\s*[+\-*/%^]\s*\d+/.test(userMessage)) {
    const match = userMessage.match(/(\d+(?:\.\d+)?)\s*([+\-*/%^])\s*(\d+(?:\.\d+)?)/);
    if (match) {
      const num1 = parseFloat(match[1]);
      const operator = match[2];
      const num2 = parseFloat(match[3]);
      let result;
      switch(operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 !== 0 ? (num1 / num2).toFixed(2) : 'Cannot divide by zero'; break;
        case '%': result = num1 % num2; break;
        case '^': result = Math.pow(num1, num2); break;
      }
      return `🔢 ${num1} ${operator} ${num2} = ${result}\n\nNeed more calculations? I can handle +, -, *, /, %, and ^ operations! 🧠`;
    }
  }
  return null;
}

function generateSmartResponse(message, context) {
  const msg = message.toLowerCase();
  
  // More creative and engaging responses
  if (msg.includes('hello') || msg.includes('hi')) {
    const greetings = [
      '👋 Hey there! Great to see you! What can I help with today? ✨',
      '🎉 Hello! Welcome back! So excited to chat with you! 🚀',
      '😊 Hi! I\'m all ears! What\'s on your mind today? 💭'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('tell me about')) {
    return `📖 I'd be happy to explain! Based on your question about "${message}", I can help break it down. Could you be more specific so I can give you the best answer? 🧠`;
  } else if (msg.includes('how to') || msg.includes('how do')) {
    return `🎯 Great question! To help with "${message}", let's think step by step. Could you tell me exactly what you're trying to accomplish? I'm here to guide you! 💪`;
  } else if (msg.includes('why') || msg.includes('reason')) {
    return `🤔 That's a brilliant question! The reason for "${message}" can vary. Tell me more about what you're curious about, and I'll do my best to explain! 💡`;
  } else if (msg.includes('best') || msg.includes('recommend')) {
    return `⭐ I'd love to help! For "${message}", it really depends on what YOU'RE looking for. What matters most to you? Let's find the perfect fit! 🎯`;
  } else if (msg.includes('sorry') || msg.includes('apologize')) {
    return `🌟 No worries at all! Everyone makes mistakes - that's how we learn! Don't be hard on yourself. How can I help you now? 😊`;
  } else if (msg.includes('amazing') || msg.includes('cool') || msg.includes('awesome')) {
    return `🎉 I'm so glad you think so! Your enthusiasm is contagious! What else would you like to explore? 🚀`;
  } else if (msg.length < 3) {
    return `🤔 I see! Could you tell me a bit more? I'm here to help! 😊`;
  } else {
    const fallbacks = [
      `🌟 That's interesting! While I might not know everything about "${message}", I'd love to help however I can. Tell me more! 💭`,
      `💬 I understand you're asking about "${message}". Let's explore this together! What specifically would you like to know? 🎯`,
      `🔍 Hmm, I'm intrigued by your question! I can help with many things like jokes, facts, games, and calculations. Which sounds fun? 🚀`,
      `✨ You've picked an interesting topic! I'm here to help with stories, games, facts, and so much more. What would you like to do? 🎮`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
