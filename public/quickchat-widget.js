(function () {
  // ========== Inject FontAwesome ==========
  const faScript = document.createElement("script");
  faScript.src = "https://kit.fontawesome.com/d31e8f0c6b.js";
  faScript.crossOrigin = "anonymous";
  document.head.appendChild(faScript);

  // Inject Google Fonts and preconnect links
const fontLinks = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
  { 
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];

fontLinks.forEach(linkInfo => {
  const link = document.createElement("link");
  link.rel = linkInfo.rel;
  link.href = linkInfo.href;
  if (linkInfo.crossorigin) link.crossOrigin = linkInfo.crossorigin;
  document.head.appendChild(link);
});


  // ========== Inject Styles ==========
  const style = document.createElement("style");
  style.textContent = `/* Root Styles */
body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #f1f5f9;
}
a{
color: white;
}

/* Widget Container */
#quickchatpro-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-family: 'Inter', sans-serif;
  z-index: 9999;
}

/* Chat Toggle Button */
#chat-button {
  display: inline-block;
  padding: 14px;
  border-radius: 50%;
  cursor: pointer;
  color: black;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

#chat-button:hover {
  background: rgba(0, 51, 102, 0.8);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

#exit {
  display: none;
}

/* Main Chat Window */
#chat-window {
  width: 350px;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 10px;
}

.hidden {
  display: none !important;
}

/* Header */
#chat-header {
  background: #003366;
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: bold;
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
}

.chat-status {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

/* Messages Area */
#chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
}

/* Message Bubbles */
.message {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 80%;
  line-height: 1.4;
  font-size: 14px;
  position: relative;
}

.user {
  align-self: flex-end;
  background: #003366;
  color: white;
  border-bottom-right-radius: 4px;
  font-family: "Inter", sans-serif;
  padding: 18px 25px;
  border-radius: 15px;
}

.bot {
  align-self: flex-start;
  background: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px;
  font-family: "Inter", sans-serif;
  font-weight: 300;
  padding: 18px 25px;
  border-radius: 15px;
}
.human{
  align-self: flex-start;
  background: #afaff7;
  color: black;
  border-bottom-left-radius: 4px;
  font-family: "Inter", sans-serif;
  font-weight: 300;
  padding: 18px 25px;
  border-radius: 15px;
  font-style: italic;
}

.typing {
  font-style: italic;
  color: #888;
  padding-left: 8px;
}

.chat-msg.bot.typing {
  font-style: italic;
  color: #888;
}

/* Input Area */
#chat-input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #eee;
  gap: 10px;
}

#chat-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
}

/* Send Button */
#send-button {
  background: #003366;
  color: white;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
}

/* Upload Button */
.upload-btn {
  cursor: pointer;
  font-size: 20px;
  margin-right: 8px;
  user-select: none;
}

/* Image & Video Preview */
.chat-image-preview,
.chat-video-preview {
  max-width: 200px;
  max-height: 200px;
  border-radius: 10px;
  margin: 5px 0;
}

.chat-image-preview:hover {
  opacity: 0.8;
}

.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.image-popup {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-popup img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.image-popup .close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: white;
  border-radius: 50%;
  padding: 4px 10px;
  font-weight: bold;
  cursor: pointer;
}

.uploading {
  font-size: 12px;
  color: #888;
  margin-left: 8px;
}
.chat-msg.sending {
  opacity: 0.6;
  font-style: italic;
}

  `;
  document.head.appendChild(style);

  // ========== Inject Widget HTML ==========
  const container = document.createElement("div");
  container.innerHTML = `
    <div id="quickchatpro-widget">
    <div id="chat-button">
      <i class="fa-regular fa-comment-dots" id="open"></i>
      <i class="fa-regular fa-circle-xmark" id="exit"></i>
    </div>

    <div id="chat-window" class="chat-container hidden">
      <div class="chat-header" id="chat-header">
        <div class="chat-title">Chipa Chat</div>
        <div class="chat-status"><a href="https://chipachat.vercel.app/">powered by Chipa-chat</a></div>
      </div>

      <div id="chat-messages" class="chat-box"></div>

      <form id="chat-input-area">
        <!--<label for="file-upload" class="upload-btn">
          <i class="fa-solid fa-plus"></i>
        </label>
        <input type="file" id="file-upload" accept="image/*" style="display: none;" />-->
        <input type="text" id="chat-input" placeholder="Type a message..." required />
        <button id="send-button" type="submit">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </form>
    </div>
  </div>
  `;
  document.body.appendChild(container);

// ========== Setup ==========
const chatBtn = document.getElementById("chat-button");
const chatWindow = document.getElementById("chat-window");
const openIcon = document.getElementById("open");
const exitIcon = document.getElementById("exit");

const scriptTag = document.currentScript || document.querySelector('script[email]');
const business = scriptTag?.getAttribute("business") || "dominicagu791@gmail.com";


let userHasChatted = false;
let isSending = false;

  const sessionId = sessionStorage.getItem("sessionId"); // sessionId must already be set
  const tabChannel = new BroadcastChannel("tab-tracker-channel");
  let isLastTab = true;

  // Ping other tabs
  tabChannel.postMessage({ type: "ping" });

  tabChannel.onmessage = (event) => {
    if (event.data.type === "ping") {
      tabChannel.postMessage({ type: "pong" });
    }
    if (event.data.type === "pong") {
      isLastTab = false; // There are other open tabs
    }
  };

  window.addEventListener("beforeunload", () => {
    if (!business || !sessionId) return;

    // Close only on last tab
    if (isLastTab) {
      const payload = JSON.stringify({ sessionId, business });
      navigator.sendBeacon(
        "https://quickchatpro-backend-test1-2.onrender.com/session/close",
        new Blob([payload], { type: "application/json" })
      );
    }
  });

(async () => {
  const chatBox = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-input-area');
  const chatInput = document.getElementById('chat-input');

  const renderedMessages = new Set();
  const tempMessageMap = new Map();

  async function loadChatTitle() {

  const res = await fetch(`https://quickchatpro-backend-test1-2.onrender.com/api/settings?business=${business}`);
  const data = await res.json();

  if (data.chatTitle) {
    document.querySelector(".chat-title").textContent = data.chatTitle;
  }
}

loadChatTitle();


let sessionId = sessionStorage.getItem('sessionId');


  function appendMessage(sender, text = '', _fileUrl = '', _fileType = '', _timestamp = '', msgId = '', isTemp = false) {
    const contentKey = `${sender}-${text}`.trim();

    if (sender === 'user' && !isTemp && tempMessageMap.has(contentKey)) {
      const tempEl = tempMessageMap.get(contentKey);
      if (tempEl?.parentNode) tempEl.remove();
      renderedMessages.delete(tempEl.getAttribute('data-msg-id'));
      tempMessageMap.delete(contentKey);
    }

    const uniqueKey = msgId || `temp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (renderedMessages.has(uniqueKey)) return;

    const div = document.createElement('div');
    div.classList.add('chat-msg', sender);
    div.setAttribute('data-msg-id', uniqueKey);
    div.textContent = text;

    chatBox.appendChild(div);
    renderedMessages.add(uniqueKey);

    if (isTemp && sender === 'user') {
      tempMessageMap.set(contentKey, div);
    }

    const atBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 50;
    if (atBottom) chatBox.scrollTop = chatBox.scrollHeight;
  }

  if (!chatBox || !chatForm || !chatInput) {
    console.error('Essential chat DOM elements missing.');
    throw new Error('Chat UI failed to load properly.');
  }

  chatBtn.addEventListener("click", () => {
    const isNowOpening = chatWindow.classList.contains("hidden");
    chatWindow.classList.toggle("hidden");

    sessionStorage.setItem("chat_open", isNowOpening ? "true" : "false");

    openIcon.style.display = isNowOpening ? "none" : "inline";
    exitIcon.style.display = isNowOpening ? "inline" : "none";

    const greeted = sessionStorage.getItem("greeted") === "true";
    if (isNowOpening && !userHasChatted && !greeted) {
      appendMessage("bot", "👋 Hello! How can I help you today?");
      sessionStorage.setItem("greeted", "true");
      userHasChatted = true;
    }
  });

  

  async function initSession() {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem('sessionId', sessionId);

    await fetch('https://quickchatpro-backend-test1-2.onrender.com/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, business }),
    });

    console.log('✅ New session started:', sessionId);
  }

  let inactivityTimeout;

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    if (sessionId && business) {
      console.log('🕒 No activity for 10 minutes. Auto-closing session.');
      navigator.sendBeacon(
        "https://quickchatpro-backend-test1-2.onrender.com/api/session/close",
        new Blob(
          [JSON.stringify({ sessionId, business })],
          { type: 'application/json' }
        )
      );
    }
  }, 10 * 60 * 1000); // 10 minutes
}

// Reset inactivity timer on user activity
['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event =>
  window.addEventListener(event, resetInactivityTimer)
);

// Start timer when session is initialized
resetInactivityTimer();


  async function loadMessages() {
    try {
      const res = await fetch(`https://quickchatpro-backend-test1-2.onrender.com/api/messages/${business}`);
      const allMessages = await res.json();

      const sessionMessages = allMessages
        .filter(msg => msg.sessionId === sessionId)
        .sort((a, b) => a._id.localeCompare(b._id));

      chatBox.innerHTML = '';

      sessionMessages.forEach(msg =>
        appendMessage(msg.sender, msg.text, '', '', msg.timestamp, msg._id)
      );
    } catch {
      appendMessage('bot', '❌ Failed to load chat history.');
    }
  }

  async function pollForNewMessages() {
    try {
      const res = await fetch(`https://quickchatpro-backend-test1-2.onrender.com/api/messages/${business}`);
      const allMessages = await res.json();

      const sessionMessages = allMessages
        .filter(msg => msg.sessionId === sessionId)
        .sort((a, b) => a._id.localeCompare(b._id));

      const newMessages = sessionMessages.filter(msg => !renderedMessages.has(msg._id));
if (newMessages.length) {
  const typingMsg = document.getElementById('typing-indicator');
  if (typingMsg) typingMsg.remove();

  newMessages.forEach(msg => {
    appendMessage(msg.sender, msg.text, '', '', msg.timestamp, msg._id, false);
  });
}

    } catch (err) {
      console.warn('Polling failed:', err);
    }
  }

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    if (!sessionId) await initSession();

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    appendMessage('user', message, '', '', '', tempId, true);
    chatInput.value = '';

      const typingDiv = document.createElement('div');
      typingDiv.classList.add('chat-msg', 'bot');
      typingDiv.id = 'typing-indicator';
      typingDiv.textContent = '🤖 Bot is typing...';
      chatBox.appendChild(typingDiv);
      chatBox.scrollTop = chatBox.scrollHeight;

    try {
  await fetch('https://quickchatpro-backend-test1-2.onrender.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, business })
  });

  // Immediately poll for new messages after user sends
  await pollForNewMessages();
} catch {
  appendMessage('bot', '❌ Failed to send message.');
}

  });

  await loadMessages();
  setInterval(pollForNewMessages, 3000);

  window._renderedMessagesCount = document.querySelectorAll('.chat-msg').length;

  window.addEventListener('pagehide', () => {
    console.log('🔚 pagehide triggered — attempting to close session...');
    if (!sessionId || !business) return;

    console.log('📤 Sending session close to server...');
    navigator.sendBeacon(
      'https://quickchatpro-backend-test1-2.onrender.com/api/session/close',
      new Blob(
        [JSON.stringify({ sessionId, business })],
        { type: 'application/json' }
      )
    );
  });
})();

})();
