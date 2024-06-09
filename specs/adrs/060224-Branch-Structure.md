---
parent: Decisions
nav_order: 4
title: ADR 0005 - Restructuring Branches and Updating CI/CD Pipeline
status: proposed
date: 2024-06-02
deciders: Project Team
consulted: Professor Powell
informed: Entire Team
---

# Architectural Decision Record (ADR)

## ADR 2024-06-03-01: Restructuring Branches and Updating CI/CD Pipeline

### Context

Currently, our repository has a significant number of branches being merged directly into the main branch. This approach results in challenges in maintaining code quality and organization. The CI/CD pipeline only checks for compatibility with the main branch, which is insufficient for ensuring overall production stability.

### Decision

We will restructure our repository to have six core branches:

1. `admin`
2. `dev`
3. `dashboard`
4. `todo`
5. `calendar`
6. `journal`

Subbranches will be created as needed and merged into the appropriate core branch. The CI/CD pipeline will be updated to perform build and deploy checks for all core branches to ensure production stability at all times.

### Status

Accepted

### Consequences

**Pros:**

- Improved organization and structure of the repository
- enhanced productivity by minimizing the number of branches being tested against
- comprehensive CI/CD checks ensure code quality and functionality across all branches
- better alignment with best practices and the professor's guidance

**Cons:**

- Initial effort required to restructure and update the pipeline

### Implementation

1. **Restructure Branches:**

   - create the six core branches: `admin`, `dev`, `dashboard`, `todo`, `calendar`, and `journal`.
   - migrate existing branches to subbranches under the appropriate core branches.

2. **Update CI/CD Pipeline:**
   - modify the CI/CD pipeline configuration to trigger on all core branches and subbranches.
   - ensure the pipeline performs lint, test, build, and deploy checks for each branch.
