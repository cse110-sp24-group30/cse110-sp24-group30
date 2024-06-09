// JavaScript to handle the click event and redirection
document.querySelectorAll('.nav-element').forEach(link => {
  link.addEventListener('click', function(event) {
    console.log('Link clicked'); 
      event.preventDefault(); // Prevent the default link behavior
      
      // Set a timeout to show the loading screen if the page takes too long
      const loadingTimeout = setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'flex';
    }, 500); // Show loading screen if the page doesn't start loading within 500ms

    // Store the href attribute
    const targetUrl = this.querySelector('a').getAttribute('href');  

    // Create a hidden iframe to detect when the page starts loading
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = targetUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      clearTimeout(loadingTimeout); // Clear the timeout if the page loads quickly
      window.location.href = targetUrl; // Proceed to the target URL
    };
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const calendarGrid = document.getElementById("calendar-grid");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonth = document.getElementById("prev-month");
  const nextMonth = document.getElementById("next-month");
  const eventModal = document.getElementById("event-modal");
  const closeButton = document.querySelector(".close-button");
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

    if (currentView === "month") {
      renderMonthView(firstDayOfMonth, daysInMonth, month, year, events);
    } else if (currentView === "week") {
      renderWeekView(day, month, year, events);
    } else if (currentView === "day") {
      renderDayView(day, month, year, events);
    }

    renderTodaySection();
    renderUpcomingSection();
  };

  const renderMonthView = (
    firstDayOfMonth,
    daysInMonth,
    month,
    year,
    events
  ) => {
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
        document.getElementById("event-time").value = "";
        document.getElementById("event-recurrence").value = "none";
        document.getElementById("event-description").value = "";
        document.getElementById("event-reminder").value = "";
        eventModal.style.display = "flex";
      });

      calendarGrid.appendChild(dayElement);
    }
  };

  const renderWeekView = (day, month, year, events) => {
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
          eventElement.textContent = event.title;
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
        document.getElementById("event-time").value = "";
        document.getElementById("event-recurrence").value = "none";
        document.getElementById("event-description").value = "";
        document.getElementById("event-reminder").value = "";
        eventModal.style.display = "flex";
      });

      calendarGrid.appendChild(dayElement);
    }
  };

  const renderDayView = (day, month, year, events) => {
    const currentDay = new Date(year, month, day);
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = currentDay.toDateString();

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
        eventElement.textContent = event.title;
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
      document.getElementById("event-time").value = "";
      document.getElementById("event-recurrence").value = "none";
      document.getElementById("event-description").value = "";
      document.getElementById("event-reminder").value = "";
      eventModal.style.display = "flex";
    });

    calendarGrid.appendChild(dayElement);
  };

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
                    <button class="edit-button" data-id="${event.id}">Edit</button>
                    <button class="delete-button" data-id="${event.id}">Delete</button>
                `;
        todayEventsContainer.appendChild(eventElement);
      });
    } else {
      todayEventsContainer.innerHTML = "<p>No events today.</p>";
    }
  };

  const renderUpcomingSection = () => {
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const events = getEvents();
    const upcomingEvents = events.filter((event) => event.date > todayDate);
    upcomingEventsContainer.innerHTML = "";
    if (upcomingEvents.length > 0) {
      upcomingEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event", event.category);
        eventElement.innerHTML = `
                        <strong>${event.title}</strong>
                        <p>${event.description}</p>
                        <button class="edit-button" data-id="${event.id}">Edit</button>
                        <button class="delete-button" data-id="${event.id}">Delete</button>
                    `;
        upcomingEventsContainer.appendChild(eventElement);
      });
    } else {
      upcomingEventsContainer.innerHTML = "<p>No upcoming events.</p>";
    }
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

  closeButton.addEventListener("click", () => {
    eventModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == eventModal) {
      eventModal.style.display = "none";
    }
  });

  eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = document.getElementById("event-id").value;
    const title = event.target["event-title"].value;
    const category = event.target["event-category"].value;
    const date = event.target["event-date"].value;
    const time = event.target["event-time"].value;
    const recurrence = event.target["event-recurrence"].value;
    const description = event.target["event-description"].value;
    const reminder = event.target["event-reminder"].value;

    if (id) {
      updateEvent({
        id,
        title,
        category,
        date,
        time,
        recurrence,
        description,
        reminder,
      });
    } else {
      saveEvent({
        id: Date.now(),
        title,
        category,
        date,
        time,
        recurrence,
        description,
        reminder,
      });
    }

    eventModal.style.display = "none";
    eventForm.reset();
    renderCalendar(currentDate);
    renderTodaySection();
    renderUpcomingSection();
  });

  const saveEvent = (event) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));
  };

  const getEvents = () => {
    return JSON.parse(localStorage.getItem("events") || "[]");
  };

  const updateEvent = (updatedEvent) => {
    const events = getEvents();
    const index = events.findIndex((event) => event.id == updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      localStorage.setItem("events", JSON.stringify(events));
    }
  };

  const deleteEvent = (id) => {
    let events = getEvents();
    events = events.filter((event) => event.id != id);
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar(currentDate);
    renderTodaySection();
    renderUpcomingSection();
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
        document.getElementById("event-time").value = eventToEdit.time || "";
        document.getElementById("event-recurrence").value =
          eventToEdit.recurrence || "none";
        document.getElementById("event-description").value =
          eventToEdit.description;
        document.getElementById("event-reminder").value =
          eventToEdit.reminder || "";
        eventModal.style.display = "flex";
      }
    }

    if (event.target.classList.contains("delete-button")) {
      const id = event.target.getAttribute("data-id");
      deleteEvent(id);
    }
  });

  searchBar.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const events = getEvents();
    const filteredEvents = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
    );
    renderFilteredEvents(filteredEvents);
  });

  const renderFilteredEvents = (events) => {
    calendarGrid.innerHTML = "Search results:";
    events.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event", event.category);
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
            selectedEvent.time || "";
          document.getElementById("event-recurrence").value =
            selectedEvent.recurrence || "none";
          document.getElementById("event-description").value =
            selectedEvent.description;
          document.getElementById("event-reminder").value =
            selectedEvent.reminder || "";
          eventModal.style.display = "flex";
        }
      });
    });
  };

  renderCalendar(currentDate);
});

// Added event listener for category filter
categoryFilter.addEventListener("change", (event) => {
  const category = event.target.value;
  const events = getEvents();
  const filteredEvents = category === "all" ? events : events.filter((event) => event.category === category);
  renderFilteredEvents(filteredEvents);
});

// Modified renderFilteredEvents function to display search results
const renderFilteredEvents = (events) => {
  calendarGrid.innerHTML = "Search results:";
  events.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event", event.category);
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
              document.getElementById("event-category").value = selectedEvent.category;
              document.getElementById("event-date").value = selectedEvent.date;
              document.getElementById("event-time").value = selectedEvent.time || "";
              document.getElementById("event-recurrence").value = selectedEvent.recurrence || "none";
              document.getElementById("event-description").value = selectedEvent.description;
              document.getElementById("event-reminder").value = selectedEvent.reminder || "";
              eventModal.style.display = "flex";
          }
      });
  });
};

// Added variable for category filter
const categoryFilter = document.getElementById("category-filter");




