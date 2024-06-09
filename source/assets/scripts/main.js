window.addEventListener("DOMContentLoaded", init);

function init() {
  const rootUrl = window.location.pathname.split("/").slice(0, 2).join("/");
  const protectedPaths = [
    rootUrl + "/dashboard/",
    rootUrl + "/dashboard/index.html",
    rootUrl + "/to_do/",
    rootUrl + "/to_do/to-do.html",
    rootUrl + "/journal/",
    rootUrl + "/journal/journal-page.html",
    rootUrl + "/calendar/calendar-page.html",
    rootUrl + "/calendar/",
  ];

  console.log(protectedPaths);
  console.log(localStorage.getItem("pinVerified"));
  const sourcePath = window.location.pathname;

  console.log(sourcePath);
  if (
    !sessionStorage.getItem("pinVerified") &&
    protectedPaths.includes(sourcePath)
  ) {
    console.log("got here");
    window.location.href = rootUrl + "/login/login.html";
  }
}
