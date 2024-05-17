window.addEventListener('DOMContentLoaded', init);

// Main function that initializes every other function
function init() {
    const journalContainer = document.getElementById('journal-app');
    const addButton = journalContainer.querySelector('.add-journal');

    addButton.addEventListener('click', () => addJournalNew(journalContainer, false));

    // When a user clicks "out" of the journal content/popup, it closes it
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    });

    // Add saved journals from localStorage
    addJournalNew(journalContainer, true);
}

// Display the new journal element to the page
function addJournalNew(journalContainer, existing) {
    
    const journalList = getJournals();
    let journalID = 0;

    const journalTemplate = {
        id: Math.floor(Math.random() * 2000000),
        title: "",
        documentation: "",
        reflection: ""
    };
    
    const modalRef = document.getElementById('modal');

    if (existing) {
        
        journalList.forEach(journal => {
            journalID = createJournalElement(journal.id, journal.title, 
                journal.documentation, journal.reflection, modalRef);

                const journalElementTest = document.createElement('div');
                journalElementTest.classList.add('journal-widget');
                journalElementTest.textContent = 'Insert Title';
                journalElementTest.setAttribute('widget-id', journalID);

                // Create a container for the buttons
            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '5px';
            buttonContainer.style.right = '5px';
            
            // Create the 'Edit' button
            var editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.style.fontSize = '12px';
            editButton.style.padding = '5px 10px';
            editButton.style.marginRight = '5px';  // Space between buttons

            // Create the 'Delete' button
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.padding = '5px 10px';

            // Append buttons to the container
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Ensure the parent div has relative positioning
            journalElementTest.style.position = 'relative';

            // Append the button container to the div
            journalElementTest.append(buttonContainer);
            
                journalElementTest.addEventListener('dblclick', function(event) {
                    overlay.style.display = 'block';
                    const currentJournalID = event.target.getAttribute('widget-id');
                    const journalEntries = document.querySelectorAll('.journal-entry');
                    hideOtherJournalEntries(journalEntries, currentJournalID);
                    modal.style.display = 'block';
                });

                journalContainer.append(journalElementTest);
        });
    }
    else {
        journalID = createJournalElement(journalTemplate.id, journalTemplate.title, 
            journalTemplate.documentation, journalTemplate.reflection, modalRef);
            
            const journalElementTest = document.createElement('div');
            journalElementTest.classList.add('journal-widget');
            journalElementTest.textContent = 'Insert Title';
            journalElementTest.setAttribute('widget-id', journalID);

            // Create a container for the buttons
            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '5px';
            buttonContainer.style.right = '5px';
            
            // Create the 'Edit' button
            var editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.style.fontSize = '12px';
            editButton.style.padding = '5px 10px';
            editButton.style.marginRight = '5px';  // Space between buttons

            // Create the 'Delete' button
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.fontSize = '12px';
            deleteButton.style.padding = '5px 10px';

            // Append buttons to the container
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Ensure the parent div has relative positioning
            journalElementTest.style.position = 'relative';

            // Append the button container to the div
            journalElementTest.append(buttonContainer);
        
            journalElementTest.addEventListener('dblclick', function(event) {
                overlay.style.display = 'block';
                const currentJournalID = event.target.getAttribute('widget-id');
                const journalEntries = document.querySelectorAll('.journal-entry');
                hideOtherJournalEntries(journalEntries, currentJournalID);
                modal.style.display = 'block';
            });
            
            journalContainer.appendChild(journalElementTest);
            
            // Save new journal to localStorage
            journalList.push(journalTemplate);
            saveNotes(journalList);
    }

}

function editJournal() {

}


// Hides other journals' contents when focusing on a particular journal
function hideOtherJournalEntries(journalEntries, currentJournalID) {

    // Convert nodeList to array & loop through each journal entry
    let journalArray = [...journalEntries];
    journalArray.forEach(journal => {

        if (journal.id != currentJournalID) {
            journal.style.display = 'none';
        }
        else {
            journal.style.display = 'block';
        }
    });
}

// Creates a "sub-div" that will contain each journal's content
function createJournalElement(id, title, documentation, reflection, modalRef) {
    const journalBody = document.createElement('div'); // sub div per journal
    const journalTitle = document.createElement('textarea');
    const journalDocumentation = document.createElement('textarea');
    const journalReflection = document.createElement('textarea');
    
    journalBody.classList.add('journal-entry');
    journalBody.id = `${id}`;
    journalTitle.classList.add('journal-title');
    journalDocumentation.classList.add('journal-documentation');
    journalReflection.classList.add('journal-reflection');

    journalTitle.value = title;
    journalTitle.placeholder = 'Insert title here'

    journalDocumentation.value = documentation;
    journalDocumentation.placeholder = 'Insert documention here';

    journalReflection.value = reflection;
    journalReflection.placeholder = 'Insert reflection here';

    journalBody.append(journalTitle);
    journalBody.append(journalDocumentation);
    journalBody.append(journalReflection);

    modalRef.append(journalBody);

    return journalBody.id;
}

// Get all the journal entries from localStorage
function getJournals() {
    return JSON.parse(localStorage.getItem("journal-list") || "[]");
}

// Get a certain journal based on id
function getJournal(journals, id) {
    return journals.filter(journals => journals.id == id)[0];
}

// Saves all journal array to localStorage
function saveNotes(journals){
    localStorage.setItem("journal-list", JSON.stringify(journals));
}