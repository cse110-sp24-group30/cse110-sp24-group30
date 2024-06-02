window.addEventListener('DOMContentLoaded', init);

/**
 * Main function that initializes every other function
 */
function init() {
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

    const journalTemplate = {
        id: Math.floor(Math.random() * 2000000),
        title: "",
        content: ""
    };

    const modalRef = document.getElementById('modal');

    if (existing) {
        journalList.forEach(journal => {
            journalID = createJournalElement(journal.id, journal.title,
                journal.content, modalRef);

            // Creating journal widget for existing journal
            createJournalWidget(journalContainer, journalID);
        });
    } else {
        journalID = createJournalElement(journalTemplate.id, journalTemplate.title,
            journalTemplate.content, modalRef);

        // Creating journal widget for new journal
        createJournalWidget(journalContainer, journalID);

        // Save new journal to localStorage
        journalList.push(journalTemplate);
        saveNotes(journalList);
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
 * Creates a "journal widget" to be displayed on the page
 * 
 * @param {HTMLElement} journalContainer - DOM element to display journals in
 * @param {Number} journalID - The journal's unique identifier
 */
function createJournalWidget(journalContainer, journalID) {
    const journalWidget = document.createElement('div');
    journalWidget.classList.add('journal-widget');
    // journalElementTest.textContent = 'Insert Title';
    const journalWidgetTitle = document.createElement('span')
    journalWidgetTitle.classList.add('journal-widget-title')
    journalWidgetTitle.textContent = 'Insert Title';
    journalWidget.append(journalWidgetTitle);
    journalWidget.setAttribute('widget-id', journalID);

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Create the 'Edit' button
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.className = 'fa fa-pencil';

    // Create the 'Delete' button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'fa fa-close';

    // Append buttons to the container
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    // Ensure the parent div has relative positioning
    journalWidget.style.position = 'relative';

    // Append the button container to the div
    journalWidget.append(buttonContainer);

    // Add event listener for double-click
    journalWidget.addEventListener('dblclick', openJournalModal);

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
 * Deletes a journal (of its content in localStorage and on the page)
 * 
 * @param {*} event - Event listener target
 */
function deleteJournal(event) {
    const widget = event.target.closest('.journal-widget');
    const currentJournalID = widget.getAttribute('widget-id');

    // Remove the journal element from the DOM
    widget.remove();

    // Remove the journal entry from localStorage
    const journalList = getJournals();
    const updatedJournalList = journalList.filter(journal => journal.id != currentJournalID);
    saveNotes(updatedJournalList);
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
 * Creates the section that will contain each journal's content
 * 
 * @param {Number} id 
 * @param {String} title 
 * @param {String} content
 * @param {HTMLElement} modalRef 
 * @returns {Number} - The journal's unique ID
 */
function createJournalElement(id, title, content, modalRef) {
    const journalBody = document.createElement('div');
    // const journalTitle = document.createElement('textarea');
    // const journalDocumentation = document.createElement('textarea');
    // const journalReflection = document.createElement('textarea');

    // IMPLEMENT:
    const markdownInput = document.createElement('textarea');
    const htmlOutput = document.createElement('div');

    markdownInput.classList.add('journal-markdownInput');
    htmlOutput.classList.add('journal-htmlOutput');

    markdownInput.placeholder = 'Input Markdown here';
    markdownInput.name = "markdownInput";
    markdownInput.rows = 25;
    markdownInput.cols = 50;

    // Live preview of markdown text to formatted html
    markdownInput.addEventListener('input', () => {
        let markdownText = markdownInput.value;
        let htmlContent = marked.parse(markdownText);
        htmlOutput.innerHTML = htmlContent;
    });

    if (getJournals() != 0) {
        markdownInput.value = content;
        let htmlContent = marked.parse(content);
        htmlOutput.innerHTML = htmlContent;
    }

    journalBody.append(markdownInput);
    journalBody.append(htmlOutput);

    
    
    // Add class names to elements
    // journalBody.className = 'journal-body';
    journalBody.classList.add('journal-entry');
    journalBody.id = `${id}`;
    // journalTitle.classList.add('journal-title');
    // journalDocumentation.classList.add('journal-documentation');
    // journalReflection.classList.add('journal-reflection');

    // // Change journal title accordingly
    // journalTitle.value = title;
    // journalTitle.placeholder = 'Insert title here';

    // // Change documentation accordingly
    // journalDocumentation.value = documentation;
    // journalDocumentation.placeholder = 'Insert documentation here';

    // // Change reflection accordingly
    // journalReflection.value = reflection;
    // journalReflection.placeholder = 'Insert reflection here';

    // Attach to journal element
    // journalBody.append(journalTitle);
    // journalBody.append(journalDocumentation);
    // journalBody.append(journalReflection);
    // journalBody.append(saveButton);

    
    // // Update the title in the journal widget as the user types
    // journalTitle.addEventListener('input', function() {
    //     var journalWidgetTitle = document.querySelector(`.journal-widget[widget-id="${id}"] .journal-widget-title`);
    //     if (journalWidgetTitle) {
    //         journalWidgetTitle.textContent = journalTitle.value || 'Insert Title';
    //     }
    // });


    // Attach to "pop-up" window
    modalRef.append(journalBody);

    // Initially create Save/Cancel Button
    if (!modalRef.querySelector('.save-cancel-container')) {
        createSaveCancelButtons(modalRef);
    }

    return journalBody.id;
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
function saveNotes(journals) {
    localStorage.setItem("journal-list", JSON.stringify(journals));
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

    cancelButton.addEventListener('click', closeJournalModal);
    
    // Create the 'Save' button
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.className = 'save-button';

    // Event listener for save button
    saveButton.addEventListener('click', saveContent);

    buttonContainer.append(saveButton);
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
                    "content": markdownInput.value
                };
            }
            return journal
        });

        saveNotes(updatedJournalList);
        alert("Saved!");
    }

    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    modal.style.display = 'none';
    
}