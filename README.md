# 🌐 SafeVoice – AI-Powered Anonymous Support Platform

> A secure, AI-assisted platform where users can anonymously express experiences, access NGO support resources, translate content into regional languages, and safely communicate without exposing identity.

---

# 🚀 Live Demo

🔗 SafeVoice on Netlify

---

# 📌 About The Platform

SafeVoice is a privacy-focused web platform designed to provide a safe digital environment for individuals to anonymously express experiences related to harassment, abuse, discrimination, emotional distress, or social issues.

The platform integrates:

- 🔐 Secure Authentication
- 🧠 AI-powered Text Enhancement
- 🌍 Multilingual Translation
- 🖼️ Media Upload Support
- 📚 NGO Resource Discovery
- ⚡ Serverless Backend Infrastructure

The architecture prioritizes:

- Privacy-first design
- Scalability
- Performance optimization
- Modular backend services
- Beginner-friendly open-source contribution

---

# ✨ Features

| Feature | Description |
|---|---|
| 📝 Anonymous Publishing | Create, edit, and manage content without exposing identity |
| 🌍 AI Translation | Translate content into multiple Indian languages |
| ✏️ AI Grammar Enhancement | Improve text quality before publishing |
| 🖼️ Media Uploads | Upload audio recordings and images |
| 🔐 Secure Authentication | Firebase-based login & signup |
| 📚 NGO Resource Hub | Browse verified support organizations |
| ⚡ Serverless APIs | Lightweight backend using Netlify Functions |
| 🛡️ Abuse Protection | Rate limiting and secured API access |

---

# 🏗️ High-Level Architecture

```mermaid
flowchart LR

A[👤 User] --> B[⚛ React Frontend]

B --> C[🔥 Firebase Authentication]
B --> D[📦 Firestore Database]
B --> E[⚡ Netlify Serverless Functions]

E --> F[🧠 Google Gemini AI]

B --> G[🖼 Media Storage]

D --> H[📚 Content Collection]
D --> I[👥 Users Collection]
D --> J[🏢 NGO Resources]

F --> K[🌍 Translation Output]
F --> L[✏️ Grammar Corrected Output]
```

---

# 🔄 Complete Platform Workflow

## 1️⃣ Authentication Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant FirebaseAuth
    participant Firestore

    User->>Frontend: Open Login / Signup Page
    Frontend->>FirebaseAuth: Send Credentials
    FirebaseAuth-->>Frontend: Authentication Token
    Frontend->>Firestore: Store User Metadata
    Firestore-->>Frontend: User Profile Created
    Frontend-->>User: Redirect to Dashboard
```

### Internal Flow

- Firebase Authentication validates credentials
- Session tokens are generated securely
- User metadata is stored in Firestore
- Public content remains detached from identity

---

## 2️⃣ Content Creation Lifecycle

```mermaid
flowchart TD

A[👤 User Creates Content] --> B[📝 ShareStory.tsx]

B --> C{Use AI Grammar Enhancement?}

C -->|Yes| D[⚡ correct-grammar.cjs]
D --> E[🧠 Gemini AI]
E --> F[✏️ Enhanced Text]

C -->|No| G[Continue Original Text]

F --> H[📦 Submit Content]
G --> H

H --> I{Attach Media?}

I -->|Yes| J[🖼 Upload Audio/Image]
I -->|No| K[📄 Store Text Only]

J --> L[☁ Media Storage]
L --> M[🔗 Media URL Generated]

M --> N[🔥 Firestore Database]
K --> N

N --> O[📚 Content Published]
```

---

## 3️⃣ AI Translation Lifecycle

```mermaid
flowchart LR

A[📚 Existing Content] --> B[⚡ translate.cjs]

B --> C[🧠 Google Gemini AI]

C --> D[🌍 Selected Language Translation]

D --> E[⚛ Frontend Display]
```

### Translation Benefits

- Regional accessibility
- Cross-language communication
- Better outreach for support systems

---

## 4️⃣ Content Retrieval Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Firestore

    User->>Frontend: Open Feed Page
    Frontend->>Firestore: Fetch Content
    Firestore-->>Frontend: Return Content Data
    Frontend-->>User: Render Content Cards
```

### Retrieved Data

- Anonymous content
- Media URLs
- Timestamp metadata
- Translation versions

---

## 5️⃣ NGO Resource Hub Workflow

```mermaid
flowchart LR

A[👤 User Searches NGO] --> B[⚛ Resources.tsx]

B --> C[🔥 Firestore NGO Collection]

C --> D[📚 NGO Resource Cards]

D --> E[📞 Contact Information]
```

