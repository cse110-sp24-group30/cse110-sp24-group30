window.addEventListener("DOMContentLoaded", init);

//TODO: adjust css to align with changes made

/**
 * Initializes the application.
 * Sets up task, journal, and calendar elements, populates the mood chart,
 * and adds event listeners for mood selection buttons.
 *
 * @async
 * @function init
 * @return {Promise<void>} A promise that resolves when initialization is complete.
 */
async function init() {
  try {
    const tasksData = getDoneTasks().length;
    const journalEntries = getJournals().length;
    const calEntries = getEvents().length;
    const taskElements = document.createElement("div");
    const journalElements = document.createElement("div");
    const calendarElements = document.createElement("div");

    taskElements.innerHTML = `<p>${tasksData}</p>`;
    journalElements.innerHTML = `<p>${journalEntries}</p>`;
    calendarElements.innerHTML = `<p>${calEntries}</p>`;

    document.getElementById("widget-todo").appendChild(taskElements);
    document.getElementById("widget-journal").appendChild(journalElements);
    document.getElementById("widget-calendar").appendChild(calendarElements);

    populateMoodChart();

    const moodSelection = document.getElementById("mood-today");
    moodSelection.innerHTML = `
          <h2>How are you feeling today?</h2>
          <button class="mood-button" data-mood="sad"> 
          <img src = "../source/assets/images/sad.png" alt = "sad"> 
          </button>

          <button class="mood-button" data-mood="neutral">
          <img src = "../source/assets/images/confused.png" alt = "neutral">
          </button>

          <button class="mood-button" data-mood="happy">
          <img src = "../source/assets/images/happy-face.png" alt = "happy">
          </button>
      `;

    document.querySelectorAll(".mood-button").forEach((button) => {
      button.addEventListener("click", () => {
        const selectedMood = button.getAttribute("data-mood");
        updateMoodChart(selectedMood);
      });
    });
  } catch (err) {
    console.log(`Error loading: ${err}`);
    return;
  }
}

/**
 * Populates the mood chart with days of the current month.
 * Colors the days based on saved moods from local storage.
 */
function populateMoodChart() {
  const moodChart = document.getElementById("mood-chart");
  const date = new Date();
  const month = date.getMonth(); // Get the current month (0-11)
  const year = date.getFullYear();

  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Calculate the day of the week the first day of the month falls on (0-6, starting with Monday)
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  moodChart.innerHTML =
    "<h3>Mood Chart - " +
    date.toLocaleString("default", { month: "long" }) +
    "</h3>";

  let boxes = 1;
  let weekRow;

  // Create empty cells for the days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    // Create a new row for the week if it is the first cell
    if (i == 0) {
      weekRow = document.createElement("div");
      weekRow.classList.add("week-row");
      moodChart.appendChild(weekRow);
    }

    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day-box");
    weekRow.appendChild(emptyCell);
    boxes++;
  }

  const savedMoods = JSON.parse(localStorage.getItem("moods") || "{}");

  // Create cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    // Start a new row for each week
    if ((boxes - 1) % 7 == 0) {
      weekRow = document.createElement("div");
      weekRow.classList.add("week-row");
      moodChart.appendChild(weekRow);
    }
    boxes++;

    const dayCell = document.createElement("div");
    dayCell.classList.add("day-box");
    dayCell.id = day;
    dayCell.textContent = day;
    weekRow.appendChild(dayCell);

    // Format the date string as YYYY-MM-DD
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // Set the background color of the cell if a mood is saved for this date
    if (savedMoods[dateString]) {
      const moodColors = {
        sad: "#063970",
        neutral: "#2187ab",
        happy: "#abdbe3",
      };
      dayCell.style.backgroundColor = moodColors[savedMoods[dateString]];
    }
  }
}

/**
 * Updates the mood chart with the selected mood for the current day.
 * Saves the updated mood to local storage.
 *
 * @param {string} mood - The mood selected (sad, neutral, or happy).
 */
function updateMoodChart(mood) {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  //Formatting this way to align with the format in localStorage
  const currentDate = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  const moodElement = document.getElementById(day);

  if (!moodElement) return;

  const moodColors = {
    sad: "#063970",
    neutral: "#2187ab",
    happy: "#abdbe3",
  };

  moodElement.style.backgroundColor = moodColors[mood];

  const moods = JSON.parse(localStorage.getItem("moods") || "{}");
  moods[currentDate] = mood;
  localStorage.setItem("moods", JSON.stringify(moods));
}

// JavaScript to handle the click event and redirection
document.querySelectorAll(".nav-element").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior

    // Set a timeout to show the loading screen if the page takes too long
    const loadingTimeout = setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "flex";
    }, 500); // Show loading screen if the page doesn't start loading within 500ms

    // Store the href attribute
    const targetUrl = this.querySelector("a").getAttribute("href");

    // Create a hidden iframe to detect when the page starts loading
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = targetUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      clearTimeout(loadingTimeout); // Clear the timeout if the page loads quickly
      window.location.href = targetUrl; // Proceed to the target URL
    };
  });
});

function getJournals() {
  return JSON.parse(localStorage.getItem("journal-list") || "[]");
}

function getEvents() {
  return JSON.parse(localStorage.getItem("events") || "[]");
}

function getDoneTasks() {
  return JSON.parse(localStorage.getItem("done") || "[]");
}

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
      window.location.href = "../source/login/login.html";
    });
  }
});
