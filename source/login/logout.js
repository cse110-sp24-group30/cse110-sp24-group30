// JavaScript to handle the click event for the logout link
document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior

      // Clear session and local storage
      sessionStorage.removeItem("pinVerified");
      localStorage.removeItem("pinVerified");

      // Redirect to the login page
      window.location.href = "../login/login.html";
    });
  }
});