---

# 🧠 Backend-to-Frontend Detailed Architecture

```mermaid
flowchart TB

subgraph Frontend
A[Home.tsx]
B[Auth.tsx]
C[ShareStory.tsx]
D[Stories.tsx]
E[Resources.tsx]
F[AdminDashboard.tsx]
end

subgraph Backend
G[Firebase Authentication]
H[Firestore Database]
I[Netlify Functions]
J[Google Gemini AI]
K[Media Storage]
end

A --> B
B --> G

C --> I
I --> J

C --> H
D --> H
E --> H
F --> H

C --> K
K --> H

J --> I
I --> C
```

---

# 🔐 Security & Privacy Architecture

## Privacy Principles

- Anonymous publishing
- Minimal personally identifiable information
- Secure authentication flow
- Protected backend APIs
- Firestore security rules
- Abuse prevention mechanisms

---

## Security Workflow

```mermaid
flowchart LR

A[👤 User Request] --> B[🔐 Firebase Authentication]
B --> C[🛡 Auth Validation]
C --> D[⚡ Serverless Function]
D --> E[🔥 Firestore Rules]
E --> F[📦 Database Access]
```

---

# ⚡ API Architecture

| Endpoint | Purpose |
|---|---|
| correct-grammar.cjs | AI grammar enhancement |
| translate.cjs | Multi-language translation |
| subscribe.cjs | Newsletter/email subscriptions |

---

# 📂 Project Structure

```bash
SafeVoice/
│
├── .github/
│   └── ISSUE_TEMPLATE/
│
├── netlify/
│   └── functions/
│       ├── correct-grammar.cjs
│       ├── subscribe.cjs
│       └── translate.cjs
│
├── public/
│   └── _redirects
│
├── src/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── README.md
├── package.json
├── netlify.toml
└── vite.config.js
```

---

# ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Firebase + Netlify Functions |
| Database | Firestore |
| Authentication | Firebase Auth |
| AI Integration | Google Gemini AI |
| Deployment | Netlify |
| Storage | Cloud Storage / External Storage |

---

# 📈 Scalability Design

SafeVoice uses a modular serverless architecture.

### Benefits

- ⚡ Faster deployments
- 📈 Easy horizontal scaling
- 💸 Lower infrastructure costs
- 🔧 Independent backend functions
- 🌍 CDN delivery via Netlify

---

# 🧩 Frontend Routing Structure

```mermaid
flowchart TD

A[🏠 Home] --> B[🔐 Authentication]
A --> C[📝 Create Content]
A --> D[📚 Explore Content]
A --> E[🏢 NGO Resources]
A --> F[❓ FAQs]
A --> G[📞 Contact]
A --> H[⚙️ Admin Dashboard]
```

---

# 🛠️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Piyushydv08/SafeVoice.git
cd SafeVoice
```

---

## 2️⃣ Install Dependencies

```bash
npm install
npm install -g firebase-tools
npm install -g netlify-cli
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

Add:

- Firebase configuration keys
- Gemini AI API keys
- Storage configuration values

---

## 4️⃣ Start Development Server

```bash
netlify dev
```

---

# ▶️ Usage Guide

1. Open the platform in browser
2. Sign up securely using Firebase Auth
3. Create anonymous content
4. Attach optional media
5. Improve text using AI grammar enhancement
6. Translate content into regional languages
7. Browse NGO support resources

---

# 🤝 Contributing

Contributions are welcome from developers of all experience levels.

---

## Contribution Workflow

```mermaid
flowchart LR

A[Fork Repository] --> B[Create Branch]
B --> C[Make Changes]
C --> D[Test Changes]
D --> E[Commit Code]
E --> F[Push Branch]
F --> G[Create Pull Request]
```

---

# 🌟 GSSoC'26 Participation

SafeVoice is officially part of GirlScript Summer of Code 2026.

Contributors can:

- Improve frontend UI/UX
- Build backend APIs
- Add AI integrations
- Improve accessibility
- Enhance documentation
- Optimize performance

---

# 📧 Contact

## Maintainers

- Aditi Raj
- Piyush Yadav

### Support Channels

- GitHub Issues
- Pull Request Discussions
- LinkedIn Profiles

---

# 📄 License

Licensed under the MIT License.

---

# ⭐ Support The Project

If you found this project useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🧑‍💻 Contribute improvements
- 📢 Share with others

---

# 💙 SafeVoice Mission

> “Creating a secure space where voices can be heard safely, anonymously, and without fear.”
