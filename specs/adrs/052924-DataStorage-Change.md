---
parent: Decisions
nav_order: 3
title: ADR 0003 - Changing from SQLite to localStorage
status: proposed
date: 2024-05-29
deciders: Project Team
consulted: Professor
informed: Entire Team
---

# Changing from SQLite to browser's localStorage for data storage

## Context and Problem Statement

When we first visited Professor's office hours, we consulted him about the decision of using SQLite vs localStorage as the widgets were using localStorage and considering the requirements of the project, localStorage would better align with them. 

## Decision Drivers

- **Simplicity**: The solution must be extremely simple to implement and use, requiring minimal setup. 
- **No Additional Learning Cost**: All the team members are aware about the data storage method and don't need to spend a lot of time apart from the project in navigating a new database.

## Considered Options

- **SQL Lite**
  - Lightweight and easy to integrate.
  - Uses familiar SQL syntax, which is educational and widely applicable.
- **localStorage**
  - Everyone is already aware about its functionality
  - Simple to implement directly through user's browser

## Decision Outcome

Chosen option: "localStorage", because it meets the minimalism and simplicity requirement and provides sufficient functionality for our local storage needs without adding unnecessary complexity of learning a new database from scratch.

### Consequences

- Good, because it eliminates the need for any additional setup
- Good, because it handles the requirements of our project without complicating anything
- Bad, because it may not offer as much flexibility like SQLite and may limit future scalability 

## Pros and Cons of the Options

### SQL Lite

- Good, because it supports advanced querying and support
- Bad, because it requires additional time to learn and setup

### localStorage

- Good, because everyone is already familiar with it. It supports the principle of "local first" and minimalism
- Bad, because it may limit flexibility.

## More Information

This decision was revisited from our [first ADR](https://github.com/cse110-sp24-group30/cse110-sp24-group30/blob/admin/specs/adrs/051024-Database-Choice.md) when we decided to use SQLite.
