<p align="center">
  <img src="https://img.shields.io/npm/v/@tech-leads-club/agent-skills?style=flat-square&color=blue" alt="npm version" />
  <img src="https://img.shields.io/github/license/tech-leads-club/agent-skills?style=flat-square" alt="license" />
  <img src="https://img.shields.io/github/actions/workflow/status/tech-leads-club/agent-skills/ci.yml?style=flat-square" alt="build status" />
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen?style=flat-square" alt="node version" />
</p>

<h1 align="center">🧠 Agent Skills</h1>

<p align="center">
  <strong>A curated collection of skills for AI coding agents</strong>
</p>

<p align="center">
  Extend the capabilities of <b>Antigravity</b>, <b>Claude Code</b>, <b>Cursor</b>, <b>GitHub Copilot</b>, and more with reusable, packaged instructions.
</p>

---

## ✨ What are Skills?

Skills are packaged instructions and resources that extend AI agent capabilities. Think of them as **plugins for your AI assistant** — they teach your agent new workflows, patterns, and specialized knowledge.

```
skills/
  spec-driven-dev/
    SKILL.md          ← Main instructions
    templates/        ← File templates
    references/       ← On-demand documentation
```

## 🚀 Quick Start

### Install Skills in Your Project

```bash
npx @tech-leads-club/agent-skills
```

This launches an interactive menu to:
1. **Select skills** from the curated collection
2. **Choose agents** (Antigravity, Claude Code, Cursor, etc.)
3. **Install** via symlinks to the appropriate directories

### CLI Options

```bash
# Interactive mode (default)
npx @tech-leads-club/agent-skills

# Install globally (to ~/.agent/skills, ~/.claude/skills, etc.)
npx @tech-leads-club/agent-skills install -g

# List available skills
npx @tech-leads-club/agent-skills list

# Install a specific skill
npx @tech-leads-club/agent-skills install -s spec-driven-dev

# Install to specific agents
npx @tech-leads-club/agent-skills install -a antigravity cursor

# Use copy instead of symlink
npx @tech-leads-club/agent-skills install --copy

# Remove skills (interactive)
npx @tech-leads-club/agent-skills remove

# Remove a specific skill
npx @tech-leads-club/agent-skills remove -s spec-driven-dev

# Remove from global installation
npx @tech-leads-club/agent-skills remove -g -s spec-driven-dev

# Show help
npx @tech-leads-club/agent-skills --help
npx @tech-leads-club/agent-skills install --help
npx @tech-leads-club/agent-skills remove --help
```

---

## 📦 Available Skills

| Skill | Description |
|-------|-------------|
| **spec-driven-dev** | Specification-driven development workflow with 5 phases: specify → plan → tasks → implement → validate |
| **skill-creator** | Meta-skill for creating new skills following best practices |
| **subagent-creator** | Create specialized subagents for complex tasks |
| **cursor-skill-creator** | Cursor-specific skill creation |
| **cursor-subagent-creator** | Cursor-specific subagent creation |

---

## 🛠 For Contributors

### Prerequisites

- **Node.js** ≥ 22
- **npm** (comes with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/tech-leads-club/agent-skills.git
cd agent-skills

# Install dependencies
npm ci

# Build all packages
npm run build
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Run CLI locally (interactive mode) |
| `npm run g <name>` | Generate a new skill |
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run lint` | Lint codebase |
| `npm run lint:fix` | Fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run release:dry` | Preview release (dry-run) |

### Creating a New Skill

Use the NX generator:

```bash
nx g @tech-leads-club/skill-plugin:skill my-awesome-skill
```

This creates `skills/my-awesome-skill/SKILL.md` with the correct template structure.

### Skill Structure

```
skills/my-skill/
├── SKILL.md              # Required: main instructions
├── scripts/              # Optional: executable scripts
├── references/           # Optional: on-demand documentation
├── templates/            # Optional: file templates
└── assets/               # Optional: images, files
```

### SKILL.md Format

```markdown
---
name: my-skill
description: What this skill does. Use when user says "trigger phrase".
---

# My Skill

Brief description.

## Process

1. Step one
2. Step two
3. ...
```

### Best Practices

- **Keep SKILL.md under 500 lines** — use `references/` for detailed docs
- **Write specific descriptions** — include trigger phrases
- **Assume the agent is smart** — only add what it doesn't already know
- **Prefer scripts over inline code** — reduces context window usage

---

## 📁 Project Structure

```
agent-skills/
├── packages/
│   └── cli/                    # @tech-leads-club/agent-skills CLI package
├── tools/
│   └── skill-plugin/           # NX generator plugin
├── skills/                     # Skill definitions
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: lint, test, build
│       └── release.yml         # Release: version, publish
├── nx.json                     # NX configuration
└── package.json                # Root package.json
```

---

## 🔄 Release Process

This project uses **NX Release** with **Conventional Commits** for automated versioning:

| Commit Prefix | Version Bump | Example |
|---------------|--------------|---------|
| `feat:` | Minor (0.X.0) | `feat: add new skill` |
| `fix:` | Patch (0.0.X) | `fix: correct symlink path` |
| `feat!:` | Major (X.0.0) | `feat!: breaking API change` |
| `docs:` | No bump | `docs: update README` |
| `chore:` | No bump | `chore: update deps` |

Releases are automated via GitHub Actions when merging to `main`.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-skill`)
3. **Commit** with conventional commits (`git commit -m "feat: add amazing skill"`)
4. **Push** to your fork (`git push origin feat/amazing-skill`)
5. **Open** a Pull Request

---

## 📄 License

MIT © [Tech Leads Club](https://github.com/tech-leads-club)

---

<p align="center">
  <sub>Built with ❤️ by the Tech Leads Club community</sub>
</p>
