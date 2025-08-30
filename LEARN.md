# 📘 LEARN.md – MedHaven Contributor Guide

Welcome to **MedHaven**! This page is your go-to reference for understanding how to contribute effectively to the project, whether you're a complete beginner or an experienced developer.  
> _"Every expert was once a beginner. Don’t be afraid to start small!"_

---

## 🧭 Table of Contents

- [🆕 New to Git & GitHub? Start Here](#-new-to-git--github-start-here)
- [🚀 Step-by-Step: Your First Contribution](#-step-by-step-your-first-contribution)
- [🧠 Common Git Terms Explained](#-common-git-terms-explained)
- [🛠️ Git Commands Cheat Sheet](#️-git-commands-cheat-sheet)
- [✅ Contribution Rules](#-contribution-rules)
- [📌 Pull Request Checklist](#-pull-request-checklist)
- [🐞 Creating & Reporting Issues](#-creating--reporting-issues)
- [🆘 FAQs & Help](#-faqs--help)
- [🏁 Final Tips](#-final-tips)

---

## 🆕 New to Git & GitHub? Start Here

### Prerequisites

1. Create a GitHub account: [github.com](https://github.com)  
2. Install Git: [git-scm.com](https://git-scm.com)  
3. Configure Git (in terminal):
````bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
````

---

## 🚀 Step-by-Step: Your First Contribution

1. **Find an Issue**  
   - Look for issues tagged `good first issue` or `beginner friendly`.  
   - Comment _"Hi! I'd like to work on this issue. Please assign it to me."_  
   ✅ Only comment if the issue is unassigned.

2. **Fork the Repo**  
  - In your browser
  - Click the "Fork" button in the top-right of the repo


3. **Clone Your Fork**  
````bash
git clone https://github.com/YOUR-USERNAME/Med-Haven.git
cd MedHaven
````

4. **Install Dependencies and Setup**  
Follow the [README.md](./README.md#run-locally-without-docker) setup instructions to get MedHaven running locally.

5. **Create a Branch**  
````bash
git checkout -b fix-ui-homepage-header
````

6. **Make Your Changes**  
- Use Prettier or project's preferred formatter.  
- Test your changes before committing.

7. **Commit and Push**  
````bash
git add .
git commit -m "Fix: ui of homepage header"
git push origin fix-ui-homepage-header
````

8. **Create a Pull Request**  
- Go to your fork on GitHub  
- Click _Compare & pull request_  
- Fill in details (see template below)

---

## 🧠 Common Git Terms Explained

| Term               | Meaning                                          |
|--------------------|-------------------------------------------------|
| **Repository**     | The project with its full file history           |
| **Fork**           | Your personal copy of the project                 |
| **Clone**          | Download a repo copy locally                      |
| **Branch**         | Isolated workspace for new changes                |
| **Commit**         | A saved snapshot of your changes                   |
| **Pull Request**   | A request to merge changes from a branch to main |

---

## 🛠️ Git Commands Cheat Sheet

````bash
# Stage and commit
git add .
git commit -m "Add: Feature description"

# Push your branch
git push origin branch-name

# Create a branch
git checkout -b new-branch

# Switch branches
git checkout main

# Update fork with latest changes
git remote add upstream https://github.com/diveshsaini1991/med-haven.git
git fetch upstream
git merge upstream/main
````

---

## ✅ Contribution Rules

- 🔹 Work on only one issue at a time  
- 🔹 Wait to be **assigned** before starting work  
- 🔹 Write clear, concise **commit messages** like `Fix: input box bug on mobile`  
- 🔹 Test your changes rigorously  
- 🔹 Be respectful and inclusive in all interactions  
- 🔹 Use screenshots in PRs if UI changes are involved  
- 🔹 Format code using project's preferred code style tools

---

## 📌 Pull Request Checklist

Use this PR template when submitting:

````md
## Description

<!--Please include a summary of the change and which issue is fixed. Also include relevant motivation and context.-->

## Related Issue
<!-- If this PR addresses an issue, please include the issue number. -->

Fixes #<issue number>

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Other (please describe):

## How Has This Been Tested?

<!-- Please describe steps you took to test and verify your changes. -->

## Checklist:

- [ ] My code follows the project's coding style guidelines.
- [ ] I have performed a self-review of my own code.
- [ ] I have commented my code, particularly in hard-to-understand areas.
- [ ] I have made corresponding changes to the documentation.
- [ ] My changes generate no new warnings.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] New and existing unit tests pass locally with my changes.
- [ ] Any dependent changes have been merged and published in downstream modules.


````


---

## 🐞 Creating & Reporting Issues

### Bug Report Template

````md
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.

````

### Feature Request Template

````md
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
````


---

## 🆘 FAQs & Help

| ❓ Question                     | ✅ Answer                                          |
|-------------------------------|--------------------------------------------------|
| Can I work on multiple issues? | Yes, but we recommend focusing on one at a time. |
| What if I can’t finish an issue? | Leave a comment so it can be reassigned.          |
| What if my PR is rejected?     | Review feedback carefully, make changes, and resubmit. |
| I’m a beginner. Can I contribute? | Absolutely! Start with documentation or simpler issues. |
| Where do I ask for help?       | Use GitHub issues or repository discussions.     |

---

## 🏁 Final Tips

- 🎯 Start small: Fix typos or documentation errors to begin.
- 🧠 Read other contributors’ code and PRs for practice.
- 🧼 Keep your branches focused and clean.
- 🫱🏽‍🫲🏾 Don’t hesitate to ask questions when stuck.
- 🎉 Above all, enjoy the process of learning and contributing!

---

Let’s build a healthier future together at **MedHaven**! ✨

