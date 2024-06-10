window.addEventListener("DOMContentLoaded", init);

function init() {
  const rootUrl = window.location.pathname.split("/").slice(0, 2).join("/");
  const protectedPaths = [
    rootUrl + "/",
    rootUrl + "/index.html",
    rootUrl + "/to_do/",
    rootUrl + "/to_do/to-do.html",
    rootUrl + "/journal/",
    rootUrl + "/journal/journal-page.html",
    rootUrl + "/calendar/calendar-page.html",
    rootUrl + "/calendar/",
    "https://cse110-sp24-group30.github.io/cse110-sp24-group30/source/calendar/calendar-page.html",
    "https://cse110-sp24-group30.github.io/cse110-sp24-group30/source/to_do/to-do.html",
    "https://cse110-sp24-group30.github.io/cse110-sp24-group30/source/journal/journal-page.html",
    "https://cse110-sp24-group30.github.io/cse110-sp24-group30/source/index.html",
  ];
  const sourcePath = window.location.pathname;
  console.log("current path is: " + sourcePath);
  console.log("is verified: " + sessionStorage.getItem("pinVerified"));
  if (
    !sessionStorage.getItem("pinVerified") &&
    protectedPaths.includes(sourcePath)
  ) {
    console.log("got here");
    window.location.href = rootUrl + "/login/login.html";
  }
}
