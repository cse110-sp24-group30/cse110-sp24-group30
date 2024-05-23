describe("Journal Add Tests", () => {

    beforeAll(async () => {
        await page.goto('https://cse110-sp24-group30.github.io/cse110-sp24-group30/journal/journal-page.html');
    });

    it("basic sum test", async () => {
        console.log('test adding two numbers...');

        let x = 2 + 2;
        console.log("2+2 is: " + x);

        expect(x).toBe(4);
    });
});