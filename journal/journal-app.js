window.addEventListener('DOMContentLoaded', init);

let noteCount = 0;

// Main function that initializes every other function
function init() {
    const journalContainer = document.getElementById('journal-app');
    const addButton = journalContainer.querySelector('.add-journal');

    addButton.addEventListener('click', () => addJournal(journalContainer))

    getJournals().forEach(entry => {
        const journalElement = createJournalElement(entry.id, entry.title, entry.documentation, entry.reflection);

        journalContainer.append(journalElement);
        noteCount++;
    });
}

// Adds new journal entry to page
function addJournal(journalContainer) {

    const entries = getJournals();

    const entryObject = {
        id: Math.floor(Math.random() * 2000000),
        title: "",
        documentation: "",
        reflection: ""
    };

    const journalElement = createJournalElement(entryObject.id, entryObject.title, 
                                            entryObject.documentation, entryObject.reflection);
    journalContainer.append(journalElement);
    entries.push(entryObject);
    saveNotes(entries);
    noteCount++;
}

// Creates new journal entry element 
function createJournalElement(id, title, documentation, reflection){

    const journalBody = document.createElement('div');
    const journalTitle = document.createElement('textarea');
    const journalDocumentation = document.createElement('textarea');
    const journalReflection = document.createElement('textarea');

    journalBody.classList.add('journal-entry');
    journalTitle.classList.add('journal-title');
    journalDocumentation.classList.add('journal-documentation');
    journalReflection.classList.add('journal-refelction');

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