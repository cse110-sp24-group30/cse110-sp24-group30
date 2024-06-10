document.addEventListener("DOMContentLoaded", function () {
  const rootUrl =
    window.location.origin +
    window.location.pathname.split("/").slice(0, 2).join("/");
  const protectedKeyWords = [
    "calendar",
    "journal",
    "dashboard",
    "todo",
    "to_do",
  ];

  const sourcePath = window.location.pathname;
  if (
    !sessionStorage.getItem("pinVerified") &&
    protectedKeyWords.some((substring) => sourcePath.includes(substring))
  ) {
    window.location.href = rootUrl + "source/login/login.html";
  }
  let correctPin;
  const pinForm = document.getElementById("pin-form");
  const feedbackMessage = document.getElementById("feedback-message");
  const spinner = document.getElementById("spinner");
  const togglePinVisibilityBtn = document.getElementById(
    "toggle-pin-visibility"
  );
  const memeContainer = document.getElementById("meme-container");
  const memeImage = document.getElementById("meme");
  const newMemeBtn = document.getElementById("new-meme");
  // Fetch the PIN from config.json
  fetch("config.json")
    .then((response) => response.json())
    .then((data) => {
      correctPin = data.pin;

      // Check if the user is already authenticated
      if (sessionStorage.getItem("pinVerified") === "true") {
        redirectToProtectedPage();
      }

      // Handle PIN form submission
      if (pinForm) {
        pinForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const enteredPin = document.getElementById("pin").value;
          const rememberMe = document.getElementById("remember-me").checked;
          showSpinner(); //

          // Simulate network delay for PIN verification
          setTimeout(() => {
            if (enteredPin === correctPin) {
              sessionStorage.setItem("pinVerified", "true");
              if (rememberMe) {
                localStorage.setItem("pinVerified", "true");
              }
              showFeedback("Access Granted!", "success");
              setTimeout(redirectToProtectedPage, 1000); // delay for showing success message
            } else {
              showFeedback("Invalid PIN. Please try again.", "error");
            }
            hideSpinner();
          }, 1000); // Simulate network delay
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching the PIN:", error);
    });

  // Redirect to the protected page (dashboard)
  function redirectToProtectedPage() {
    window.location.href = rootUrl + "/index.html";
  }

  // Show the loading spinner
  function showSpinner() {
    spinner.style.display = "block";
  }

  // Hide the loading spinner
  function hideSpinner() {
    spinner.style.display = "none";
  }

  // Show feedback message
  function showFeedback(message, type) {
    //
    feedbackMessage.textContent = message;
    feedbackMessage.className = type; // Add the class based on type (success or error)
  }
  // Toggle PIN visibility
  togglePinVisibilityBtn.addEventListener("click", function () {
    const pinInput = document.getElementById("pin");
    if (pinInput.type === "password") {
      pinInput.type = "text";
      togglePinVisibilityBtn.classList.remove("show");
      togglePinVisibilityBtn.classList.add("hide");
    } else {
      pinInput.type = "password";
      togglePinVisibilityBtn.classList.remove("hide");
      togglePinVisibilityBtn.classList.add("show");
    }
  });

  // Logout function to clear the session
  window.logout = function () {
    sessionStorage.removeItem("pinVerified");
    localStorage.removeItem("pinVerified");
    const rootUrl =
      window.location.origin +
      window.location.pathname.split("/").slice(0, 2).join("/");
    window.location.href = rootUrl + "/login/login.html";
  };

  // Fetch a random meme from the API
  function loadRandomMeme() {
    fetch("https://meme-api.com/gimme") // Using a meme API here
      .then((response) => response.json())
      .then((data) => {
        memeImage.src = data.url;
      })
      .catch((error) => {
        console.error("Error fetching the meme:", error);
      });
  }
  loadRandomMeme(); // Added this line to load a meme on page load
  // Load a new meme when the "New Meme" button is clicked
  newMemeBtn.addEventListener("click", loadRandomMeme);
});
