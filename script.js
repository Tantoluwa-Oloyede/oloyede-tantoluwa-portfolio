// Theme toggle
const rootElement = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme === "light" ? "light" : "dark";
rootElement.setAttribute("data-theme", initialTheme);

function updateThemeToggleUI(theme) {
  const themeToggleBtn = document.getElementById("themeToggle");
  if (!themeToggleBtn) return;

  const icon = themeToggleBtn.querySelector("i");
  const isLight = theme === "light";
  themeToggleBtn.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme",
  );
  themeToggleBtn.setAttribute(
    "title",
    isLight ? "Switch to dark mode" : "Switch to light mode",
  );
  if (icon) {
    icon.className = isLight ? "fas fa-moon" : "fas fa-sun";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateThemeToggleUI(rootElement.getAttribute("data-theme") || "dark");
  const themeToggleBtn = document.getElementById("themeToggle");
  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = rootElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    rootElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    updateThemeToggleUI(nextTheme);
  });
});

// Loading Bar
window.addEventListener("load", () => {
  const loadingBar = document.getElementById("loadingBar");
  loadingBar.style.width = "100%";
  setTimeout(() => {
    loadingBar.style.opacity = "0";
    setTimeout(() => (loadingBar.style.display = "none"), 300);
  }, 500);
});

// Update loading bar on scroll
window.addEventListener("scroll", () => {
  const loadingBar = document.getElementById("loadingBar");
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  loadingBar.style.width = scrollPercent + "%";
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Mobile menu toggle
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
}

function closeMenu() {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  navMenu.classList.remove("active");
  menuToggle.classList.remove("active");
}

// Close menu on outside click
document.addEventListener("click", (e) => {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    closeMenu();
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Contact form submission
async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  submitBtn.disabled = true;
  submitBtn.innerHTML = "Sending... ⏳";
  submitBtn.style.opacity = "0.7";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      submitBtn.innerHTML = "✅ Sent!";
      submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = "";
        submitBtn.style.opacity = "1";
      }, 3000);
    } else {
      const errorMessage = result.error || "Form submission failed";
      throw new Error(errorMessage);
    }
  } catch (error) {
    submitBtn.innerHTML = `❌ ${error.message}`;
    submitBtn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.style.background = "";
      submitBtn.style.opacity = "1";
    }, 3000);

    console.error("Error:", error);
  } finally {
    submitBtn.disabled = false;
  }
}

// Add parallax effect to hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});
