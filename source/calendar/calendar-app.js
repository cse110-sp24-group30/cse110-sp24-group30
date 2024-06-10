document.addEventListener("DOMContentLoaded", () => {
  const calendarGrid = document.getElementById("calendar-grid");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonth = document.getElementById("prev-month");
  const nextMonth = document.getElementById("next-month");
  const eventModal = document.getElementById("event-modal");
  const cancelButton = document.querySelector(".cancel-button");
  const eventForm = document.getElementById("event-form");
  const todayDateElement = document.getElementById("today-date");
  const todayEventsContainer = document.getElementById("today-events");
  const upcomingEventsContainer = document.getElementById("upcoming-events");
  const viewSelector = document.getElementById("view-selector");
  const searchBar = document.getElementById("search-bar");

  let currentDate = new Date();
  const today = new Date();
  let currentView = "month";

  eventModal.style.display = "none";

  /**
   * Renders the calendar based on the given date.
   * @param {Date} date - The date to render the calendar for.
   */
  const renderCalendar = (date) => {
    calendarGrid.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    currentMonthYear.textContent = `${date.toLocaleString("default", {
      month: "long",
    })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const events = getEvents();

    if (currentView != "day") {
      document.getElementById("day-view").style.display = "none";
      document.querySelector(".add-button").style.display = "none";
    } else {
      document.getElementById("day-view").style.display = "flex";
      document.querySelector(".add-button").style.display = "block";
    }

    if (currentView === "month") {
      renderMonthView(firstDayOfMonth, daysInMonth, month, year, events);
    } else if (currentView === "week") {
      renderWeekView(day, month, year, events);
    } else if (currentView === "day") {
      renderDayView(day, month, year, events);
    }

    renderTodaySection();
  };

  /**
   * Renders the month view of the calendar.
   *
   * @param {number} firstDayOfMonth - The index of the first day of the month (0-6).
   * @param {number} daysInMonth - The number of days in the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @param {Array} events - An array of events for the month.
   */
  const renderMonthView = (
    firstDayOfMonth,
    daysInMonth,
    month,
    year,
    events
  ) => {
    calendarGrid.classList.remove("week-view");
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      calendarGrid.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      if (
        year === today.getFullYear() &&
        month === today.getMonth() &&
        i === today.getDate()
      ) {
        dayElement.classList.add("current-day");
      }

      const eventForDay = events.filter(
        (event) =>
          event.date ===
          `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(
            2,
            "0"
          )}`
      );
      if (eventForDay.length > 0) {
        eventForDay.forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.classList.add("event", event.category);
          eventElement.textContent = event.title;
          dayElement.appendChild(eventElement);
        });
      }

      dayElement.addEventListener("click", () => {
        document.getElementById("event-id").value = "";
        document.getElementById("event-title").value = "";
        document.getElementById("event-category").value = "";
        document.getElementById("event-date").value = `${year}-${String(
          month + 1
        ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        document.getElementById("event-time").value = "23:59";
        document.getElementById("event-description").value = "";
        eventModal.style.display = "flex";
      });

      calendarGrid.appendChild(dayElement);
    }
  };

  /**
   * Renders the week view of the calendar.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11, where 0 is January and 11 is December).
   * @param {number} year - The year.
   * @param {Array} events - An array of events.
   */
  const renderWeekView = (day, month, year, events) => {
    calendarGrid.classList.add("week-view");
    const startOfWeek = new Date(year, month, day - today.getDay());
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = currentDay.getDate();

      if (currentDay.toDateString() === today.toDateString()) {
        dayElement.classList.add("current-day");
      }

      const eventForDay = events.filter(
        (event) => event.date === currentDay.toISOString().split("T")[0]
      );
      if (eventForDay.length > 0) {
        eventForDay.forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.classList.add("event", event.category);
          eventElement.innerHTML = `${
            event.title
          }<br><span class="event-time">${event.time || "N/A"}</span>`; // Show title and time with line break in week view
          dayElement.appendChild(eventElement);
        });
      }

      dayElement.addEventListener("click", () => {
        document.getElementById("event-id").value = "";
        document.getElementById("event-title").value = "";
        document.getElementById("event-category").value = "";
        document.getElementById("event-date").value = currentDay
          .toISOString()
          .split("T")[0];
        document.getElementById("event-time").value = "23:59";
        document.getElementById("event-description").value = "";
        eventModal.style.display = "flex";
      });

      calendarGrid.appendChild(dayElement);
    }
  };

  /**
   * Renders the day view of the calendar.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11, where 0 is January and 11 is December).
   * @param {number} year - The year.
   * @param {Array} events - An array of events for the specified day.
   */
  const renderDayView = (day, month, year, events) => {
    const dayViewContainer = document.getElementById("day-view");
    const hoursColumn = dayViewContainer.querySelector(".hours-column");
    const tasksColumn = dayViewContainer.querySelector(".tasks-column");
    const calendarHeader = document.getElementById("calendar-header");

    hoursColumn.innerHTML = ""; // Clear existing hours
    tasksColumn.innerHTML = ""; // Clear existing tasks

    // Generate the hours
    for (let i = 0; i < 24; i++) {
      const hourBlock = document.createElement("div");
      hourBlock.classList.add("hour-block");
      hourBlock.textContent = `${i}:00`;
      hoursColumn.appendChild(hourBlock);

      const taskBlock = document.createElement("div");
      taskBlock.classList.add("task-block");
      tasksColumn.appendChild(taskBlock);
    }

    const currentDay = new Date(year, month, day);
    const dayOfWeek = currentDay.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const formattedDate = currentDay.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Update the calendar header to show only the current day and date
    calendarHeader.querySelector(
      "h2"
    ).textContent = `${dayOfWeek}, ${formattedDate}`;

    const eventForDay = events.filter(
      (event) => event.date === currentDay.toISOString().split("T")[0]
    );

    // Group events by hour
    const eventsByHour = {};
    eventForDay.forEach((event) => {
      const hour = parseInt(event.time.split(":")[0], 10);
      if (!eventsByHour[hour]) {
        eventsByHour[hour] = [];
      }
      eventsByHour[hour].push(event);
    });

    // Render events for each hour
    for (let hour = 0; hour < 24; hour++) {
      if (eventsByHour[hour]) {
        const taskBlock = tasksColumn.children[hour];
        const numEvents = eventsByHour[hour].length;
        eventsByHour[hour].forEach((event) => {
          const eventElement = document.createElement("div");
          eventElement.classList.add("event", event.category);
          eventElement.textContent =
            event.title.length > 8
              ? event.title.slice(0, 8) + "..."
              : event.title; // Truncate long titles
          eventElement.style.width = `${100 / numEvents}%`;
          eventElement.title = `${event.title}\n${event.time}\n${event.description}`; // Tooltip with full details
          eventElement.addEventListener("click", () => {
            alert(
              `Title: ${event.title}\nTime: ${event.time}\nDescription: ${event.description}`
            );
          });
          taskBlock.appendChild(eventElement);
        });
        taskBlock.style.display = "flex"; // Make sure to display the task block as flex
      }
    }
  };

  // Event listeners for view changes
  viewSelector.addEventListener("change", (event) => {
    currentView = event.target.value;
    if (currentView === "day") {
      document.getElementById("day-view").style.display = "flex";
      document.querySelector(".add-button").style.display = "block";
      document.getElementById("calendar-grid").style.display = "none";
      document.getElementById("calendar-days").style.display = "none"; // Hide the week headers
      renderDayView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear(),
        getEvents()
      );
    } else {
      document.getElementById("day-view").style.display = "none";
      document.querySelector(".add-button").style.display = "none";
      document.getElementById("calendar-grid").style.display = "grid";
      document.getElementById("calendar-days").style.display = ""; // Show the week headers
      renderCalendar(currentDate);
    }
  });

  viewSelector.addEventListener("change", (event) => {
    currentView = event.target.value;
    if (currentView === "day") {
      document.getElementById("day-view").style.display = "flex";
      document.querySelector(".add-button").style.display = "block";
      document.getElementById("calendar-grid").style.display = "none";
      renderDayView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear(),
        getEvents()
      );
    } else {
      document.getElementById("day-view").style.display = "none";
      document.querySelector(".add-button").style.display = "none";
      document.getElementById("calendar-grid").style.display = "grid";
      renderCalendar(currentDate);
    }
  });

  viewSelector.addEventListener("change", (event) => {
    currentView = event.target.value;
    if (currentView === "day") {
      document.getElementById("day-view").style.display = "flex";
      document.querySelector(".add-button").style.display = "block";
      document.getElementById("calendar-grid").style.display = "none";
      document.getElementById("calendar-days").style.display = "none"; // Hide the week headers
      renderDayView(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear(),
        getEvents()
      );
    } else {
      document.getElementById("day-view").style.display = "none";
      document.querySelector(".add-button").style.display = "none";
      document.getElementById("calendar-grid").style.display = "grid";
      document.getElementById("calendar-days").style.display = "grid"; // Show the week headers
      renderCalendar(currentDate);
    }
  });

  /**
   * Renders the today section of the calendar app.
   */
  const renderTodaySection = () => {
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    todayDateElement.textContent = today.toLocaleDateString();

    const events = getEvents();
    const todayEvents = events.filter((event) => event.date === todayDate);

    todayEventsContainer.innerHTML = "";
    if (todayEvents.length > 0) {
      todayEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event", event.category);
        eventElement.innerHTML = `
          <strong>${event.title}</strong>
          <p>${event.description}</p>
          <button class="edit-button" data-id="${event.id}">
            <img src="../assets/icons/calendarEditBlue.png" alt="Edit">
          </button>
          <button class="delete-button" data-id="${event.id}">
            <img src="../assets/icons/calendarDeleteBlue.png" alt="Delete">
          </button>
        `;
        todayEventsContainer.appendChild(eventElement);
      });
    } else {
      todayEventsContainer.innerHTML = "<p>No events today.</p>";
    }

    // Add event listeners for edit and delete buttons
    document.querySelectorAll(".edit-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = event.target.closest("button").getAttribute("data-id");
        const events = getEvents();
        const eventToEdit = events.find((event) => event.id == id);
        if (eventToEdit) {
          document.getElementById("event-id").value = eventToEdit.id;
          document.getElementById("event-title").value = eventToEdit.title;
          document.getElementById("event-category").value =
            eventToEdit.category;
          document.getElementById("event-date").value = eventToEdit.date;
          document.getElementById("event-time").value =
            eventToEdit.time || "23:59";
          document.getElementById("event-description").value =
            eventToEdit.description;
          eventModal.style.display = "flex";
        }
      });
    });

    document.querySelector(".add-button").addEventListener("click", (event) => {
      let dateStr = currentMonthYear.innerText;

      dateStr = dateStr.split(", ").slice(1).join(", ");

      let dateObj = new Date(dateStr);

      let formattedDate =
        dateObj.getFullYear() +
        "-" +
        (dateObj.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        dateObj.getDate().toString().padStart(2, "0");

      document.getElementById("event-id").value = "";
      document.getElementById("event-title").value = "";
      document.getElementById("event-category").value = "";
      document.getElementById("event-date").value = formattedDate;
      document.getElementById("event-time").value = "23:59";
      document.getElementById("event-description").value = "";

      eventModal.style.display = "flex";
    });

    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = event.target.closest("button").getAttribute("data-id");
        deleteEvent(id);
      });
    });
  };

  prevMonth.addEventListener("click", () => {
    if (currentView === "month") {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView === "week") {
      currentDate.setDate(currentDate.getDate() - 7);
    } else if (currentView === "day") {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    renderCalendar(currentDate);
  });

  nextMonth.addEventListener("click", () => {
    if (currentView === "month") {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView === "week") {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (currentView === "day") {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    renderCalendar(currentDate);
  });

  viewSelector.addEventListener("change", (event) => {
    currentView = event.target.value;
    renderCalendar(currentDate);
  });

  window.addEventListener("click", (event) => {
    if (event.target == eventModal) {
      eventModal.style.display = "none";
    }
  });

  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    eventModal.style.display = "none";
  });

  eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = document.getElementById("event-id").value;
    const title = event.target["event-title"].value;
    const category = event.target["event-category"].value;
    const date = event.target["event-date"].value;
    const time = event.target["event-time"].value;
    const description = event.target["event-description"].value;

    if (id) {
      updateEvent({
        id,
        title,
        category,
        date,
        time,
        description,
      });
    } else {
      saveEvent({
        id: Date.now(),
        title,
        category,
        date,
        time,
        description,
      });
    }

    eventModal.style.display = "none";
    eventForm.reset();
    renderCalendar(currentDate);
    renderTodaySection();
  });

  /**
   * Saves an event to the local storage.
   * @param {Object} event - The event to be saved.
   */
  const saveEvent = (event) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));
  };

  /**
   * Retrieves the events from the local storage.
   * If no events are found, an empty array is returned.
   *
   * @returns {Array} The array of events retrieved from the local storage.
   */
  const getEvents = () => {
    return JSON.parse(localStorage.getItem("events") || "[]");
  };

  /**
   * Updates an event in the calendar.
   * @param {Object} updatedEvent - The updated event object.
   */
  const updateEvent = (updatedEvent) => {
    const events = getEvents();
    const index = events.findIndex((event) => event.id == updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      localStorage.setItem("events", JSON.stringify(events));
    }
  };

  /**
   * Deletes an event from the calendar.
   * @param {string} id - The ID of the event to be deleted.
   */
  const deleteEvent = (id) => {
    let events = getEvents();
    events = events.filter((event) => event.id != id);
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar(currentDate);
    renderTodaySection();
  };

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-button")) {
      const id = event.target.getAttribute("data-id");
      const events = getEvents();
      const eventToEdit = events.find((event) => event.id == id);
      if (eventToEdit) {
        document.getElementById("event-id").value = eventToEdit.id;
        document.getElementById("event-title").value = eventToEdit.title;
        document.getElementById("event-category").value = eventToEdit.category;
        document.getElementById("event-date").value = eventToEdit.date;
        document.getElementById("event-time").value =
          eventToEdit.time || "23:59";
        document.getElementById("event-description").value =
          eventToEdit.description;
        eventModal.style.display = "flex";
      }
    }

    if (event.target.classList.contains("delete-button")) {
      const id = event.target.getAttribute("data-id");
      deleteEvent(id);
    }
  });

  searchBar.addEventListener("input", (event) => {
    //Hide the day view, make the calendar-grid visible, and hide the week headers
    document.getElementById("day-view").style.display = "none";
    document.querySelector(".add-button").style.display = "none";
    document.getElementById("calendar-grid").style.display = "grid";
    document.getElementById("calendar-days").style.display = "none";

    const query = event.target.value.toLowerCase();
    const events = getEvents();

    if (query == "") {
      if (currentView === "day") {
        document.getElementById("day-view").style.display = "flex";
        document.querySelector(".add-button").style.display = "block";
      }

      renderCalendar(currentDate);
    } else {
      const filteredEvents = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );

      renderFilteredEvents(filteredEvents);
    }
  });

  /**
   * Renders the filtered events on the calendar grid.
   *
   * @param {Array} events - The array of events to be rendered.
   */
  const renderFilteredEvents = (events) => {
    calendarGrid.innerHTML = "Search results:";
    events.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event", event.category);
      eventElement.classList.add("results");
      eventElement.textContent = event.title;
      calendarGrid.appendChild(eventElement);

      eventElement.addEventListener("click", (event) => {
        const events = getEvents();

        const eventName = event.target.innerHTML;

        const selectedEvent = events.find((event) => event.title === eventName);

        const id = selectedEvent.id;

        if (selectedEvent) {
          document.getElementById("event-id").value = selectedEvent.id;
          document.getElementById("event-title").value = selectedEvent.title;
          document.getElementById("event-category").value =
            selectedEvent.category;
          document.getElementById("event-date").value = selectedEvent.date;
          document.getElementById("event-time").value =
            selectedEvent.time || "23:59";
          document.getElementById("event-description").value =
            selectedEvent.description;
          eventModal.style.display = "flex";
        }
      });
    });
  };

  renderCalendar(currentDate);
});
