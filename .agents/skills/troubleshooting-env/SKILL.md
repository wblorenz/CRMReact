---
name: troubleshooting-env
description: Guides for resolving local environment setup issues such as missing git, node, or .NET CLI commands.
---

# Local Environment Troubleshooting Guide

Use this skill when local commands fail due to missing dependencies, PATH issues, or execution policies.

## 1. Git Command Not Found (CommandNotFoundException)
If running `git status` or other Git commands fails because the terminal cannot find the `git` executable:
*   **Verify Installation**: Install Git from [git-scm.com](https://git-scm.com/).
*   **Configure Environment Variables**: Ensure the path `C:\Program Files\Git\cmd\` is added to the system or user PATH environment variable.
*   **Alternative**: If Git is not installed and cannot be added, perform operations manually or use built-in filesystem tools to track edits, until Git can be set up.

## 2. Node & npm Errors
If running frontend build scripts fails:
*   Make sure Node.js (v18+) is installed.
*   Run commands from the [crmreact.client](file:///E:/Fontes/CRMReact/crmreact.client) directory.
