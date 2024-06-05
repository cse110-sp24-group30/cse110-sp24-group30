describe("Journal Add Tests", () => {

    beforeAll(async () => {
        //await page.goto('https://cse110-sp24-group30.github.io/cse110-sp24-group30/journal/journal-page.html');
        await page.goto('http://127.0.0.1:5500/journal/journal-page.html');
    }, 15000);

    // Test adding a journal entry
    it('Add a journal entry', async () => {
        console.log('Adding a journal entry...');

        await page.click('.add-journal');

        const journalWidget = await page.$('.journal-widget');
        const journalContent = await page.$('.journal-entry');
        const journalEntry = await page.$eval('.journal-widget-title', el => el.textContent);

        expect(journalWidget).not.toBeNull();
        expect(journalContent).not.toBeNull();
        expect(journalEntry).toBe('Insert Title');
    }, 15000);

    it('Checking localStorage size', async () => {
        console.log('Checking localStorage size');
        const localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(1);
    }, 15000);

    it('Checking single journal exists after reload', async () => {
        console.log('Reloading the page...');
        await page.reload();

        const journalEntry = await page.$eval('.journal-widget-title', el => el.textContent);
        expect(journalEntry).toBe('Insert Title');
    }, 15000);

    it('Deleting single journal', async () => {
        console.log('Deleting journal...');

        await page.click('.fa.fa-close');

        const journalWidget = await page.$('.journal-widget');
        const journalContent = await page.$('.journal-entry');

        expect(journalWidget).toBeNull();
        expect(journalContent).toBeNull();
    }, 15000);

    it('Checking localStorage size', async () => {
        console.log('Checking localStorage size');
        const localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(0);
    }, 15000);

    it('Checking deleted journal after reload', async () => {
        console.log('Reloading the page...');
        await page.reload();

        const journalWidget = await page.$('.journal-widget');
        const journalContent = await page.$('.journal-entry');

        expect(journalWidget).toBeNull();
        expect(journalContent).toBeNull();
    }, 15000);

    it('Adding multiple journals at a time', async () => {
        console.log('Adding multiple journal entries...');

        for (let i = 0; i < 8; ++i) {
            await page.click('.add-journal');
        }

        const journalWidgets = await page.$$('.journal-widget');
        const journalContents = await page.$$('.journal-entry');

        expect(journalWidgets.length).toBe(8);
        expect(journalContents.length).toBe(8);
    }, 15000);

    it('Checking localStorage size', async () => {
        console.log('Checking localStorage size');
        const localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(8);
    }, 15000);

    it('Checking if journals exists after reload', async () => {
        console.log('Reloading the page...');
        await page.reload();

        const journalWidgets = await page.$$('.journal-widget');
        const journalContents = await page.$$('.journal-entry');

        expect(journalWidgets.length).not.toBe(0);
        expect(journalContents.length).not.toBe(0);
    }, 15000);

    it('Deleting multiple journals', async () => {
        console.log('Deleting first journal...');
        let journalID = await page.$eval('.journal-widget', el => el.getAttribute('widget-id'));
        await page.click('.fa.fa-close');

        let journalWidget = await page.$(`.journal-widget[widget-id="${journalID}"]`);
        let journalContent = await page.$(`.journal-entry[id="${journalID}"]`);

        expect(journalWidget).toBeNull();
        expect(journalContent).toBeNull();

        console.log('Checking localStorage size');
        let localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(7);


        console.log('Deleting third journal...');
        let thirdJournal = await page.$('.journal-widget:nth-of-type(3)');
        journalID = await page.evaluate(el => el.getAttribute('widget-id'), thirdJournal);

        let deleteButton = await page.$(`.journal-widget[widget-id="${journalID}"] .fa.fa-close`);
        await deleteButton.click();
        
        journalWidget = await page.$(`.journal-widget[widget-id="${journalID}"]`);
        journalContent = await page.$(`.journal-entry[id="${journalID}"]`);

        expect(journalWidget).toBeNull();
        expect(journalContent).toBeNull();

        console.log('Checking localStorage size');
        localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(6);

        console.log('Deleting fifth journal...');
        let fifthJournal = await page.$('.journal-widget:nth-of-type(5)');
        journalID = await page.evaluate(el => el.getAttribute('widget-id'), fifthJournal);

        deleteButton = await page.$(`.journal-widget[widget-id="${journalID}"] .fa.fa-close`);
        await deleteButton.click();
        
        journalWidget = await page.$(`.journal-widget[widget-id="${journalID}"]`);
        journalContent = await page.$(`.journal-entry[id="${journalID}"]`);

        expect(journalWidget).toBeNull();
        expect(journalContent).toBeNull();

        console.log('Checking localStorage size');
        localStorage = await page.evaluate(() => JSON.parse(localStorage.getItem('journal-list')));
        expect(localStorage.length).toBe(5);
    }, 15000);

    // Test after refreshing the entries remain the same
    it('Check entries after reload', async() => {
        console.log('test that number of entries remain same after reload...');

        const num1 = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journal-list') || '[]').length;
        });

        await page.reload();

        const num2 = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('journal-list') || '[]').length;
        });

        expect(num2).toBe(num1);
    }, 15000);

    it('Editing a single journal using plain text', async () => {
        console.log('Clearing localStorage...');
        
        await page.evaluate(() => localStorage.removeItem('journal-list'));
        await page.reload();

        console.log('Editing a single journal...');
        await page.click('.add-journal');
        await page.click('.fa.fa-pencil');

        let modal = await page.$eval('#modal', el => el.style.display);
        let overlay = await page.$eval('#overlay', el => el.style.display);

        expect(modal).toBe('block');
        expect(overlay).toBe('block');

        // Writing content to journal entry
        await page.focus('.journal-markdownInput');
        await page.keyboard.type('Hello world!');

        const markdownInputVal = await page.$eval('.journal-markdownInput', el => el.value);
        expect(markdownInputVal).toBe('Hello world!');

        const htmlOutputText = await page.$eval('.journal-htmlOutput', el => el.innerText.trim());
        expect(htmlOutputText).toBe('Hello world!');

        const htmlOutputHTML = await page.$eval('.journal-htmlOutput', el => el.innerHTML.trim());
        expect(htmlOutputHTML).toBe('<p>Hello world!</p>');
    }, 15000);

    it('Simulating backspace input on journal', async () => {
        let markdownInputVal = await page.$eval('.journal-markdownInput', el => el.value);

        await page.focus('.journal-markdownInput');
        for (let i = 0; i < markdownInputVal.length; i++) {
            await page.keyboard.press('Backspace');
        }

        markdownInputVal = await page.$eval('.journal-markdownInput', el => el.value);
        expect(markdownInputVal).toBe('');

        const htmlOutputText = await page.$eval('.journal-htmlOutput', el => el.innerText.trim());
        expect(htmlOutputText).toBe('');

        const htmlOutputHTML = await page.$eval('.journal-htmlOutput', el => el.innerHTML.trim());
        expect(htmlOutputHTML).toBe('');
    }, 15000);

    it('Editing a single journal using various markdown text', async () => {
        await page.focus('.journal-markdownInput');
        await page.keyboard.type('# Hello\n\n**Bold**\n\n*Italics*\n\n> Block Quotes\n\n1. First Item\n2. Second Item\n3. Third Item\n\n- First Item\n- Second Item\n- Third Item\n\n`code`\n\n---\n\n[Link]()\n\n![Alt Image]()');

        const markdownInputVal = await page.$eval('.journal-markdownInput', el => el.value);
        expect(markdownInputVal).toBe('# Hello\n\n**Bold**\n\n*Italics*\n\n> Block Quotes\n\n1. First Item\n2. Second Item\n3. Third Item\n\n- First Item\n- Second Item\n- Third Item\n\n`code`\n\n---\n\n[Link]()\n\n![Alt Image]()');

        const htmlOutputText = await page.$eval('.journal-htmlOutput', el => el.innerText.trim());
        expect(htmlOutputText).toBe('Hello\n\nBold\n\nItalics\n\nBlock Quotes\n\nFirst Item\nSecond Item\nThird Item\nFirst Item\nSecond Item\nThird Item\n\ncode\n\nLink');

        const htmlOutputHTML = await page.$eval('.journal-htmlOutput', el => el.innerHTML.trim());
        expect(htmlOutputHTML).toBe('<h1>Hello</h1>\n<p><strong>Bold</strong></p>\n<p><em>Italics</em></p>\n<blockquote>\n<p>Block Quotes</p>\n</blockquote>\n<ol>\n<li>First Item</li>\n<li>Second Item</li>\n<li>Third Item</li>\n</ol>\n<ul>\n<li>First Item</li>\n<li>Second Item</li>\n<li>Third Item</li>\n</ul>\n<p><code>code</code></p>\n<hr>\n<p><a href="">Link</a></p>\n<p><img src="" alt="Alt Image"></p>');
    }, 15000);

    it('Saving a single journal w/ various markdown text', async () => {
        console.log('Saving journal...');
        await page.click('.save-button');

        // Check header title

        // Check content inside journal

        // Check localStorage
    }, 15000);

    it('Checking journal content after reload', async () => {
        await page.reload();
    }, 15000);

    /**
     *  TODO: Add more tests for:
     * 
     *  (1) Modifying a journal by using markdown syntax (DONE)
     *  (2) Saving a journal via its save button
     *  (3) Cancel changes to a journal via its cancel button
     *  (4) Close and open journal and check its contents
     *  (5) Reload the page and check its contents
     *  (6) For steps 1-2, check localStorage
     *  (7) Repeat steps 1-6 for multiple journals
     */

    // // Test saving and reopening the journal entry
    // it('Save and reopen journal entry', async () => {
    //     console.log('test saving and reopening journal entry...');

    //     await page.click('.add-journal');

    //     await page.$eval('.journal-title', el => el.value = 'Random Title');
    //     await page.$eval('.journal-documentation', el => el.value = 'Random Content');
    //     await page.$eval('.journal-reflection', el => el.value = 'Random Reflection');

    //     // Click off the page to save the journal entry
    //     await page.click('.journal-widget', {clickCount: 1}); 
    //     await page.click('.journal-widget'); 

    //     const savedTitle = await page.$eval('.journal-title', el => el.value);
    //     const savedContent = await page.$eval('.journal-documentation', el => el.value);
    //     const savedReflection = await page.$eval('.journal-reflection', el => el.value);

    //     expect(savedTitle).toBe('Random Title');
    //     expect(savedContent).toBe('Random Content');
    //     expect(savedReflection).toBe('Random Reflection');
    // });
});