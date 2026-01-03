# 🤝 Contributing to SafeVoice

Welcome to *SafeVoice*, an AI-powered platform dedicated to providing anonymous support for individuals facing harassment or online abuse. Our mission is to create a safe, inclusive, and empowering digital space where people can share experiences, access verified resources, and leverage AI tools for guidance and assistance.

We welcome contributions of all kinds—code, documentation, design, or ideas. This guide will help you get started.

---

## 📑 Table of Contents

- [Getting Started](#-getting-started)
- [How to Contribute](#-how-to-contribute)
- [Coding Guidelines](#-coding-guidelines)
- [Testing](#-testing)
- [Code Review Process](#-code-review-process)
- [Documentation](#-documentation)
- [Reporting Bugs & Requesting Features](#-reporting-bugs--requesting-features)
- [Good First Issues](#-good-first-issues)
- [Code of Conduct](#-code-of-conduct)
- [Need Help?](#-need-help)
- [Recognition](#-recognition)

---

## 🌟 Getting Started

### Prerequisites

Make sure you have the following installed:
- Git
- Node.js v18+ and npm
- Firebase CLI: npm install -g firebase-tools
- Netlify CLI: npm install -g netlify-cli
- A code editor (VS Code recommended)

### Tech Stack

- *Frontend*: React, TypeScript, Tailwind CSS
- *Backend*: Firebase (Auth, Firestore, Cloud Functions), Netlify Functions
- *AI Integration*: Google Gemini AI
- *Deployment*: Netlify

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Piyushydv08/SafeVoice.git
   cd SafeVoice
   ```
2. **Install Dependencies and CLI**

```bash
npm install
npm install -g firebase-tools
npm install -g netlify-cli
```
3. **Configure Environment Variables**

- Create a .env file in the root directory.
- Place all keys according to .env.example
- Add Firebase & API keys.

4. **Start Development Server**
```bash
netlify dev
```

---

## 🔄 How to Contribute

1.  *Pick an Issue*
    Browse the issues. If you'd like to work on one, comment on it and wait for it to be assigned to you.

2.  *Create a Branch*
    Ensure your main branch is up to date, then create a new branch for your changes.
    ```bash
    git checkout main
    git pull upstream main
    git checkout -b feature/your-feature-name
    ```
    

3.  *Make Changes*
    Implement your changes and test them locally.

4.  *Commit Changes*
    Use clear, descriptive commit messages following the Conventional Commits specification.
    ```bash
    git add .
    git commit -m "feat: add NGO resource hub search"
    ```
    

5.  *Push and Open a Pull Request*
    Push your branch to your forked repository and open a PR to the main branch of the original SafeVoice repository.
    ```bash
    git push origin feature/your-feature-name
    ```

---

## 📝 Coding Guidelines

* *React + TypeScript*: Use functional components with hooks, and always define prop types/interfaces.
* *Tailwind CSS*: Prefer utility classes over inline styles for consistency.
* *Firebase & Netlify Functions*: Use async/await for database queries and always validate user input.

---

## 🧪 Testing

Before submitting a PR, ensure your changes pass the following checklist:

* The app builds successfully (npm run build).
* The UI is responsive on both desktop and mobile devices.
* Your feature works as described.
* The console has no warnings or errors.

---

## 🔍 Code Review Process

All pull requests are reviewed by a project maintainer. You may receive feedback on code quality, clarity, and security. Please address comments by pushing new commits to the same branch.

---

## 📖 Documentation

* Update the README.md if your changes add or modify a feature.
* Add inline comments for complex logic.

---

## 💡 Reporting Bugs & Requesting Features

Please use GitHub Issues with the appropriate templates to report bugs or request new features.

---

## 🚀 Good First Issues

If you're a new contributor looking for a place to start, we've tagged issues with the good first issue label. These are typically simple tasks, such as:

* Fixing typos in documentation.
* Improving UI styling.
* Adding unit tests for a function.

---

## 📜 Code of Conduct

We enforce a strict *Code of Conduct* to ensure a safe and inclusive environment. We expect all contributors to be respectful, use inclusive language, and provide constructive feedback.

---

## ❓ Need Help?

If you're stuck, first check the existing documentation and issues. If you still can't find a solution, feel free to open a "question" issue with a detailed description of your problem.

---

## 🎉 Recognition

We deeply appreciate every contribution! Contributors will receive:

* *Leaderboard Recognition*: Your name and contributions will be displayed on the project leaderboard.
* *Contributors List*: Added to the official SafeVoice contributors list.
* *Community Shout-outs*: Highlighted in SafeVoice community channels for outstanding contributions.

---

🙏 Thank you for making SafeVoice better! Together, we create a safer digital space.