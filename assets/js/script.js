'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// email copy to clipboard functionality
const emailCopyBtn = document.querySelector("[data-copy-email]");

if (emailCopyBtn) {
  emailCopyBtn.addEventListener("click", function () {
    const email = this.dataset.copyEmail;
    navigator.clipboard.writeText(email).then(function () {
      // Visual feedback - change text temporarily
      const originalText = emailCopyBtn.textContent;
      emailCopyBtn.textContent = "Copied!";
      setTimeout(function () {
        emailCopyBtn.textContent = originalText;
      }, 2000);
    }).catch(function (err) {
      console.error("Failed to copy email: ", err);
    });
  });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSubscribers = document.querySelector("[data-modal-subscribers]");
const modalText = document.querySelector("[data-modal-text]");
const modalReviewDate = document.querySelector("[data-modal-review-date]");
const modalRating = document.querySelector("[data-modal-rating]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalSubscribers.textContent = this.dataset.subscriberCount || "Subscriber count unavailable";
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    modalReviewDate.textContent = this.dataset.reviewDate || "Review date unavailable";

    const rating = Math.min(5, Math.max(4, Number(this.dataset.reviewRating) || 5));
    modalRating.replaceChildren();

    for (let starIndex = 1; starIndex <= 5; starIndex++) {
      const star = document.createElement("ion-icon");
      star.name = "star";
      star.setAttribute("aria-hidden", "true");

      if (starIndex > rating) star.classList.add("modal-rating-muted");

      modalRating.appendChild(star);
    }

    modalRating.setAttribute("aria-label", `${rating} out of 5 stars`);

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// portfolio lightbox variables
const portfolioLightbox = document.querySelector("[data-portfolio-lightbox]");
const portfolioLightboxImg = document.querySelector("[data-portfolio-lightbox-img]");
const portfolioLightboxClose = document.querySelector("[data-portfolio-lightbox-close]");
const portfolioLightboxOverlay = document.querySelector("[data-portfolio-lightbox-overlay]");
const portfolioLinks = document.querySelectorAll(".project-item > a");

const openPortfolioLightbox = function (imgSrc, altText) {
  portfolioLightboxImg.src = imgSrc;
  portfolioLightboxImg.alt = altText;
  portfolioLightbox.classList.add("active");
};

const closePortfolioLightbox = function () {
  portfolioLightbox.classList.remove("active");
};

for (let i = 0; i < portfolioLinks.length; i++) {
  portfolioLinks[i].addEventListener("click", function (event) {
    event.preventDefault();

    const projectImg = this.querySelector("img");
    if (projectImg) {
      openPortfolioLightbox(projectImg.src, projectImg.alt);
    }
  });
}

portfolioLightboxClose.addEventListener("click", closePortfolioLightbox);
portfolioLightboxOverlay.addEventListener("click", closePortfolioLightbox);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePortfolioLightbox();
  }
});

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// contact form submission with Web3Forms
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Clear previous status message
  formStatus.textContent = "";
  formStatus.classList.remove("active");

  // Disable button and show "Sending..."
  const originalButtonText = formBtn.querySelector("span").textContent;
  formBtn.setAttribute("disabled", "");
  formBtn.querySelector("span").textContent = "Sending...";

  try {
    // Create FormData from the form
    const formData = new FormData(this);

    // Send to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      // Success response
      formStatus.textContent = "Message sent successfully!";
      formStatus.classList.add("active");
      
      // Clear form
      form.reset();
      
      // Disable button until form is filled again
      formBtn.setAttribute("disabled", "");
    } else {
      // Error response from server
      formStatus.textContent = "Something went wrong. Please try again.";
      formStatus.classList.add("active");
      formBtn.removeAttribute("disabled");
    }
  } catch (error) {
    // Network error or other issues
    formStatus.textContent = "Unable to send your message. Please check your connection and try again.";
    formStatus.classList.add("active");
    formBtn.removeAttribute("disabled");
    console.error("Form submission error:", error);
  }

  // Restore button text
  formBtn.querySelector("span").textContent = originalButtonText;
});



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}