describe("Todo App Tests", () => {
  beforeAll(async () => {
    //await page.goto('https://cse110-sp24-group30.github.io/cse110-sp24-group30/source/to_do/to-do.html');
    await page.goto("http://127.0.0.1:5501/source/to_do/to-do.html");
  }, 15000);

  // Test adding a new task in Not Started column
  it("Add a new not started task", async () => {
    const localStorage = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("not-started") || "[]")
    );
    await page.click(".new-task-button-not-started");
    const afterClick = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("not-started") || "[]")
    );
    expect(afterClick.length).toBe(localStorage.length + 1);
  }, 15000);

  // Test adding a new task in In Progress column
  it("Add a new in progress task", async () => {
    const localStorage = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("in-progress") || "[]")
    );
    await page.click(".new-task-button-in-progress");
    const afterClick = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("in-progress") || "[]")
    );
    expect(afterClick.length).toBe(localStorage.length + 1);
  }, 15000);

  // Test editing a task in Not Started column
  it("Edit a not started task", async () => {
    await page.click(".new-task-button-not-started");
    const taskId = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks[tasks.length - 1].id;
    });
    await page.click(`[task-id="${taskId}"] #edit-button img`);
    await page.type("#edit-task-title", " Edited");
    await page.click("#edit-task-form button[type='submit']");
    const editedTaskTitle = await page.evaluate((id) => {
      const task = JSON.parse(localStorage.getItem("not-started")).find(
        (task) => task.id === id
      );
      return task.title;
    }, taskId);
    expect(editedTaskTitle).toContain("Edited");
  }, 15000);

  // Test deleting a task in Not Started column
  it("Delete a not started task", async () => {
    await page.click(".new-task-button-not-started");
    const taskId = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks[tasks.length - 1].id;
    });
    await page.click(`[task-id="${taskId}"] #delete-button img`);
    const taskExists = await page.evaluate((id) => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks.some((task) => task.id === id);
    }, taskId);
    expect(taskExists).toBe(false);
  }, 15000);

  // Test task count updates
  it("Check task count updates", async () => {
    const notStartedCount = await page.$eval("#num-not-started", (el) =>
      parseInt(el.innerText)
    );
    const inProgressCount = await page.$eval("#num-in-progress", (el) =>
      parseInt(el.innerText)
    );

    await page.click(".new-task-button-not-started");
    await page.click(".new-task-button-in-progress");

    const newNotStartedCount = await page.$eval("#num-not-started", (el) =>
      parseInt(el.innerText)
    );
    const newInProgressCount = await page.$eval("#num-in-progress", (el) =>
      parseInt(el.innerText)
    );

    expect(newNotStartedCount).toBe(notStartedCount + 1);
    expect(newInProgressCount).toBe(inProgressCount + 1);
  }, 15000);

  // Test events array update when adding a new task
  it("Check events array updates when adding a new task", async () => {
    const initialEvents = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("events") || "[]")
    );
    await page.click(".new-task-button-not-started");
    const updatedEvents = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("events"))
    );
    expect(updatedEvents.length).toBe(initialEvents.length + 1);
  }, 15000);

  // Test events array update when changing task label
  it("Check events array updates when changing task label", async () => {
    await page.click(".new-task-button-not-started");
    const taskId = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks[tasks.length - 1].id;
    });
    const initialEvents = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("events") || "[]")
    );
    await page.click(`[task-id="${taskId}"] #edit-button img`);
    await page.select("#edit-task-label", "work");
    await page.click("#edit-task-form button[type='submit']");
    const updatedEvents = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("events"))
    );
    expect(updatedEvents.length).toBe(initialEvents.length); // Length remains the same, but data changes
    const updatedTask = updatedEvents.find((event) => event.id === taskId);
    expect(updatedTask.category).toBe("work");
  }, 15000);

  // Test data persistence after refresh
  it("Check data persistence after refresh", async () => {
    await page.click(".new-task-button-not-started");
    const taskId = await page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks[tasks.length - 1].id;
    });
    await page.click(`[task-id="${taskId}"] #edit-button img`);
    await page.type("#edit-task-title", " Persistent Task");
    await page.click("#edit-task-form button[type='submit']");

    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

    const persistedTask = await page.evaluate((id) => {
      const tasks = JSON.parse(localStorage.getItem("not-started") || "[]");
      return tasks.find((task) => task.id === id);
    }, taskId);

    expect(persistedTask.title).toContain("Persistent Task");
  }, 15000);
});
