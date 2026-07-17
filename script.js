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

function initThemeToggle() {
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
}

function initLoadingBar() {
  window.addEventListener("load", () => {
    const loadingBar = document.getElementById("loadingBar");
    if (!loadingBar) return;

    loadingBar.style.width = "100%";
    setTimeout(() => {
      loadingBar.style.opacity = "0";
      setTimeout(() => (loadingBar.style.display = "none"), 300);
    }, 500);
  });

  window.addEventListener("scroll", () => {
    const loadingBar = document.getElementById("loadingBar");
    if (!loadingBar) return;

    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    loadingBar.style.width = `${scrollPercent}%`;
  });
}

function initNavbarScrollEffect() {
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const currentScroll = window.pageYOffset;
    navbar.classList.toggle("scrolled", currentScroll > 50);
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
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
}

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  if (!navMenu || !menuToggle) return;

  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
  menuToggle.setAttribute(
    "aria-expanded",
    navMenu.classList.contains("active") ? "true" : "false",
  );
}

function closeMenu() {
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  if (!navMenu || !menuToggle) return;

  navMenu.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  if (!menuToggle) return;

  menuToggle.setAttribute("aria-controls", "navMenu");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Toggle navigation menu");

  document.querySelectorAll("#navMenu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const navMenu = document.getElementById("navMenu");
    const menuToggleEl = document.getElementById("menuToggle");
    if (!navMenu || !menuToggleEl) return;

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedToggle = menuToggleEl.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      event.preventDefault();
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
}

function initScrollAnimations() {
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

  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function setFormStatus(statusEl, message, type) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("formStatus");
  if (!submitBtn) return;

  // --- INPUT FIELD SELECTIONS ---
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email") || form.querySelector('input[type="email"]');
  const messageInput = form.querySelector('textarea');
  const errorDiv = document.getElementById("error-message");

  // --- VALIDATION STAGE ---
  let hasError = false;

  // Reset old states
  if (nameInput) nameInput.classList.remove("input-error");
  if (emailInput) emailInput.classList.remove("input-error");
  if (messageInput) messageInput.classList.remove("input-error");
  if (errorDiv) errorDiv.style.display = "none";

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const projectType = document.getElementById("projectType")?.value || "Inquiry";
  const message = messageInput ? messageInput.value.trim() : "";

  if (!name) {
    if (nameInput) nameInput.classList.add("input-error");
    hasError = true;
  }
  if (!email) {
    if (emailInput) emailInput.classList.add("input-error");
    hasError = true;
  }
  if (!message) {
    if (messageInput) messageInput.classList.add("input-error");
    hasError = true;
  }

  // Halt form submission if validation fails
  if (hasError) {
    if (errorDiv) errorDiv.style.display = "block";
    return;
  }

  // --- ACCESS KEY STAGE ---
  const accessKey = document.getElementById("web3formsKey")?.value?.trim();
  if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    setFormStatus(
      statusEl,
      "Add your Web3Forms access key in index.html to enable email delivery.",
      "error",
    );
    return;
  }

  // --- SUBMISSION STAGE ---
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
  setFormStatus(statusEl, "", "");

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `Portfolio Inquiry: ${projectType}`,
        message: `Project Type: ${projectType}\n\n${message}`,
        from_name: "Tantoluwa Portfolio",
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success) {
      setFormStatus(
        statusEl,
        "Message sent successfully! I'll get back to you soon.",
        "success",
      );
      submitBtn.innerHTML =
        '<i class="fas fa-check" aria-hidden="true"></i> Sent!';
      form.reset();
    } else {
      throw new Error(result.message || "Form submission failed. Please try again.");
    }
  } catch (error) {
    setFormStatus(statusEl, error.message, "error");
    submitBtn.innerHTML =
      '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Try Again';
    console.error("Contact form error:", error);
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => {
      submitBtn.innerHTML = originalBtnHTML;
    }, 4000);
  }
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", handleContactSubmit);
}

function init() {
  initThemeToggle();
  initLoadingBar();
  initNavbarScrollEffect();
  initActiveNav();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initContactForm();
}

document.addEventListener("DOMContentLoaded", init);