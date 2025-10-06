# 🌐 SafeVoice – AI-Powered Anonymous Support Platform

**Live Demo:** [SafeVoice on Netlify](https://safevoice.netlify.app)  

## 📌 About

Safevoice is a secure, AI-enhanced platform that lets individuals anonymously share harassment experiences, attach media (photos/audio), and access verified NGO resources. It integrates language tools to improve clarity and reach, and is designed to be beginner-friendly for open-source contributors.

## ✨ Features
- 📝 **Anonymous Story Management** — Add, edit, and delete stories while preserving contributor anonymity.  
- 🖼 **Media Attachments** — Upload photos and audio recordings with stories.  
- 🌍 **Real-Time Translation** — Translate stories into 8+ Indian languages using Google Gemini AI.  
- ✏️ **AI Grammar Correction** — Real-time grammar fixes for submitted text.  
- 📚 **NGO Resource Hub** — Searchable database of support organizations and contact info.  
- 🔐 **Secure Auth & DB** — Firebase Authentication + Firestore for secure, privacy-focused storage.  
- ⚡ **Serverless API** — Netlify Functions for backend endpoints with CORS handling.  
- 🛡️ **Access Controls & Rate-Limiting** — Basic protections to prevent abuse and preserve anonymity.

---

## 🛠 Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS  
**Backend:** Firebase (Auth, Firestore, Cloud Functions), Netlify Functions  
**AI Integration:** Google Gemini AI  
**Deployment:** Netlify

---

## 📂 Project Structure
```bash
netlify/functions
├── correct-grammar.cjs
├── translate.cjs
public
├── _redirects
src
├── components/
  └──  Navbar.tsx
  └──  Footer.tsx
├── lib/
  └──  firebase.ts
  └──  supabase.ts
├── pages/
  └──  About.tsx
  └── AdminDashboard.tsx
  └──  Auth.tsx
  └──  EditStory.tsx
  └──  Home.tsx
  └── Resources.tsx
  └──  ShareStory.tsx
  └──  Stories.tsx
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
.gitignore
CODE_OF_CONDUCT.md
README.md
eslint.config.js
index.html
netlify.toml
package-lock.json
package.json
postcss.config.js
server.js
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.js
```


## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Piyushydv08/SafeVoice.git
   cd SafeVoice
   ```
2. **Install Dependencies**

```bash
npm install
```
3. **Configure Environment Variables**

- Create a .env file in the root directory.
- Add Firebase & API keys.

Start Development Server
```bash
npm run dev
```

### ▶️ Usage
--- 

- Visit http://localhost:5000 in your browser.
- Sign up / Log in securely using Firebase Auth.
- Share an anonymous story with or without media.
- Translate and correct grammar instantly.
- Browse NGO resources for support.

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add feature'`)
5. Push to the branch  (`git push origin feature-name`)
6. Create a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---
## 🌟GSSoC'25
![GSSoC Logo](https://github.com/dimpal-yadav/SafeVoice/blob/main/GirlScript-Summer-of-Code.png)
🌟 **Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💃🎉💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *Medicine-Reminder-App!* Let’s make learning and career development smarter – together! 🌟👨‍💻👩‍💻

👩‍💻 GSSoC is one of India’s **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects 🌍 while learning, collaborating, and growing together. 🌱

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from GSSoC 2025 to this Medicine-Reminder-App project family! Let's build, learn, and grow together — one commit at a time. 🔥👨‍💻👩‍💻

## 🏆 **GSSoC 2025 Guidelines**

### 📋 **For Participants**
#### ✅ **Do's**
- ✅ **Read documentation** thoroughly before contributing
- ✅ **Follow code style** and project structure
- ✅ **Write descriptive** commit messages
- ✅ **Test your changes** before submitting PR
- ✅ **Be respectful** and collaborative
- ✅ **Ask questions** if you're unsure about anything
#### ❌ **Don'ts**
- ❌ **Don't spam** with multiple PRs for same issue
- ❌ **Don't copy code** without understanding
- ❌ **Don't make unnecessary** changes
- ❌ **Don't ignore** code review feedback
- ❌ **Don't forget** to update documentation when needed
### 🎯 **Contribution Levels**
| Level | Description | Points | Badge |
|-------|-------------|--------|-------|
| 🥉 **Beginner** | Fix typos, update docs, minor bug fixes | 5-10 | ![Beginner](https://img.shields.io/badge/Level-Beginner-green) |
| 🥈 **Intermediate** | Add features, improve UI/UX, performance | 15-25 | ![Intermediate](https://img.shields.io/badge/Level-Intermediate-blue) |
| 🥇 **Advanced** | Major features, architecture improvements | 30-50 | ![Advanced](https://img.shields.io/badge/Level-Advanced-red) |
---

## ✨ Contributors

#### Thanks to all the wonderful contributors 💖

[![Contributors](https://contrib.rocks/image?repo=Piyushydv08/SafeVoice)](https://github.com/Piyushydv08/SafeVoice/graphs/contributors)

---
## 📧 Contact  

For queries, feedback, or guidance regarding this project, you can contact the **mentor** assigned to the issue:  

- 📩 **GitHub**: [Piyushydv08](https://github.com/Piyushydv08)
- 💬 **By commit/PR comments**: Please tag the mentor in your commit or pull request discussion for direct feedback.  
 
Original Repository: [SafeVoice](https://github.com/Piyushydv08/SafeVoice.git)  



## 📄 **License**
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

--- 

If you like this project, please give it a ⭐ star. Your support means a lot to us!

Feel free to contribute or suggest new features!🙏

