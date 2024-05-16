window.addEventListener('DOMContentLoaded', init);

let noteCount = 0;

// Main function that initializes every other function
function init() {
    const journalContainer = document.getElementById('journal-app');
    const addButton = journalContainer.querySelector('.add-journal');

    // IMPLEMENT:
    // addButton.addEventListener('click', () => {
    //     overlay.style.display = 'block';
    //     modal.style.display = 'block';
    //     journalContent.value = '';
    // });
    addButton.addEventListener('click', () => addJournalNew(journalContainer));

    // IMPLEMENT:
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
    });

    // addButton.addEventListener('click', () => addJournal(journalContainer))

    // getJournals().forEach(entry => {
    //     const journalElement = createJournalElement(entry.id, entry.title, entry.documentation, entry.reflection);

    //     journalContainer.append(journalElement);
    //     noteCount++;
    // });
}

// Display the new journal element to the page
function addJournalNew(journalContainer) {
    const journalTemplate = {
        id: Math.floor(Math.random() * 2000000),
        title: "",
        documentation: "",
        reflection: ""
    };
    
    const modalRef = document.getElementById('modal');

    const journalID = createJournalElementNew(journalTemplate.id, journalTemplate.title, 
        journalTemplate.documentation, journalTemplate.reflection, modalRef);
    
    const journalElementTest = document.createElement('div');
    journalElementTest.classList.add('journal-widget');
    journalElementTest.textContent = 'Placeholder Title';
    //journalElementTest.id = journalID;
    journalElementTest.setAttribute('widget-id', journalID);

    journalElementTest.addEventListener('dblclick', function(event) {
        overlay.style.display = 'block';
        const currentJournalID = event.target.getAttribute('widget-id');
        //const currentJournalID = event.target.id; // Get current ID of double clicked journal 
        const journalEntries = document.querySelectorAll('.journal-entry');
        hideOtherJournalEntries(journalEntries, currentJournalID);
        modal.style.display = 'block';
    });

    journalContainer.append(journalElementTest);
}

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
function createJournalElementNew(id, title, documentation, reflection, modalRef) {
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

// Adds new journal entry to page
// function addJournal(journalContainer) {

//     const entries = getJournals();

//     const entryObject = {
//         id: Math.floor(Math.random() * 2000000),
//         title: "",
//         documentation: "",
//         reflection: ""
//     };

//     const journalElement = createJournalElement(entryObject.id, entryObject.title, 
//                                             entryObject.documentation, entryObject.reflection);
//     journalContainer.append(journalElement);
//     entries.push(entryObject);
//     saveNotes(entries);
//     noteCount++;
// }

// Creates new journal entry element 
function createJournalElement(id, title, documentation, reflection){

    const journalBody = document.createElement('div');
    const journalTitle = document.createElement('textarea');
    const journalDocumentation = document.createElement('textarea');
    const journalReflection = document.createElement('textarea');

    journalBody.classList.add('journal-entry');
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

    return journalBody;
}

// Get all the journal entries from local storage
function getJournals() {
    return JSON.parse(localStorage.getItem("journal-list") || "[]");
}

// Get a certain journal based on id
function getJournal(journals, id) {
    return journals.filter(journals => journals.id == id)[0];
}

// Saves all journal entries to local storage
function saveNotes(journals){
    localStorage.setItem("journal-list", JSON.stringify(journals));
}