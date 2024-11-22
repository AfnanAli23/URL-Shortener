// Variables
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navItem = document.querySelectorAll(".nav-item");
const urlInput = document.getElementById("url-input");
const form = document.forms.url_form;
const submitBtn = document.getElementById("submit-url");
const result = document.getElementById("result");
const errorBox = document.getElementById("error");

// Eventlistener to open/close mobile navigation menu
// hamburger.addEventListener("click", function () {
//   hamburger.classList.toggle("active");
//   navMenu.classList.toggle("active");
// });

// Eventlistener to close mobile navigation menu
// navItem.forEach((item) => {
//   item.addEventListener("click", function () {
//     hamburger.classList.remove("active");
//     navMenu.classList.remove("active");
//   });
// });

// Function that shows error
function showError(message, isSuccess) {
  const errorDiv = document.getElementById("error");
  errorDiv.textContent = message;
  errorDiv.style.color = isSuccess ? "green" : "red";
}

// Function that generates the resultCard containing short link

// const resultCard = function (link, shortLink) {
//   urlInput.value = "";
//   return `<div class="result-card col-12">
//                 <span class="result-url">${link}</span>
//                 <div class="short-link">
//                   <a href="${shortLink}" target="_blank">${shortLink}</a>
//                   <button class="main-btns copy-btn">Copy</button>
//                 </div>
//             </div>`;
// };
function resultCard(originalUrl, shortenedUrl) {
  return `
    <div class="result-card">
      <p>Original: <a href="${originalUrl}" target="_blank">${originalUrl}</a></p>
      <p>Shortened: <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a></p>
    </div>
  `;
}

// Function to generate shortLink
async function getShortLink() {
    const link = urlInput.value.trim();
  
    if (!link) {
      showError("Please add a valid link", false);
      return;
    }
  
    submitBtn.innerHTML = "Loading...";
  
    try {
      const response = await fetch("https://api.tinyurl.com/create", {
        method: "POST",
        headers: {
          "Authorization": "Bearer ldvd0OZQ1PrHZ18el5sqCh0YytU0ClnvXkHHz0dyWiMU7nJLE9hPUdUK03Ph",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        result.insertAdjacentHTML(
          "afterbegin",
          resultCard(link, data.data.tiny_url) // TinyURL's shortened URL field
        );
        showError("", true); // Clear any existing errors
      } else {
        showError(data.message || "Failed to shorten URL", false);
      }
    } catch (error) {
      console.error("Error fetching shortened URL:", error);
      showError("An error occurred. Please check your connection and try again.", false);
    } finally {
      submitBtn.innerHTML = "Shorten it!";
    }
  }

// EventListener to call the getShortLink() after the form is submitted

form.addEventListener("submit", function (event) {
  event.preventDefault();
  showError("", true);
  getShortLink();
});
submitBtn.addEventListener("click", getShortLink);

// Toggle error function to show error
function showError(content, toggleRemove) {
  if (!toggleRemove) {
    urlInput.classList.add("error-outline");
    errorBox.innerHTML = content;
    return;
  }

  urlInput.classList.remove("error-outline");
  errorBox.innerHTML = "";
}

// Copy to clipboard functionality
document.addEventListener("click", function (event) {
  if (!event.target.classList.contains("copy-btn")) return;

  const shortLink = event.target.parentNode.querySelector("a").href;

  navigator.clipboard.writeText(shortLink);

  event.target.classList.add("copied");
  event.target.textContent = "Copied!";

  setTimeout(() => {
    event.target.classList.remove("copied");
    event.target.textContent = "Copy";
  }, 2500);
});
