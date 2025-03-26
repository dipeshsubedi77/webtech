// DOM Elements
const themeToggle = document.getElementById("checkbox")
const body = document.body
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")
const filterBtns = document.querySelectorAll(".filter-btn")
const portfolioGrid = document.querySelector(".portfolio-grid")
const portfolioItems = document.querySelectorAll(".portfolio-item")
const testimonialSlides = document.querySelectorAll(".testimonial-slide")
const dots = document.querySelectorAll(".dot")
const prevBtn = document.querySelector(".prev-testimonial")
const nextBtn = document.querySelector(".next-testimonial")
const contactForm = document.getElementById("contactForm")
const revealElements = document.querySelectorAll(".reveal-left, .reveal-right, .reveal-up")

// Theme Toggle
function setTheme(isDark) {
  if (isDark) {
    body.classList.add("dark-theme")
    localStorage.setItem("theme", "dark")
  } else {
    body.classList.remove("dark-theme")
    localStorage.setItem("theme", "light")
  }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark") {
  themeToggle.checked = true
  setTheme(true)
} else if (savedTheme === "light") {
  themeToggle.checked = false
  setTheme(false)
} else {
  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  themeToggle.checked = prefersDark
  setTheme(prefersDark)
}

themeToggle.addEventListener("change", function () {
  setTheme(this.checked)
})

// Mobile Menu Toggle
menuToggle.addEventListener("click", function () {
  this.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close menu when clicking on a nav link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Load portfolio items from localStorage
function loadPortfolioItems() {
  if (!portfolioGrid) return

  // Get portfolio items from localStorage
  const portfolioItems = JSON.parse(localStorage.getItem("portfolioItems")) || []

  // If there are no items in localStorage, keep the default items
  if (portfolioItems.length === 0) return

  // Clear existing items
  portfolioGrid.innerHTML = ""

  // Add items from localStorage
  portfolioItems.forEach((item) => {
    const portfolioItem = document.createElement("div")
    portfolioItem.className = `portfolio-item ${item.category}`
    portfolioItem.setAttribute("data-category", item.category)

    portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.title}">
                <div class="portfolio-overlay">
                    <div class="portfolio-info">
                        <h3>${item.title}</h3>
                        <p>${getCategoryName(item.category)}</p>
                        <a href="#" class="portfolio-link"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </div>
            </div>
        `

    portfolioGrid.appendChild(portfolioItem)
  })

  // Re-initialize portfolio filter
  initPortfolioFilter()
}

// Helper function to get category display name
function getCategoryName(category) {
  switch (category) {
    case "ui-ux":
      return "UI/UX Design"
    case "branding":
      return "Branding"
    case "thumbnails":
      return "YouTube Thumbnail"
    case "illustration":
      return "Illustration"
    default:
      return category
  }
}

// Portfolio Filter
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      btn.classList.add("active")

      // Get filter value
      const filter = btn.getAttribute("data-filter")

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Initialize portfolio filter
initPortfolioFilter()

// Testimonial Slider
let currentSlide = 0

function showSlide(n) {
  // Hide all slides
  testimonialSlides.forEach((slide) => {
    slide.classList.remove("active")
  })

  // Remove active class from all dots
  dots.forEach((dot) => {
    dot.classList.remove("active")
  })

  // Show the current slide and activate the corresponding dot
  testimonialSlides[n].classList.add("active")
  dots[n].classList.add("active")
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % testimonialSlides.length
  showSlide(currentSlide)
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length
  showSlide(currentSlide)
}

// Event listeners for testimonial controls
if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", nextSlide)
  prevBtn.addEventListener("click", prevSlide)

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index
      showSlide(currentSlide)
    })
  })

  // Auto slide every 5 seconds
  setInterval(nextSlide, 5000)

  // Initialize the first testimonial slide
  showSlide(currentSlide)
}

// Contact Form Submission
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    // Here you would typically send the form data to a server
    // For this example, we'll just log it to the console
    console.log("Form submitted:", { name, email, subject, message })

    // Show success message (in a real application)
    alert("Thank you for your message! I will get back to you soon.")

    // Reset form
    contactForm.reset()
  })
}

// Scroll Animations
function revealOnScroll() {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (elementTop < windowHeight - 100) {
      element.classList.add("active")
    }
  })
}

// Initial check on page load
revealOnScroll()

// Check on scroll
window.addEventListener("scroll", revealOnScroll)

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Adjust for header height
        behavior: "smooth",
      })
    }
  })
})

// Active navigation based on scroll position
function setActiveNav() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-menu a")

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

window.addEventListener("scroll", setActiveNav)

// Load portfolio items when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolioItems()
})

