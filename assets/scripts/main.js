window.addEventListener("DOMContentLoaded", init);

//TODO: add comments for jsdocs and inline comments
//TODO: adjust css to align with changes made
async function init() {
  try {
    const tasksData = 116; //TODO: update acc to todo
    const journalEntries = 30; //TODO: update acc to journal
    const calEntries = 11; //TODO: update acc to calendar
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
          <button class="mood-button" data-mood="sad">😞</button>
          <button class="mood-button" data-mood="neutral">😐</button>
          <button class="mood-button" data-mood="happy">😄</button>
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

function populateMoodChart() {
  const moodChart = document.getElementById("mood-chart");
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  moodChart.innerHTML =
    "<h3>Mood Chart - " +
    date.toLocaleString("default", { month: "long" }) +
    "</h3>";

  let boxes = 1;
  let weekRow;
  for (let i = 0; i < firstDay; i++) {
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

  for (let day = 1; day <= daysInMonth; day++) {
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

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
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

function updateMoodChart(mood) {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

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
