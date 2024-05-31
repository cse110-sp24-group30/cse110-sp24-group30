document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonth = document.getElementById('prev-month');
    const nextMonth = document.getElementById('next-month');
    const eventModal = document.getElementById('event-modal');
    const closeButton = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');

    let currentDate = new Date();

    const renderCalendar = (date) => {
        calendarGrid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        currentMonthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;

            dayElement.addEventListener('click', () => {
                document.getElementById('event-date').value = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                eventModal.style.display = 'block';
            });

            calendarGrid.appendChild(dayElement);
        }
    };

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    closeButton.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == eventModal) {
            eventModal.style.display = 'none';
        }
    });

    eventForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = event.target['event-title'].value;
        const date = event.target['event-date'].value;
        const description = event.target['event-description'].value;

        saveEvent({ title, date, description });

        eventModal.style.display = 'none';
        eventForm.reset();
        renderCalendar(currentDate);
    });

    const saveEvent = (event) => {
        const events = getEvents();
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
    };

    const getEvents = () => {
        return JSON.parse(localStorage.getItem('events') || '[]');
    };

    renderCalendar(currentDate);
});
