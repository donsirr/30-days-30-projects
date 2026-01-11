# ContextBundler

> Transform your codebase into a single, LLM-ready markdown bundle.

ContextBundler is a privacy-first web application that helps developers prepare their codebases for AI-assisted development. It scans your project folder, generates an organized bundle with file contents, and optimizes it for Large Language Model context windows.

![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-emerald)
![Processing](https://img.shields.io/badge/Processing-Client--Side_Only-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## ✨ Features

### 🔒 Complete Privacy
All processing happens directly in your browser. **No data is ever uploaded to any server.** Your code never leaves your machine.

### 🎯 AI Strategy Personas
Choose from pre-configured AI personas to prime your LLM for specific tasks:

| Persona | Best For |
|---------|----------|
| **Strategic Partner** | Architecture reviews, refactoring, project planning |
| **The Bug Hunter** | Security audits, debugging, edge-case detection |
| **Feature Accelerator** | Rapid feature development, CRUD operations |
| **Custom** | Write your own system prompt |

### 🛡️ Secret Redaction
Automatically scans and redacts sensitive values before bundling:
- API keys and secrets
- Passwords and tokens
- Database connection strings
- AWS credentials
- Environment variables

The key names are preserved (e.g., `API_KEY=[REDACTED]`) so the AI understands context without seeing sensitive data.

### 🧹 Smart Filtering
Automatically excludes files that would waste tokens:
- Dependencies (`node_modules`, `venv`, `vendor`)
- Build outputs (`dist`, `build`, `.next`)
- Lock files (`package-lock.json`, `yarn.lock`)
- Binary files (images, videos, fonts, archives)
- Version control (`.git`, `.svn`)

### 📊 Token Estimation
Real-time token counting using GPT-4o encoding (o200k_base) to help you stay within context limits.

### 💬 Comment Stripping
Optional removal of comments to reduce token count while preserving code logic.

---

## 🚀 How It Works

### 1. Drop Your Project
Drag and drop your project folder onto the drop zone, or click to select a folder using the native file picker.

### 2. Configure Settings
- **Select an AI Strategy** — Choose a persona that matches your task
- **Enable Secret Redaction** — Protect sensitive values automatically
- **Toggle Comment Stripping** — Reduce token usage if needed

### 3. Copy & Paste
Click "Copy Bundle" to copy the optimized markdown to your clipboard, then paste directly into your AI assistant (ChatGPT, Claude, etc.).

---

## 📦 Output Format

The generated bundle follows this structure:

```markdown
---
## AI SYSTEM PROMPT
---
[Your selected AI persona instructions]
---

# Project Bundle

## Project Structure
\```
project/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   └── utils/
│       └── helpers.ts
└── package.json
\```

## Metadata
| Metric | Value |
|--------|-------|
| Files Processed | 42 |
| Total Size | 156 KB |
| Files Skipped | 128 |
| Secrets | Redacted |

## File Contents

### File: src/components/Button.tsx
\```tsx
export function Button({ children }) {
  return <button>{children}</button>;
}
\```

### File: src/utils/helpers.ts
\```typescript
export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};
\```
```

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS v4
- **Token Counting:** gpt-tokenizer (o200k_base encoding)
- **UI Components:** Radix UI (Tooltips)
- **File Access:** File System Access API / DataTransfer API

---

## 🔐 Security Notes

- **Zero server communication** — The app is entirely client-side
- **No tracking or analytics** — Your usage is completely private
- **No data persistence** — Nothing is stored after you close the tab
- **Secret redaction is optional** — You control what gets processed

---

## 📖 Usage Tips

### Maximize Context Efficiency
1. Enable **Comment Stripping** for large codebases
2. Use **Secret Redaction** when sharing sensitive projects
3. Choose the right **AI Strategy** for your task type

### Best Practices
- Review the preview before copying to ensure proper formatting
- Check the token count to avoid exceeding your AI's context limit
- Use the "Strategic Partner" persona for initial project onboarding

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

MIT License — feel free to use this tool for personal or commercial projects.

---

<div align="center">
  <p>Built for developers who value <strong>privacy</strong> and <strong>efficiency</strong>.</p>
  <p>All processing happens in your browser. Always.</p>
</div>
