---
parent: Decisions
nav_order: 3
title: ADR 0003 - Changing Platform for Tracking Issues
status: proposed
date: 2024-05-30
deciders: Project Team
consulted: Professor Powell
informed: Entire Team
---

# Choosing Our Content for the Journal Page

## Context and Problem Statement

Yesterday, as a team, we went to Professor Powell's Office Hours and presented our project to him. In particular, we shared our current workflow and task management processes and explained that we are currently using Trello to manage our tasks and track issues. Trello has been effective for visual task management and collaboration; however, Professor Powell raised some valid points regarding the potential inefficiencies of using multiple platforms. He suggested that we consider using GitHub Projects to manage our tasks and track issues instead.

## Decision Drivers

Professor Powell highlighted the following concerns with our current setup:

- managing tasks in Trello while handling code and issues in GitHub leads to a incohesive workflow, requiring team members to switch between platforms frequently
- syncing tasks and issues between Trello and GitHub can be cumbersome and prone to errors, leading to potential discrepancies and miscommunication
- keeping all project-related activities within GitHub would enhance visibility, making it easier to track progress and collaborate effectively
- we are able to directly manage our Github Actions using Github Project

Given these concerns, we need to evaluate whether switching to GitHub Projects would provide a more efficient solution for our project management needs. We hope to use this ADR to analyze the potential benefits and drawbacks of making this switch and to propose a course of action that aligns with our project's objectives and Professor Powell's feedback.

## Proposed Ideas

1. **Continue using Trello**
2. **Switch to GitHub Projects**

## Pros and Cons of Options

### Continue using Trello

- **Pros**:

  - team members are already accustomed to Trello's interface and workflow
  - current task management processes are already set up
  - Trello's drag-and-drop functionality and visual task management are intuitive

- **Cons**:
  - requires switching between Trello and GitHub, leading to potential inefficiencies.
  - difficulties in syncing tasks and issues between Trello and GitHub.
  - reduced visibility and traceability of tasks and issues within the same platform.

### Switch to GitHub Projects

- **Pros**:

  - seamless integration with GitHub repositories and actions
  - all project-related activities are tracked within GitHub
  - unified platform for code management and task tracking

- **Cons**:
  - may take some time to adapt to a new system
  - making sure all tasks logged on Trello are reflected on GitHub Projects as well as setting up new workflows to ease automation

## Decision Outcome

After careful consideration, we have decided to switch to GitHub Projects for tracking issues and managing tasks. With GitHub Projects, we can link issues and tasks directly to PRs. This makes it easier to track the status of tasks related to specific code changes, improving the overall PR review process. Furthermore, this aligns Professor Powell's suggestion and leverages the integration capabilities of GitHub, improving our overall efficiency in managing various tasks.

### Consequences

We anticipate a more streamlined workflow, however, it may take some time for the team to become accustomed to the new platform and fully utilize all the functionalities of GitHub Projects.

## More Information

We will refer to this resource when to help us grasp a strong foundation in Github Projects. [GitHub Projects documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects).
