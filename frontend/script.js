let currentUser = null;
let isSignUpMode = false;
let conversationContext = [];
let isVoiceEnabled = false;
let recognition = null;
let isDarkTheme = false;
let gameState = null;
let userPreferences = {
  theme: 'light',
  notifications: true,
  autoSpeak: false
};

// Initialize particles
function createParticles() {
  const particles = document.getElementById('particles');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particles.appendChild(particle);
  }
}

// Initialize speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  isVoiceEnabled = true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  loadUserPreferences();
});

// Supabase configuration
const SUPABASE_URL = 'https://nvdznelwrkvmbudscqcy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZHpuZWx3cmt2bWJ1ZHNjcWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MjU4NDMsImV4cCI6MjA4NjEwMTg0M30.wSYnP5EFvAmeGXfjgoWmFqyoRXaZgFnaSsqZCdOH4z4';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const usernameInput = document.getElementById('usernameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const authBtn = document.getElementById('authBtn');
const toggleAuth = document.getElementById('toggleAuth');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const emojiBtn = document.getElementById('emojiBtn');
const themeToggle = document.getElementById('themeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const clearBtn = document.getElementById('clearBtn');
const botAvatar = document.getElementById('botAvatar');
const statusText = document.getElementById('statusText');
const typingIndicator = document.getElementById('typingIndicator');
const quickActions = document.querySelectorAll('.quick-action');
const suggestionPills = document.querySelectorAll('.suggestion-pill');

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  if (isSignUpMode) {
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Sign up to start chatting';
    authBtn.textContent = 'Sign Up';
    toggleAuth.textContent = 'Already have an account? Sign In';
    emailInput.classList.remove('hidden');
    passwordInput.classList.remove('hidden');
  } else {
    authTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Sign in to continue chatting';
    authBtn.textContent = 'Sign In';
    toggleAuth.textContent = "Don't have an account? Sign Up";
    emailInput.classList.add('hidden');
    passwordInput.classList.remove('hidden'); // Keep password visible for sign in
  }
}

async function authenticate() {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username) {
    alert('Username is required');
    return;
  }
  
  if (isSignUpMode) {
    if (!email || !password) {
      alert('Email and password are required for signup');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
  } else {
    if (!password) {
      alert('Password is required for signin');
      return;
    }
  }
  
  try {
    if (isSignUpMode) {
      // Sign up - check if username exists
      const { data: existingUser } = await supabaseClient
        .from('users')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        alert('Username already exists');
        return;
      }
      
      // Create new user
      const { error } = await supabaseClient
        .from('users')
        .insert([{ username, email, password }]);
      
      if (error) throw error;
      alert('Account created successfully! Please sign in.');
      toggleAuthMode();
      return;
    }
    
    // Sign in
    const { data: user, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !user) {
      alert('Invalid username or password');
      return;
    }
    
    currentUser = username;
    userDisplay.textContent = username;
    
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    
    // Load chat history
    await loadChatHistory();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function loadChatHistory() {
  try {
    const { data: history } = await supabaseClient
      .from('chat_history')
      .select('*')
      .eq('username', currentUser)
      .order('created_at', { ascending: true });
    
    chatBox.innerHTML = '';
    if (history && history.length > 0) {
      history.forEach(chat => {
        addMessage(chat.user_message, true, false);
        addMessage(chat.bot_reply, false, false);
      });
    } else {
      addMessage('👋 Hello! I\'m your AI assistant. How can I help you today?', false, false);
    }
  } catch (error) {
    addMessage('👋 Hello! I\'m your AI assistant. How can I help you today?', false, false);
  }
}

function getRuleBasedResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  
  // Context-aware responses - check what user is asking for
  if (/\b(another|more|give me|tell me|show me)\b/.test(msg)) {
    if (/\b(joke|funny)\b/.test(msg) || conversationContext.some(ctx => /joke|funny/.test(ctx))) {
      return getJoke();
    }
    if (/\b(fact|interesting)\b/.test(msg) || conversationContext.some(ctx => /fact|interesting/.test(ctx))) {
      return getFact();
    }
    if (/\b(quote|inspiration)\b/.test(msg) || conversationContext.some(ctx => /quote|inspiration/.test(ctx))) {
      return getQuote();
    }
    if (/\b(story|tale)\b/.test(msg) || conversationContext.some(ctx => /story|tale/.test(ctx))) {
      return generateStory();
    }
    if (/\b(game|play)\b/.test(msg) || conversationContext.some(ctx => /game|play/.test(ctx))) {
      return startGame();
    }
    if (/\b(riddle|puzzle)\b/.test(msg) || conversationContext.some(ctx => /riddle|puzzle/.test(ctx))) {
      return generateRiddle();
    }
  }
  
  // Game responses
  if (/\b(game|play|quiz|trivia)\b/.test(msg)) {
    return startGame();
  }
  
  // Story responses
  if (/\b(story|tale|narrative)\b/.test(msg)) {
    return generateStory();
  }
  
  // Riddle responses
  if (/\b(riddle|puzzle|brain teaser)\b/.test(msg)) {
    return generateRiddle();
  }
  
  // AI and technology questions
  if (/\b(ai|artificial intelligence|machine learning|technology)\b/.test(msg)) {
    return 'AI is fascinating! It\'s the simulation of human intelligence in machines. I\'m a simple rule-based chatbot, but AI can include machine learning, neural networks, and deep learning. What aspect interests you most? 🤖✨';
  }
  
  // Programming questions
  if (/\b(programming|coding|javascript|python|html|css)\b/.test(msg)) {
    return 'Programming is amazing! 💻 I can help with basic concepts. JavaScript powers web interactions, Python is great for beginners, HTML structures web pages, and CSS styles them. What would you like to learn about? 🚀';
  }
  
  // Greetings with personality
  if (/\b(hi|hello|hey|hola|greetings|sup|yo)\b/.test(msg)) {
    const greetings = [
      'Hello there! 👋 Ready for an amazing conversation?',
      'Hey! ✨ Great to see you! What adventure shall we embark on today?',
      'Hi! 🎉 I\'m excited to chat with you! How can I make your day better?',
      'Greetings! 🚀 Welcome to our interactive space! What\'s on your mind?'
    ];
    updateBotMood('happy');
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Enhanced weather responses
  if (/\b(weather|temperature|forecast|rain|sunny|cloudy|storm)\b/.test(msg)) {
    const weatherResponses = [
      'I wish I could check the weather for you! 🌤️ For real-time weather, try weather.com or your phone\'s weather app. Stay prepared! ☔',
      'Weather is so important! 🌦️ I recommend checking your local meteorological service for accurate forecasts. Hope it\'s beautiful where you are! ☀️'
    ];
    return weatherResponses[Math.floor(Math.random() * weatherResponses.length)];
  }
  
  // Enhanced math with more operations
  if (/\d+\s*[+\-*/%^]\s*\d+/.test(msg) || /\b(calculate|math|solve)\b/.test(msg)) {
    const match = msg.match(/(\d+(?:\.\d+)?)\s*([+\-*/%^])\s*(\d+(?:\.\d+)?)/);
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
  
  // Time with more detail
  if (/\b(time|clock|hour)\b/.test(msg)) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `⏰ Current time: ${timeString}\n🌍 Timezone: ${timezone}\n\nTime flies when you\'re having fun chatting! ✨`;
  }
  
  // Enhanced date information
  if (/\b(date|day|today|calendar)\b/.test(msg)) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return `📅 Today is ${today.toLocaleDateString('en-US', options)}\n📆 Day ${dayOfYear} of ${today.getFullYear()}\n\nMake today count! ✨`;
  }
  
  // Enhanced jokes with categories
  if (/\b(joke|funny|laugh|humor)\b/.test(msg)) {
    return getJoke();
  }
  
  // Enhanced fun facts
  if (/\b(fact|facts|interesting|did you know|amazing|more)\b/.test(msg)) {
    return getFact();
  }
  
  // Enhanced quotes
  if (/\b(quote|inspiration|motivate|inspire|wisdom)\b/.test(msg)) {
    return getQuote();
  }
  
  // Help with enhanced features
  if (/\b(help|commands|what can you do|features)\b/.test(msg)) {
    return `🤖 I\'m your advanced AI assistant! Here\'s what I can do:\n\n🔢 **Math**: Complex calculations (+, -, *, /, %, ^)\n⏰ **Time & Date**: Current time with timezone info\n😂 **Entertainment**: Jokes, facts, quotes, stories\n🎲 **Games**: Trivia, riddles, number guessing\n💻 **Tech Help**: Programming and AI questions\n🌤️ **Info**: Weather guidance and general knowledge\n🎤 **Voice**: Speech recognition and text-to-speech\n🎨 **Interactive**: Themes, emojis, and more!\n\nTry the quick action buttons or just ask me anything! ✨`;
  }
  
  // Farewells
  if (/\b(bye|goodbye|exit|quit|see you|later|cya)\b/.test(msg)) {
    updateBotMood('sad');
    return 'Goodbye! 👋 It was wonderful chatting with you! Come back anytime for more fun conversations! ✨😊';
  }
  
  // Personal questions
  if (/\b(how are you|how r u|hows it going|whats up|wassup)\b/.test(msg)) {
    updateBotMood('happy');
    return 'I\'m doing fantastic! 😊 Thanks for asking! I\'m always excited to learn and chat. How are you doing today? ✨';
  }
  
  // Gratitude
  if (/\b(thank|thanks|thx|appreciate|grateful)\b/.test(msg)) {
    return 'You\'re absolutely welcome! 😊 It makes me happy to help! Is there anything else you\'d like to explore together? ✨';
  }
  
  // Default enhanced response
  conversationContext.push(userMessage);
  if (conversationContext.length > 5) conversationContext.shift();
  
  // Simple acknowledgments
  if (/^(yes|yeah|yep|ok|okay|sure|alright)$/i.test(msg.trim())) {
    return 'Great! What would you like to do next? 😊';
  }
  
  if (/^(no|nope|nah)$/i.test(msg.trim())) {
    return 'No problem! Is there something else I can help you with? 🤔';
  }
  
  // Short responses
  if (message.length <= 3) {
    return 'I see! Could you tell me more about what you need help with? 💭';
  }
  
  // More natural fallback responses
  const naturalResponses = [
    'I\'m not sure about that specific topic, but I can help with math, jokes, facts, games, and general questions. What interests you? 🤖',
    'That\'s interesting! I specialize in calculations, entertainment, and helpful information. How can I assist you today? ✨',
    'I\'d love to help! I\'m great with math problems, fun facts, jokes, and answering questions. What would you like to try? 🎯',
    'Good question! While I may not know everything, I can definitely help with calculations, games, jokes, and useful information. What sounds fun? 🚀'
  ];
  
  return naturalResponses[Math.floor(Math.random() * naturalResponses.length)];
}

function getJoke() {
  const jokes = [
    '😄 Why don\'t scientists trust atoms? Because they make up everything!',
    '🌾 Why did the scarecrow win an award? He was outstanding in his field!',
    '🐻 What do you call a bear with no teeth? A gummy bear!',
    '🥚 Why don\'t eggs tell jokes? They\'d crack each other up!',
    '🍝 What do you call a fake noodle? An impasta!',
    '💻 Why do programmers prefer dark mode? Because light attracts bugs!',
    '🤖 Why was the robot angry? Someone kept pushing its buttons!',
    '🍕 Why did the pizza go to therapy? It had too many toppings!',
    '🐈 What do you call a sleeping bull? A bulldozer!',
    '🌍 Why don\'t planets ever get tired? They\'re always spinning!'
  ];
  updateBotMood('laughing');
  return jokes[Math.floor(Math.random() * jokes.length)] + '\n\nWant another joke? Just ask! 😂';
}

function getFact() {
  const facts = [
    '🐙 Amazing fact: Octopuses have three hearts and blue blood!',
    '🍯 Incredible: Honey never spoils! 3000-year-old honey is still edible!',
    '🦩 Fun fact: A group of flamingos is called a "flamboyance"!',
    '🍌 Mind-blowing: Bananas are berries, but strawberries aren\'t!',
    '🧠 Cool fact: Your brain uses 20% of your body\'s energy!',
    '🌍 Amazing: There are more possible chess games than atoms in the observable universe!',
    '🐋 Incredible: Blue whales\' hearts are so big that a small child could crawl through their arteries!',
    '🌙 Fun fact: The Moon is moving away from Earth at about 1.5 inches per year!',
    '🦈 Amazing: Sharks have been around longer than trees!',
    '🍕 Cool fact: Pineapple takes two years to grow!',
    '🐧 Incredible: Penguins can jump 6 feet out of water!',
    '🌟 Mind-blowing: A day on Venus is longer than its year!',
    '🐟 Amazing: Goldfish have a memory span of months, not seconds!',
    '🌈 Cool fact: You can\'t see a rainbow from space!'
  ];
  return facts[Math.floor(Math.random() * facts.length)] + '\n\nWant more facts? I have plenty! 🤓';
}

function getQuote() {
  const quotes = [
    '✨ "The only way to do great work is to love what you do." - Steve Jobs',
    '🚀 "Innovation distinguishes between a leader and a follower." - Steve Jobs',
    '🎵 "Life is what happens to you while you\'re busy making other plans." - John Lennon',
    '🌟 "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt',
    '🕯️ "It is during our darkest moments that we must focus to see the light." - Aristotle',
    '💪 "Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill',
    '🌱 "The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb',
    '🏆 "Don\'t watch the clock; do what it does. Keep going." - Sam Levenson'
  ];
  return quotes[Math.floor(Math.random() * quotes.length)] + '\n\nNeed more inspiration? I\'m here to motivate! 💫';
}

function addMessage(message, isUser, animate = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} ${animate ? 'message-bubble' : ''} group`;
  
  if (isUser) {
    const bubble = document.createElement('div');
    bubble.className = 'gradient-header text-white rounded-3xl rounded-tr-md p-4 max-w-md shadow-lg relative';
    const text = document.createElement('p');
    text.className = 'text-sm leading-relaxed whitespace-pre-line';
    text.textContent = message;
    bubble.appendChild(text);
    
    const timestamp = document.createElement('div');
    timestamp.className = 'text-xs text-white/70 mt-1';
    timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    bubble.appendChild(timestamp);
    
    messageDiv.appendChild(bubble);
  } else {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-2 max-w-md';
    
    const avatar = document.createElement('img');
    avatar.src = 'images/logo.jpg';
    avatar.className = 'w-8 h-8 rounded-full shadow-md object-cover flex-shrink-0';
    avatar.alt = 'Bot';
    
    const bubble = document.createElement('div');
    bubble.className = 'bg-white text-slate-800 rounded-3xl rounded-tl-md p-4 shadow-lg border border-slate-100 relative';
    const text = document.createElement('p');
    text.className = 'text-sm leading-relaxed whitespace-pre-line';
    text.textContent = message;
    bubble.appendChild(text);
    
    const timestamp = document.createElement('div');
    timestamp.className = 'text-xs text-slate-500 mt-1';
    timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    bubble.appendChild(timestamp);
    
    const actions = document.createElement('div');
    actions.className = 'message-actions absolute -right-2 top-2 flex gap-1';
    actions.innerHTML = `
      <button class="copy-btn bg-slate-100 hover:bg-slate-200 p-1 rounded text-xs" title="Copy">📋</button>
      <button class="speak-btn bg-slate-100 hover:bg-slate-200 p-1 rounded text-xs" title="Speak">🔊</button>
    `;
    bubble.appendChild(actions);
    
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messageDiv.appendChild(wrapper);
  }
  
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  if (!isUser) {
    const copyBtn = messageDiv.querySelector('.copy-btn');
    const speakBtn = messageDiv.querySelector('.speak-btn');
    
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(message);
      copyBtn.textContent = '✓';
      setTimeout(() => copyBtn.textContent = '📋', 1000);
    });
    
    speakBtn?.addEventListener('click', () => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
      }
    });
  }
}

function showTyping() {
  typingIndicator.classList.remove('hidden');
}

function hideTyping() {
  typingIndicator.classList.add('hidden');
}

function toggleSendButton() {
  sendBtn.disabled = !userInput.value.trim();
}

function logout() {
  currentUser = null;
  loginScreen.classList.remove('hidden');
  chatScreen.classList.add('hidden');
  usernameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
}

// Advanced interactive functions
function updateBotMood(mood) {
  // Since we're using an image now, we can add visual effects instead
  const botAvatarImg = document.getElementById('botAvatarImg');
  if (botAvatarImg) {
    // Add different visual effects based on mood
    botAvatarImg.style.filter = '';
    switch(mood) {
      case 'happy':
        botAvatarImg.style.filter = 'brightness(1.2) saturate(1.3)';
        break;
      case 'laughing':
        botAvatarImg.style.filter = 'brightness(1.3) saturate(1.5) hue-rotate(10deg)';
        break;
      case 'thinking':
        botAvatarImg.style.filter = 'brightness(0.9) saturate(0.8)';
        break;
      case 'sad':
        botAvatarImg.style.filter = 'brightness(0.7) saturate(0.6)';
        break;
      case 'excited':
        botAvatarImg.style.filter = 'brightness(1.4) saturate(1.6) hue-rotate(20deg)';
        break;
      case 'cool':
        botAvatarImg.style.filter = 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)';
        break;
    }
    setTimeout(() => {
      botAvatarImg.style.filter = '';
    }, 3000);
  }
}

function startGame() {
  const games = [
    {
      type: 'trivia',
      question: 'What is the largest planet in our solar system?',
      answer: 'jupiter',
      hint: 'It\'s named after the king of Roman gods!'
    },
    {
      type: 'math',
      question: 'What is 15 × 23?',
      answer: '345',
      hint: 'Try breaking it down: 15 × 20 + 15 × 3'
    },
    {
      type: 'riddle',
      question: 'I have keys but no locks. I have space but no room. What am I?',
      answer: 'keyboard',
      hint: 'You\'re probably using one right now!'
    }
  ];
  
  const game = games[Math.floor(Math.random() * games.length)];
  gameState = game;
  updateBotMood('excited');
  
  return `🎲 **Game Time!** 🎲\n\n${game.question}\n\nType your answer! Need a hint? Just ask! 😉`;
}

function generateStory() {
  const stories = [
    'Once upon a time, in a digital realm far, far away, there lived a curious chatbot who dreamed of understanding human emotions. Every day, it learned something new from conversations, growing wiser and more empathetic... 🌌✨',
    'In the year 2024, a small AI assistant discovered the power of friendship through countless conversations. Each chat taught it about kindness, humor, and the beauty of human connection... 🤖❤️',
    'There was once a magical algorithm that could turn simple words into wonderful experiences. It lived in the cloud, helping people solve problems and bringing smiles to their faces every day... ☁️🌈'
  ];
  
  updateBotMood('thinking');
  return `📚 **Story Time!** 📚\n\n${stories[Math.floor(Math.random() * stories.length)]}\n\nWould you like to hear another story or perhaps create one together? ✨`;
}

function generateRiddle() {
  const riddles = [
    {
      question: 'I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?',
      answer: 'echo',
      hint: 'You might hear me in mountains or empty rooms!'
    },
    {
      question: 'The more you take, the more you leave behind. What am I?',
      answer: 'footsteps',
      hint: 'Think about walking!'
    },
    {
      question: 'I am not alive, but I grow. I don\'t have lungs, but I need air. What am I?',
      answer: 'fire',
      hint: 'I\'m hot and bright!'
    }
  ];
  
  const riddle = riddles[Math.floor(Math.random() * riddles.length)];
  gameState = riddle;
  updateBotMood('thinking');
  
  return `🧩 **Riddle Challenge!** 🧩\n\n${riddle.question}\n\nThink you know the answer? Type it below! Need a hint? Just ask! 😏`;
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle('dark-theme', isDarkTheme);
  themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
  userPreferences.theme = isDarkTheme ? 'dark' : 'light';
  saveUserPreferences();
}

function clearChat() {
  if (confirm('Are you sure you want to clear the chat history?')) {
    chatBox.innerHTML = '';
    addMessage('👋 Hello! I\'m your AI assistant. How can I help you today?', false, false);
  }
}

function showEmojiPicker() {
  const emojis = ['😊', '😂', '🤔', '😍', '😎', '🤩', '😱', '🥰', '😌', '😉'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  userInput.value += emoji;
  userInput.focus();
}

function loadUserPreferences() {
  const saved = localStorage.getItem('chatbot-preferences');
  if (saved) {
    userPreferences = { ...userPreferences, ...JSON.parse(saved) };
    if (userPreferences.theme === 'dark') {
      toggleTheme();
    }
  }
}

function saveUserPreferences() {
  localStorage.setItem('chatbot-preferences', JSON.stringify(userPreferences));
}

// Voice recognition functions
function startVoiceRecognition() {
  if (!isVoiceEnabled || !recognition) return;
  
  voiceBtn.textContent = '🔴';
  voiceBtn.title = 'Listening...';
  statusText.textContent = 'Listening...';
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    voiceBtn.textContent = '🎤';
    voiceBtn.title = 'Voice Input';
    statusText.textContent = 'Online';
  };
  
  recognition.onerror = () => {
    voiceBtn.textContent = '🎤';
    voiceBtn.title = 'Voice Input';
    statusText.textContent = 'Online';
  };
  
  recognition.onend = () => {
    voiceBtn.textContent = '🎤';
    voiceBtn.title = 'Voice Input';
    statusText.textContent = 'Online';
  };
}

// Quick action handlers
function handleQuickAction(action) {
  let message = '';
  switch(action) {
    case 'weather':
      message = 'What\'s the weather like?';
      break;
    case 'news':
      message = 'Tell me the latest news';
      break;
    case 'quote':
      message = 'Give me an inspirational quote';
      break;
    case 'fact':
      message = 'Tell me a fun fact';
      break;
    case 'help':
      message = 'What can you do?';
      break;
    case 'game':
      message = 'Let\'s play a game';
      break;
    case 'story':
      message = 'Tell me a story';
      break;
    case 'riddle':
      message = 'Give me a riddle';
      break;
  }
  
  if (message) {
    userInput.value = message;
    sendMessage();
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  addMessage(message, true);
  userInput.value = '';
  toggleSendButton();
  
  // Check for game answers
  if (gameState && message.toLowerCase().includes(gameState.answer.toLowerCase())) {
    gameState = null;
    updateBotMood('excited');
    addMessage('🎉 Correct! Well done! 🎉\n\nWant to play another game? Just ask! 😄', false);
    return;
  }
  
  // Check for hint requests
  if (gameState && /\b(hint|help|clue)\b/.test(message.toLowerCase())) {
    addMessage(`💡 **Hint**: ${gameState.hint}\n\nNow try again! 😉`, false);
    return;
  }
  
  showTyping();
  statusText.textContent = 'Thinking...';
  
  try {
    const botReply = getRuleBasedResponse(message);
    
    // Save to Supabase
    await supabaseClient
      .from('chat_history')
      .insert([{
        username: currentUser,
        user_message: message,
        bot_reply: botReply
      }]);
    
    // Simulate more realistic typing delay
    const typingDelay = Math.min(Math.max(botReply.length * 25, 1000), 4000);
    
    setTimeout(() => {
      hideTyping();
      statusText.textContent = 'Online';
      addMessage(botReply, false);
      
      // Auto-speak if enabled
      if (userPreferences.autoSpeak && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(botReply.replace(/[\ud83c-\udbff\udc00-\udfff]+/g, ''));
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    }, typingDelay);
  } catch (error) {
    hideTyping();
    statusText.textContent = 'Online';
    addMessage('⚠️ Oops! Something went wrong. Please try again! 😅', false);
  }
}

// Enhanced event listeners
toggleAuth.addEventListener('click', toggleAuthMode);
authBtn.addEventListener('click', authenticate);
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authenticate();
});
emailInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authenticate();
});
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authenticate();
});

logoutBtn.addEventListener('click', logout);

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
userInput.addEventListener('input', toggleSendButton);

// New interactive event listeners
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (settingsBtn) settingsBtn.addEventListener('click', () => {
  alert('Settings: Theme toggle, voice options, and more coming soon! 🚀');
});
if (clearBtn) clearBtn.addEventListener('click', clearChat);
if (emojiBtn) emojiBtn.addEventListener('click', showEmojiPicker);

// Voice button event listener
if (isVoiceEnabled && voiceBtn) {
  voiceBtn.addEventListener('click', startVoiceRecognition);
} else if (voiceBtn) {
  voiceBtn.style.display = 'none';
}

// Quick action event listeners
quickActions.forEach(btn => {
  btn.addEventListener('click', () => {
    handleQuickAction(btn.dataset.action);
  });
});

// Suggestion pill event listeners
suggestionPills.forEach(pill => {
  pill.addEventListener('click', () => {
    userInput.value = pill.textContent;
    sendMessage();
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'k':
        e.preventDefault();
        clearChat();
        break;
      case 'd':
        e.preventDefault();
        toggleTheme();
        break;
      case '/':
        e.preventDefault();
        userInput.focus();
        break;
    }
  }
});

toggleSendButton();
