(function () {
  // ========== Inject FontAwesome ==========
  const faScript = document.createElement("script");
  faScript.src = "https://kit.fontawesome.com/d31e8f0c6b.js";
  faScript.crossOrigin = "anonymous";
  document.head.appendChild(faScript);

  // ========== Inject Styles ==========
  const style = document.createElement("style");
  style.textContent = `
    #quickchatpro-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-family: Arial, sans-serif;
      z-index: 9999;
    }
    #chat-button {
      display: inline-block;
      padding: 14px;
      border-radius: 50%;
      cursor: pointer;
      color: black;
      width: auto;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 0, 0, 0.15);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }
    #chat-button:hover {
      background: rgba(0, 123, 255, 0.8);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
    #exit { display: none; }
    #chat-window {
      width: 300px;
      height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      margin-top: 10px;
    }
    .hidden { display: none !important; }
    #chat-header {
      background: #007bff;
      color: white;
      padding: 12px;
      font-weight: bold;
      text-align: center;
    }
    #chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
    }
    #chat-input-area {
      display: flex;
      border-top: 1px solid #ccc;
    }
    #chat-input {
      flex: 1;
      padding: 10px;
      border: none;
    }
    #send-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
    }
    .user-message { text-align: right; margin: 4px 0; }
    .bot-message { text-align: left; margin: 4px 0; color: #555; }
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
      <div id="chat-window" class="hidden">
        <div id="chat-header">QuickChatPro</div>
        <div id="chat-messages"></div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" placeholder="Type a message..." />
          <button id="send-button"><i class="fa-regular fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // ========== Setup ==========
  const chatBtn = document.getElementById("chat-button");
  const chatWindow = document.getElementById("chat-window");
  const openIcon = document.getElementById("open");
  const exitIcon = document.getElementById("exit");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");

  const scriptTag = document.currentScript || document.querySelector('script[data-business]');
  const businessId = scriptTag?.getAttribute("data-business") || "default";

  let chatInitialized = sessionStorage.getItem("chat_initialized") === "true";
  let userHasChatted = false;
  let isSending = false;

  // Restore history
  const previous = JSON.parse(sessionStorage.getItem("chat_history") || "[]");
  previous.forEach(({ type, text }) => appendMessage(type, text));
  if (previous.length > 0) userHasChatted = true;

  // ========== Chat Toggle ==========
  chatBtn.addEventListener("click", () => {
    const isHidden = chatWindow.classList.contains("hidden");
    chatWindow.classList.toggle("hidden");

    openIcon.style.display = isHidden ? "none" : "inline";
    exitIcon.style.display = isHidden ? "inline" : "none";

    const greeted = sessionStorage.getItem("greeted") === "true";
    if (!isHidden && !userHasChatted && !greeted) {
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
  function appendMessage(sender, text) {
    const msgBox = document.createElement("div");
    msgBox.className = sender === "user" ? "user-message" : "bot-message";
    msgBox.textContent = text;
    messages.appendChild(msgBox);
    messages.scrollTop = messages.scrollHeight;

    const history = JSON.parse(sessionStorage.getItem("chat_history") || "[]");
    history.push({ type: sender, text });
    sessionStorage.setItem("chat_history", JSON.stringify(history));
  }

  function updateLastBotMessage(newText) {
    const bots = document.querySelectorAll(".bot-message");
    if (bots.length > 0) bots[bots.length - 1].textContent = newText;
  }

  // ========== Send Message ==========
  async function sendMessage() {
    if (isSending) return;
    isSending = true;

    const message = input.value.trim();
    if (!message) {
      isSending = false;
      return;
    }

    userHasChatted = true;
    appendMessage("user", message);
    input.value = "";
    appendMessage("bot", "Typing...");

    try {
      const response = await fetch("https://quickchatpro-backend-test1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, business: businessId })
      });

      const data = await response.json();
      updateLastBotMessage(data.reply || "No response from bot.");
    } catch (error) {
      updateLastBotMessage("❌ Error: Could not connect.");
    }

    isSending = false;
  }
})();
