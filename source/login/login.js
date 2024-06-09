document.addEventListener("DOMContentLoaded", function () {
  const correctPin = "1234"; //TODO: need to decide what the pin is
  const pinForm = document.getElementById("pin-form");

  // Check if the user is already authenticated
  if (sessionStorage.getItem("pinVerified") === "true") {
    redirectToProtectedPage();
  }

  // Handle PIN form submission
  if (pinForm) {
    pinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const enteredPin = document.getElementById("pin").value;
      if (enteredPin === correctPin) {
        sessionStorage.setItem("pinVerified", "true");
        redirectToProtectedPage();
      } else {
        alert("Invalid PIN. Please try again.");
      }
    });
  }

  function redirectToProtectedPage() {
    window.location.href = "../dashboard/index.html";
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
