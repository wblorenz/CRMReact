# Workspace Rules & Agent Guidelines

## 1. Git Command Execution
- **Always Allowed & Proactively Executed**: The agent is authorized and expected to execute read-only git commands freely using `run_command` whenever relevant to a task, including:
  - `git diff` (staged, unstaged, or branch comparisons)
  - `git log` (using `-n <N>` or `--oneline` to keep output concise)
  - `git status`
  - `git show`
  - `git branch`
- Do not hesitate or ask for manual confirmation before running read-only inspection commands.

## 2. General Principles
- Maintain documentation integrity and preserve existing comments.
- Follow the architectural guidelines defined in [agents.md](file:///E:/Fontes/CRMReact/agents.md).
