window.addEventListener('DOMContentLoaded', init);

/**
 * Main function that initializes the journal page
 */
function init() {
    // JavaScript to handle the click event and redirection
    document.querySelectorAll('.nav-element').forEach(link => {
        link.addEventListener('click', function(event) {
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
    
    const journalContainer = document.getElementById('journal-app');
    const addButton = journalContainer.querySelector('.add-journal');
    const overlayRef = document.getElementById('overlay');
    const modalRef = document.getElementById('modal');

    addButton.addEventListener('click', () => addJournalNew(journalContainer, false));

    // When a user clicks "out" of the journal content/popup, it closes it
    overlayRef.addEventListener('click', () => {
        overlayRef.style.display = 'none';
        modalRef.style.display = 'none';
    });

    // Add saved journals from localStorage
    addJournalNew(journalContainer, true);
}

/**
 * Creates and displays journal(s) onto the page
 * 
 * @param {HTMLElement} journalContainer - DOM element to display journals in
 * @param {Boolean} existing - Displays existing journal(s) from localStorage if true
 */
function addJournalNew(journalContainer, existing) {
    const journalList = getJournals();
    let journalID = 0;
    let randomTitle = generateRandomTitle();

    const journalTemplate = {
        id: Math.floor(Math.random() * 2000000),
        title: randomTitle,
        content: `# ${randomTitle}`,
        date: getCurrentDate()
    };

    const modalRef = document.getElementById('modal');

    if (existing) {
        journalList.forEach(journal => {
            journalID = createJournalElement(journal.id, journal.title,
                journal.content, modalRef);

            // Creating journal widget for existing journal
            createJournalWidget(journalContainer, journalID, journal.content);
        });
    } else {
        journalID = createJournalElement(journalTemplate.id, journalTemplate.title,
            journalTemplate.content, modalRef);

        // Creating journal widget for new journal
        createJournalWidget(journalContainer, journalID, journalTemplate.content);

        // Save new journal to localStorage
        journalList.push(journalTemplate);
        saveJournals(journalList);
    }

    // Ensures save/cancel buttons always at the bottom
    if (!modalRef.querySelector('.save-cancel-container')) {
        createSaveCancelButtons(modalRef);
    } else {
        // Move save/cancel container to the end
        const buttonContainer = modalRef.querySelector('.save-cancel-container');
        modalRef.appendChild(buttonContainer);
    }
}

/**
 * Creates the "pop-up" that will contain each journal's content
 * 
 * @param {Number} id - The journal's unique ID
 * @param {String} title - The journal's title
 * @param {String} content - Existing journal content if any
 * @param {HTMLElement} modalRef - Reference to the modal element
 * @returns {Number} - The journal's unique ID
 */
function createJournalElement(id, title, content, modalRef) {
    const journalBody = document.createElement('div');
    const markdownInput = document.createElement('textarea');
    const htmlOutput = document.createElement('div');

    markdownInput.classList.add('journal-markdownInput');
    htmlOutput.classList.add('journal-htmlOutput');

    markdownInput.placeholder = 'Input Markdown here';
    markdownInput.name = "markdownInput";
    markdownInput.rows = 25;
    markdownInput.cols = 50;
    markdownInput.value = `# ${title}`;
    let htmlContent = marked.parse(markdownInput.value);
    htmlOutput.innerHTML = htmlContent;

    // Live preview of markdown text to formatted html
    markdownInput.addEventListener('input', () => {
        let markdownText = markdownInput.value;
        let htmlContent = marked.parse(markdownText);
        htmlOutput.innerHTML = htmlContent;

        // Update the title in the journal widget as the user types
        const firstHeader = getFirstHeader(markdownText);
        const journalWidgetTitle = document.querySelector(`.journal-widget[widget-id="${id}"] .journal-widget-title`);
        if (journalWidgetTitle) {
            widgetTitleLimit(firstHeader, journalWidgetTitle);
        }
    });

    // If existing journals, also update htmlOutput based from journal's markdownInput
    if (getJournals() != 0) {
        markdownInput.value = content;
        let htmlContent = marked.parse(content);
        htmlOutput.innerHTML = htmlContent;
    }

    journalBody.append(markdownInput);
    journalBody.append(htmlOutput);

    // Add class names to elements
    journalBody.classList.add('journal-entry');
    journalBody.id = `${id}`;

    // Attach to "pop-up" window
    modalRef.append(journalBody);

    // Initially create Save/Cancel Button
    if (!modalRef.querySelector('.save-cancel-container')) {
        createSaveCancelButtons(modalRef);
    }

    return journalBody.id;
}

/**
 * Creates a "journal widget" to be displayed on the page
 * 
 * @param {HTMLElement} journalContainer - DOM element to display journals in
 * @param {Number} journalID - The journal's unique identifier
 * @param {String} content - Existing journal content if any
 */
function createJournalWidget(journalContainer, journalID, content) {
    const journalWidget = document.createElement('div');
    journalWidget.classList.add('journal-widget');
    const journalWidgetTitle = document.createElement('span')
    journalWidgetTitle.classList.add('journal-widget-title')

    // Extract the first header title from the content
    const firstHeader = getFirstHeader(content);
    widgetTitleLimit(firstHeader, journalWidgetTitle);
    journalWidget.append(journalWidgetTitle);
    journalWidget.setAttribute('widget-id', journalID);

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Create the 'Edit' button
    const editButton = document.createElement('button');
    const editIcon = document.createElement("img");
    editIcon.src = "../assets/icons/editDarkBlue.png";
    editIcon.alt = "Edit Button";
    editButton.appendChild(editIcon);

    // Create the 'Delete' button
    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../assets/icons/trashDarkBlue.png";
    deleteIcon.alt = "Edit Button";
    deleteButton.appendChild(deleteIcon);

    // Append buttons to the container
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    // Ensure the parent div has relative positioning
    journalWidget.style.position = 'relative';

    // Append the button container to the div
    journalWidget.append(buttonContainer);

    // Add event listener for edit button click
    editButton.addEventListener('click', openJournalModal);

    // Add event listener for delete button click
    deleteButton.addEventListener('click', deleteJournal);

    journalContainer.append(journalWidget);
}

/**
 * Opens the "pop-up" when accessing a journal
 * 
 * @param {*} event - Event listener target
 */
function openJournalModal(event) {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    
    // Use closest to find the parent element with the journal-widget class
    const widget = event.target.closest('.journal-widget');
    const currentJournalID = widget.getAttribute('widget-id'); // Correctly get the widget-id
    updateWidgetDate(currentJournalID);

    const journalEntries = document.querySelectorAll('.journal-entry');
    hideOtherJournalEntries(journalEntries, currentJournalID);
    let modal = document.getElementById('modal');
    modal.style.display = 'block';
}

/**
 * Closes the "pop-up" when accessing a journal
 * 
 * @param {*} event - Event listener target
 */
function closeJournalModal(event) {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
}

/**
 * Deletes a journal (removes its content from localStorage and from the page)
 * 
 * @param {*} event - Event listener target
 */
function deleteJournal(event) {
    const widget = event.target.closest('.journal-widget');
    const currentJournalID = widget.getAttribute('widget-id');
    const entry = document.querySelector(`.journal-entry[id="${currentJournalID}"]`);

    // Remove the journal element from the DOM
    widget.remove();
    entry.remove();

    // Remove the journal entry from localStorage
    const journalList = getJournals();
    const updatedJournalList = journalList.filter(journal => journal.id != currentJournalID);
    saveJournals(updatedJournalList);
}

/**
 * Hides other journals' contents when focusing on a particular journal
 * 
 * @param {NodeList} journalEntries - NodeList of all journals
 * @param {Number} currentJournalID - Unique identifier to display only the particular journal
 */
function hideOtherJournalEntries(journalEntries, currentJournalID) {
    // Convert nodeList to array & loop through each journal entry
    let journalArray = [...journalEntries];
    journalArray.forEach(journal => {
        if (journal.id != currentJournalID) {
            journal.style.display = 'none';
        } else {
            journal.style.display = 'flex';
        }
    });
}

/**
 * Creates save/cancel buttons that are held in an container
 * 
 * @param {HTMLElement} modalRef - Reference to "modal" element
 */
function createSaveCancelButtons(modalRef) {
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'save-cancel-container';
    
    // Create 'Cancel' Button
    let cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.className = 'cancel-button';

    // Event listener for cancel button
    cancelButton.addEventListener('click', closeJournalModal);
    
    // Create the 'Save' button
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.className = 'save-button';

    // Event listener for save button
    saveButton.addEventListener('click', saveContent);

    // Create the 'Link to Calendar' button
    let linkCalendarButton = document.createElement('button');
    linkCalendarButton.innerText = 'Link to Calendar';
    linkCalendarButton.className = 'link-calendar-button';

    // Event listener for link button
    linkCalendarButton.addEventListener('click', linkCalendar);

    buttonContainer.append(saveButton);
    buttonContainer.append(linkCalendarButton);
    buttonContainer.append(cancelButton);
    modalRef.append(buttonContainer);
}

/**
 * When the save button is pressed, the active journal's content is saved into
 * localStorage
 * 
 * @param {*} event 
 */
function saveContent(event) {

    let modal = document.getElementById('modal');
    const activeJournal = modal.querySelector('.journal-entry:not([style*="display: none"])');

    if (activeJournal) {
        const markdownInput = activeJournal.querySelector('.journal-markdownInput');
        const journalList = getJournals();

        const updatedJournalList = journalList.map(journal => {
            if (journal.id == activeJournal.id) {
                return {
                    ...journal,
                    "title": getFirstHeader(markdownInput.value),
                    "content": markdownInput.value
                };
            }
            return journal
        });

        saveJournals(updatedJournalList);
        alert("Saved!");
    }

    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    modal.style.display = 'none';
    
}

/**
 * Extracts the first header title from the markdown content
 * 
 * @param {String} content - The markdown content 
 * @returns {String} - The first header title
 */
function getFirstHeader(content) {
    const headerMatch = content.match(/^#\s(.+)$/m);
    return headerMatch ? headerMatch[1] : null;
}

/**
 * Get all journals from localStorage
 * 
 * @returns {Array} - An array containing journals from localStorage
 */
function getJournals() {
    return JSON.parse(localStorage.getItem("journal-list") || "[]");
}

/**
 * Saves all journals into localStorage
 * 
 * @param {Array} journals - An array containing journals
 */
function saveJournals(journals) {
    localStorage.setItem("journal-list", JSON.stringify(journals));
}

/**
 * Filters the journals based on the search input.
 */
function searchJournals() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const journalWidgets = document.querySelectorAll('.journal-widget');
    journalWidgets.forEach(widget => {
        const title = widget.querySelector('.journal-widget-title').textContent.toLowerCase();
        if (title.includes(searchValue)) {
            widget.style.display = '';
        } else {
            widget.style.display = 'none';
        }
    });
}

/**
 * Generates a random title from a predefined list of titles
 * 
 * @returns {String} - A randomly selected title
 */
function generateRandomTitle() {
    const titles = [
        "A Day in the Life",
        "Reflections and Musings",
        "The Journey Begins",
        "Thoughts and Ideas",
        "Memories of Yesterday",
        "Random Ramblings",
        "Adventures Await",
        "Personal Journal",
        "Daily Diary",
        "Notes and Notions",
        "Life's Little Moments",
        "Mindful Musings",
        "Journey Through Time",
        "Captured Moments",
        "Whispers of the Heart",
        "Silent Reflections",
        "Dreams and Realities",
        "Echoes of the Past",
        "Future Visions",
        "Diary of Dreams",
        "Moments in Time",
        "Heartfelt Chronicles",
        "Inspiration and Imagination",
        "Soulful Scribbles",
        "The Writer's Corner",
        "Words from Within",
        "Tales Untold",
        "Life's Journey",
        "Thoughts Unveiled",
        "Pages of My Life",
        "Moments of Solitude",
        "Chronicles of Change",
        "Wandering Words",
        "Midnight Musings",
        "Reflections in Time",
        "Journey of Thoughts",
        "Silent Contemplations",
        "Ephemeral Moments",
        "Life's Reflections",
        "The Path Unseen",
        "Soulful Wanderings",
        "Fragments of Time",
        "Whispers of Wisdom",
        "Fleeting Thoughts",
        "Diary of Reflections",
        "Journeys in Words",
        "Timeless Thoughts",
        "Eternal Echoes",
        "Inner Reflections"
    ];
    const randomIndex = Math.floor(Math.random() * titles.length);
    return titles[randomIndex];
}

/**
 * Gets the current date of the user's system
 * 
 * @returns {String} - A readable string format to the year-month-day of the date
 */
function getCurrentDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Updates the "pop-up" date on the top right corner based on the current journal's date creation
 * 
 * @param {String} journalID - A journal's unique ID
 */
function updateWidgetDate(journalID) {
    const dateDisplay = document.getElementById('date-display');
    const journalList = getJournals();

    // Find the journal with the matching ID
    const journal = journalList.find(journal => journal.id == journalID);
    dateDisplay.innerText = journal.date;
}

/**
 * Prevents widget title from overflowing through the widget. Limits the displayed
 * title to be up to 27 characters long before adding a "..." at the end.
 * 
 * @param {String} firstHeader - The first header of the journal or the widget title
 * @param {HTMLElement} journalWidgetTitle - The HTML element of the widget title
 */
function widgetTitleLimit(firstHeader, journalWidgetTitle) {
    if (firstHeader.length >= 28) {
        let stringOverflow = firstHeader.substring(0, 28);
        stringOverflow += "...";
        journalWidgetTitle.textContent = stringOverflow;
    } else {
        journalWidgetTitle.textContent = firstHeader;
    }
}

/**
 * Links a journal to the calendar upon button press
 * 
 * TODO: link current journal to calendar day
 */
function linkCalendar() {
    
    // TODO:

    alert('Journal linked to calendar!');
}
