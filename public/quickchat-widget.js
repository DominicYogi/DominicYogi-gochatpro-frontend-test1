// ========== Setup ==========
const chatBtn = document.getElementById("chat-button");
const chatWindow = document.getElementById("chat-window");
const openIcon = document.getElementById("open");
const exitIcon = document.getElementById("exit");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");

const scriptTag = document.currentScript || document.querySelector('script[data-business]');
const businessId = scriptTag?.getAttribute("data-business") || "default";

// Flags
let userHasChatted = false;
let isSending = false;

const sessionId = sessionStorage.getItem("chat_session_id") || generateSessionId();
sessionStorage.setItem("chat_session_id", sessionId);

function generateSessionId() {
  return "sess_" + Math.random().toString(36).substr(2, 9);
}

// Restore chat open/close state
const wasOpen = sessionStorage.getItem("chat_open") === "true";
if (wasOpen) {
  chatWindow.classList.remove("hidden");
  openIcon.style.display = "none";
  exitIcon.style.display = "inline";
}

// Restore chat history
const history = JSON.parse(sessionStorage.getItem("chat_history") || "[]");
if (messages.children.length === 0 && history.length > 0) {
  history.forEach(({ type, text }) => renderMessage(type, text)); // ⬅️ only render, don’t re-save
  userHasChatted = true;
}

// ========== Chat Toggle ==========
chatBtn.addEventListener("click", () => {
  const isNowOpening = chatWindow.classList.contains("hidden");
  chatWindow.classList.toggle("hidden");

  // Save open/close state
  sessionStorage.setItem("chat_open", isNowOpening ? "true" : "false");

  openIcon.style.display = isNowOpening ? "none" : "inline";
  exitIcon.style.display = isNowOpening ? "inline" : "none";

  // Greet only once per session
  const greeted = sessionStorage.getItem("greeted") === "true";
  if (isNowOpening && !userHasChatted && !greeted) {
    appendMessage("bot", "👋 Hello! How can I help you today?");
    sessionStorage.setItem("greeted", "true");
    userHasChatted = true;
  }
});

// ========== Input Handlers ==========
document.getElementById("send-button").addEventListener("click", sendMessage);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// ========== Message Functions ==========
function renderMessage(sender, text) {
  const msgBox = document.createElement("div");
  msgBox.className = sender === "user" ? "user-message" : "bot-message";
  msgBox.textContent = text;
  messages.appendChild(msgBox);
  messages.scrollTop = messages.scrollHeight;
}

function appendMessage(sender, text) {
  renderMessage(sender, text);

  const history = JSON.parse(sessionStorage.getItem("chat_history") || "[]");
  history.push({ type: sender, text });
  sessionStorage.setItem("chat_history", JSON.stringify(history));
}

function updateLastBotMessage(newText) {
  const bots = document.querySelectorAll(".bot-message");
  if (bots.length > 0) bots[bots.length - 1].textContent = newText;
}

// ========== Main Chat Function ==========
async function sendMessage() {
  if (isSending) return;
  isSending = true;

  const message = input.value.trim();
  if (!message) {
    isSending = false;
    return;
  }

  userHasChatted = true;

  // 1. Show user message (and save)
  appendMessage("user", message);
  input.value = "";

  // 2. Show "Typing..." temporarily (DO NOT SAVE)
  renderMessage("bot", "Typing...");

  try {
    // 3. Call your backend
   const response = await fetch("https://quickchatpro-backend-test1.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    message,
    business: businessId,
    sessionId: sessionId
  })
});

    const data = await response.json();

    // 4. Replace "Typing..." with real reply (and save)
    updateLastBotMessage(data.reply || "No response from bot.");
    
    // Save final reply to history
    const history = JSON.parse(sessionStorage.getItem("chat_history") || "[]");
    history.push({ type: "bot", text: data.reply || "No response from bot." });
    sessionStorage.setItem("chat_history", JSON.stringify(history));

  } catch (error) {
    updateLastBotMessage("❌ Error: Could not connect.");
  }

  isSending = false;
}

