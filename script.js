// DOM Elements
const chatList = document.getElementById('chatList');
const chatContent = document.getElementById('chatContent');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const chatTitle = document.getElementById('chatTitle');
const typingIndicator = document.getElementById('typingIndicator');
const emojiToggle = document.getElementById('emojiToggle');
const emojiPicker = document.getElementById('emojiPicker');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('themeToggle');

// Sample Data
const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'images/profile1.jpeg',
    status: 'online',
    messages: [
      {
        text: 'Hey there!',
        time: '10:30 AM',
        sender: 'other'
      },
      {
        text: 'Hi! How are you?',
        time: '10:32 AM',
        sender: 'user'
      }
    ]
  },
  {
    id: 2,
    name: 'Sarah Williams',
    avatar: 'images/profile2.jpeg',
    status: 'offline',
    messages: [
      {
        text: 'Meeting at 3 PM',
        time: 'Yesterday',
        sender: 'other'
      }
    ]
  },
  {
    id: 3,
    name: 'Michael Chen',
    avatar: 'images/profile3.jpeg',
    status: 'online',
    messages: []
  }
];

let activeUser = null;
let typingTimeout;

// Initialize the app
function init() {
  renderChatList();
  setupEventListeners();
  checkThemePreference();
  handleResponsiveLayout(); // Initial responsive check
}

// Render chat list
function renderChatList() {
  chatList.innerHTML = users.map(user => `
    <div class="chat-item" data-id="${user.id}">
      <img src="${user.avatar}" alt="${user.name}">
      <div class="chat-info">
        <div class="chat-name">${user.name}</div>
        <div class="last-message">
          ${user.messages.length > 0 ? 
            user.messages[user.messages.length - 1].text : 
            'No messages yet'}
        </div>
      </div>
      <div class="status-indicator ${user.status}"></div>
    </div>
  `).join('');
}

// Render chat messages
function renderChat(user) {
  activeUser = user;
  chatTitle.textContent = user.name;
  
  if (user.messages.length === 0) {
    chatContent.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-comment-alt"></i>
        <p>No messages yet</p>
        <small>Start the conversation with ${user.name}</small>
      </div>
    `;
  } else {
    chatContent.innerHTML = user.messages.map(message => `
      <div class="message ${message.sender === 'user' ? 'sent' : 'received'}">
        ${message.sender === 'other' ? `
          <div class="message-avatar">
            <img src="${user.avatar}" alt="${user.name}">
          </div>
        ` : ''}
        <div class="message-content">
          <p>${message.text}</p>
          <span class="message-time">${message.time}</span>
        </div>
      </div>
    `).join('');
  }
  
  // Scroll to bottom
  chatContent.scrollTop = chatContent.scrollHeight;
  
  // Enable input
  messageInput.disabled = false;
  sendButton.disabled = false;
  messageInput.focus();
}

// Send message
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !activeUser) return;

  const newMessage = {
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: 'user'
  };

  activeUser.messages.push(newMessage);
  messageInput.value = '';
  renderChat(activeUser);
  
  // Simulate reply after delay
  simulateReply();
}

// Simulate reply
function simulateReply() {
  const replies = [
    "That's interesting!",
    "I'll get back to you on that.",
    "Thanks for letting me know!",
    "Can we talk about this later?",
    "I appreciate your message!",
    "Let me think about that...",
    "Sounds good to me!",
    "I'm not sure about that.",
    "What time works for you?",
    "Have you considered other options?"
  ];
  
  showTypingIndicator(true);
  
  setTimeout(() => {
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const replyMessage = {
      text: randomReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'other'
    };
    
    activeUser.messages.push(replyMessage);
    renderChat(activeUser);
    showTypingIndicator(false);
  }, 1500 + Math.random() * 2000);
}

// Show typing indicator
function showTypingIndicator(show) {
  if (show) {
    typingIndicator.classList.add('active');
  } else {
    typingIndicator.classList.remove('active');
  }
}

// Toggle emoji picker
function toggleEmojiPicker() {
  emojiPicker.classList.toggle('active');
  
  if (emojiPicker.classList.contains('active')) {
    const emojis = ['😀', '😂', '😍', '🤔', '😎', '👍', '❤️', '🔥', '🎉', '🙏'];
    emojiPicker.innerHTML = emojis.map(emoji => `
      <button class="emoji-btn">${emoji}</button>
    `).join('');
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Check user's theme preference
function checkThemePreference() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Handle responsive layout
function handleResponsiveLayout() {
  const closeButton = document.getElementById('closeSidebar');
  
  if (window.innerWidth <= 768) {
    // Mobile view
    if (closeButton) closeButton.style.display = 'block';
    menuToggle.style.display = 'block';
    sidebar.classList.remove('active');
  } else {
    // Desktop view
    if (closeButton) closeButton.style.display = 'none';
    menuToggle.style.display = 'none';
    sidebar.classList.add('active');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Add close button to sidebar header
  const closeButton = document.createElement('button');
  closeButton.className = 'btn-close';
  closeButton.id = 'closeSidebar';
  closeButton.setAttribute('aria-label', 'Close sidebar');
  document.querySelector('.sidebar-header').appendChild(closeButton);

  // Chat list click
  chatList.addEventListener('click', (e) => {
    const chatItem = e.target.closest('.chat-item');
    if (chatItem) {
      const userId = parseInt(chatItem.dataset.id);
      const user = users.find(u => u.id === userId);
      renderChat(user);
      
      // Update active state
      document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
      });
      chatItem.classList.add('active');
      
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    }
  });
  
  // Send message
  sendButton.addEventListener('click', sendMessage);
  
  // Send on Enter key
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Toggle emoji picker
  emojiToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEmojiPicker();
  });
  
  // Close emoji picker when clicking outside
  document.addEventListener('click', () => {
    emojiPicker.classList.remove('active');
  });
  
  // Emoji selection
  emojiPicker.addEventListener('click', (e) => {
    if (e.target.classList.contains('emoji-btn')) {
      messageInput.value += e.target.textContent;
      messageInput.focus();
    }
  });
  
  // Toggle sidebar
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
  
  // Close sidebar
  closeButton.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Window resize handler
  window.addEventListener('resize', handleResponsiveLayout);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);