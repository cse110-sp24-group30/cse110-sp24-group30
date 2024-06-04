---
parent: Decisions
nav_order: 4
title: ADR 0004 - Maintaining Consistent Formatting
status: proposed
date: 2024-05-31
deciders: Project Team
consulted: N/A
informed: Entire Team
---

# Deciding How to Keep Formatting Consistent

## Context and Problem Statement
On Wednesday, as a team, we went to Professor Powell's Office hours where he brought up the point of how we intended to keep the formatting consistent such that the code looks like it is written by a single person. Currently, we were reviewing each other's code so that everyone practices similar formatting. Professor Powell raised some valid points regarding that there can still be discrepancies.

## Decision Drivers
Professor Powell highlighted the following concern with our current setup:
- there can still be formatting inconsistency since only a limited number of people are reviewing code and having more than 2-3 people review code will be waste of resources.

Given this concern, we need to evaluate whether switching to a different method like using Prettier would provide a more efficient solution for our project management needs. We specifically chose Prettier instead of resorting to any other formatting tool because some team members already had it installed and have some experience using it. We hope to use this ADR to analyze the potential benefits and drawbacks of making this switch and to propose a course of action that aligns with our project's objectives and Professor Powell's feedback.

## Proposed Ideas
1. **Continue using Code Review**
2. **Switch to Prettier Default Formatting**

## Pros and Cons of Options
### Continue using Code Review
- **Pros**:
  - team members already accustomed to doing formatting this way

- **Cons**:
  - there can be inconsistencies between team members even if people review each other's code

### Switch to Prettier Default Formatting
- **Pros**:
  - automated consistent formatting
  - easier to maintain
  - can still code review simultaneously
  - some team members already had experience with using it

- **Cons**:
  - may take some time to install
  - may take time for everyone to get into the habit of using it


## Decision Outcome
After careful consideration, we have decided to adopt Prettier as the default formatting tool for our project. This decision will streamline our formatting process and reduce the manual effort required to ensure consistency. Furthermore, this aligns with Professor Powell's suggestion and leverages the automation process of Prettier extension, improving our overall efficiency in keeping our formatting consistent.

### Consequences
We anticipate a more consistent code formatting across the entire codebase, reduced manual effort in code reviews focused on formatting and improved collaboration and readability of code.

## More Information
We will refer to this resource - [Prettier Documentation](https://prettier.io/docs/en/) to guide us through the installation and configuration process.
