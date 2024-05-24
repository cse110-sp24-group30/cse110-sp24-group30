describe("Journal Add Tests", () => {

    beforeAll(async () => {
        await page.goto('https://cse110-sp24-group30.github.io/cse110-sp24-group30/journal/journal-page.html');
    });

    // Test adding a journal entry
    it('Add a journal entry', async () => {
        console.log('test adding a journal entry...');

        await page.click('.add-journal');

        const journalEntry = await page.$eval('.journal-widget', el => el.textContent);
        expect(journalEntry).toBe('Placeholder Title');
    });

    // Test writing in the journal entry
    it('Write in the journal entry ', async () => {
        console.log('test writing in the journal entry...');

        await page.click('.journal-widget', {clickCount: 2});

        // Writing in all three parts of the journal entry
        await page.$eval('.journal-title', el => el.value = 'Test Title');
        await page.$eval('.journal-documentation', el => el.value = 'Test Content');
        await page.$eval('.journal-reflection', el => el.value = 'Test Reflection');

        const journalTitle = await page.$eval('.journal-title', el => el.value);
        const journalContent = await page.$eval('.journal-documentation', el => el.value);
        const journalReflection = await page.$eval('.journal-reflection', el => el.value);

        expect(journalTitle).toBe('Test Title');
        expect(journalContent).toBe('Test Content');
        expect(journalReflection).toBe('Test Reflection');
    });

    // Test saving and reopening the journal entry
    it('Save and reopen journal entry', async () => {
        console.log('test saving and reopening journal entry...');

        await page.click('.add-journal');

        await page.$eval('.journal-title', el => el.value = 'Random Title');
        await page.$eval('.journal-documentation', el => el.value = 'Random Content');
        await page.$eval('.journal-reflection', el => el.value = 'Random Reflection');

        // Click off the page to save the journal entry
        await page.click('.journal-widget', {clickCount: 1}); 
        await page.click('.journal-widget'); 

        const savedTitle = await page.$eval('.journal-title', el => el.value);
        const savedContent = await page.$eval('.journal-documentation', el => el.value);
        const savedReflection = await page.$eval('.journal-reflection', el => el.value);

        expect(savedTitle).toBe('Random Title');
        expect(savedContent).toBe('Random Content');
        expect(savedReflection).toBe('Random Reflection');
    });
});