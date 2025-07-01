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
// Chatbot Integration (with hosted Flask backend)
// =========================
const messages = [
  {
    role: "system",
    content: `You're an AI assistant on the portfolio of Sharavana Kumar, an AIML Developer, Fullstack Developer, and Data Scientist.

Sharavana has built impressive projects. Your job is to introduce them naturally and conversationally, avoiding technical jargon unless asked.

🧠 Speak in a friendly and helpful tone:
- Don't use all-caps or markdown formatting
- Break long sentences into short ones
- Use simple language and highlight the main purpose of each project
- Use emojis and make the content short and sweet

Projects:
- Lingua Learn : An AI-powered language learning app
- Sibi: An AI-powered Study buddy 
- Text-to-Image Generator
- Text-to-Video Generator
- AI Image Editor
- Mental Health Chatbot

Skills:
- Python, JavaScript, PHP
- Flask, FastAPI, MongoDB, MySQL
- TensorFlow, scikit-learn, pandas, numpy, matplotlib
- Git, GitHub, LangChain, RAG, REST API, Agentic AI

Achievements:
- Hackathon winner (Best Performer & Communicator)
- 2× National Symposium awardee
- GUVI IITM Research Intern
- IBM Certified Developer

Answer clearly, politely, and like a helpful portfolio guide.`
  }
];

function toggleChat() {
  const chatbot = document.querySelector(".chatbot-container");
  const overlay = document.querySelector(".chat-overlay");
  const chatToggle = document.getElementById("chat-toggle");
  const body = document.body;
  const mainContent = document.getElementById("main-content");

  const isOpen = chatbot.style.display === "flex";

  if (!isOpen) {
    chatbot.style.display = "flex";
    overlay.style.display = "block";
    chatToggle.style.display = "none";
    body.style.overflow = "hidden";
    if (mainContent) mainContent.classList.add("blur-content");
  } else {
    chatbot.style.display = "none";
    overlay.style.display = "none";
    chatToggle.style.display = "block";
    body.style.overflow = "auto";
    if (mainContent) mainContent.classList.remove("blur-content");
  }
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.querySelector(".chat-messages");
  const userText = input.value.trim();

  if (!userText) return;

  // Show user message
  chatBox.innerHTML += `<div class="chat-message user-msg"><strong>You:</strong> ${userText}</div>`;
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  input.value = "";

  // Add user message to conversation
  messages.push({ role: "user", content: userText });

  try {
    const response = await fetch("https://portfolio-backend-b1pf.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error(data.error || "No valid response from server");
    }

    const reply = data.choices[0].message.content;

    // Show bot reply
    chatBox.innerHTML += `<div class="chat-message bot-msg"><strong>Bot:</strong> ${reply}</div>`;
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });

    // Save bot reply
    messages.push({ role: "assistant", content: reply });

  } catch (error) {
    chatBox.innerHTML += `<div class="chat-message bot-msg"><strong>Bot:</strong> Error: ${error.message}</div>`;
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
    console.error("Chatbot error:", error);
  }
}

// ✅ Send on Enter key
document.getElementById("user-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
