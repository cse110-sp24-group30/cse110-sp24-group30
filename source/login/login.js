document.addEventListener("DOMContentLoaded", function () {
  const correctPin = "1234"; //TODO: Replace later
  const pinForm = document.getElementById("pin-form");

  // Check if the user is already authenticated
  if (sessionStorage.getItem("authenticated") === "true") {
    redirectToProtectedPage();
  }

  // Handle PIN form submission
  if (pinForm) {
    pinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const enteredPin = document.getElementById("pin").value;
      if (enteredPin === correctPin) {
        sessionStorage.setItem("authenticated", "true");
        redirectToProtectedPage();
      } else {
        alert("Invalid PIN. Please try again.");
      }
    });
  }

  function redirectToProtectedPage() {
    // Set a timeout to show the loading screen if the page takes too long
    const loadingTimeout = setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "flex";
    }, 500); // Show loading screen if the page doesn't start loading within 500ms

    // Create a hidden iframe to detect when the page starts loading
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "../index.html";
    document.body.appendChild(iframe);

    iframe.onload = () => {
      clearTimeout(loadingTimeout); // Clear the timeout if the page loads quickly
      window.location.href = "../index.html"; // Proceed to the target URL
    };
  }

  // Logout function to clear the session
  window.logout = function () {
    sessionStorage.removeItem("authenticated");
    const rootUrl =
      window.location.origin +
      window.location.pathname.split("/").slice(0, 2).join("/");
    window.location.href = rootUrl + "/login/login.html";
  };
});
