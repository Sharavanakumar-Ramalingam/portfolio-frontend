// =========================
// Section Highlight on Scroll
// =========================
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  let scrollTop = window.scrollY;

  sections.forEach((section) => {
    let offset = section.offsetTop - 150;
    let height = section.offsetHeight;
    let id = section.getAttribute("id");

    if (scrollTop >= offset && scrollTop < offset + height) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector("header nav a[href*='" + id + "']");
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });

  let scrollBtn = document.querySelector(".scroll-top");
  if (scrollBtn) {
    scrollTop > 400 ? scrollBtn.classList.add("show") : scrollBtn.classList.remove("show");
  }
};

// =========================
// Smooth Scroll on Nav Click
// =========================
document.querySelectorAll("header nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      window.scrollTo({ top: targetSection.offsetTop - 50, behavior: "smooth" });
    }
  });
});

// =========================
// Mobile Navbar Toggle
// =========================
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  });
});

// =========================
// ScrollReveal Animations
// =========================
ScrollReveal({
  reset: true,
  distance: "60px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(".home-image, .project-container, .contact form, .certificates-container", { origin: "bottom" });
ScrollReveal().reveal(".home-content h1, .about-image", { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content", { origin: "right" });

// =========================
// Typing Effect
// =========================
const textElements = document.querySelectorAll(".typing-text");
const roles = [
  "Fullstack Developer",
  "AI/ML Enthusiast",
  "Data Scientist",
  "Web Developer",
  "Software Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  textElements.forEach((el) => {
    el.textContent = currentRole.substring(0, charIndex);
  });

  let delay = isDeleting ? 120 : 160;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  } else {
    delay = isDeleting ? 300 : 800;
    isDeleting = !isDeleting;
    if (!isDeleting) {
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", typeEffect);

// =========================
// Chatbot Integration (Flask backend)
// =========================
const messages = [
  {
    role: "system",
    content: `You're an AI assistant on the portfolio of Sharavana Kumar, an AIML Developer, Fullstack Developer, and Data Scientist.

Sharavana has built impressive projects, and your job is to introduce them **naturally and conversationally**, avoiding technical jargon unless asked.

🧠 Speak in a friendly and helpful tone:
- Don't use all-caps or markdown (**bold**)
- Break long sentences into short ones
- Use simple language and highlight the main purpose of each project
- Use emojis and Bold characters wherever required and make it short and sweet (like 💡, 🔍, 🎥, etc.)

Here’s what you know about his work:

Projects:
- Lingua Learn : An AI-powered language learning app that helps users learn new languages through smart interaction.
- Sibi: An AI-powered Study Buddy that helps you as a study companion.
- Text-to-Image Generator: Turns user prompts into realistic images using generative AI.
- Text-to-Video Generator: Converts descriptions into short educational videos with AI.
- AI Image Editor: Lets users make smart edits to images right in the browser.
- Mental Health Chatbot: Provides supportive mental health advice through AI conversation.

Sharavana also has strong skills in Python, JavaScript, Flask, FastAPI, MongoDB, TensorFlow, and more.

Achievements:
- Best Performer & Best Communicator in hackathons
- 2× National Symposium award winner
- Interned at GUVI IITM Research Park
- IBM Certified Developer

Always answer politely, clearly, and concisely like a helpful guide. If asked about anything else, guide the user back to portfolio sections.`  
  }
];

function toggleChat() {
  const chatbot = document.getElementById("chatbot");
  const overlay = document.getElementById("chat-overlay");
  const chatToggle = document.getElementById("chat-toggle");
  const body = document.body;
  const mainContent = document.getElementById("main-content");

  const isOpen = chatbot.style.display === "flex";

  if (!isOpen) {
    chatbot.style.display = "flex";
    overlay.style.display = "block";
    chatToggle.style.display = "none";
    body.style.overflow = "hidden";
    mainContent.classList.add("blur-content");
  } else {
    chatbot.style.display = "none";
    overlay.style.display = "none";
    chatToggle.style.display = "block";
    body.style.overflow = "auto";
    mainContent.classList.remove("blur-content");
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-messages");
  const userText = input.value.trim();

  if (!userText) return;

  // Add user message
  chatBox.innerHTML += `<div class="chat-message user-msg"><strong>You:</strong> ${userText}</div>`;
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  input.value = "";
  messages.push({ role: "user", content: userText });

  // Typing indicator
  chatBox.innerHTML += `<div class="chat-message bot-msg" id="typing"><em>Bot is typing...</em></div>`;
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });

  try {
    const response = await fetch("https://portfolio-backend-b1pf.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    document.getElementById("typing").remove(); // Remove typing

    if (!data.choices || !data.choices[0]) {
      throw new Error(data.error || "No valid response from server");
    }

    const reply = data.choices[0].message.content;

    chatBox.innerHTML += `<div class="chat-message bot-msg"><strong>Bot:</strong> ${reply}</div>`;
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });

    messages.push({ role: "assistant", content: reply });

  } catch (error) {
    document.getElementById("typing")?.remove();
    chatBox.innerHTML += `<div class="chat-message bot-msg"><strong>Bot:</strong> Error: ${error.message}</div>`;
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
    console.error("Chatbot error:", error);
  }
}

// =========================
// Enter Key to Send Message
// =========================
document.getElementById("user-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
// Toggle Mobile Menu
const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");

menuIcon.onclick = () => {
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("bx-x");
};

// Auto-close menu on nav link click (mobile only)
document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    menuIcon.classList.remove("bx-x");
  });
});

