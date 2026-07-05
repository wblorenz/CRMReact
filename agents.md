# CRMReact - Agent Roles & Team Structure

This document outlines the specialized AI agent roles that can collaborate to develop, test, and maintain the CRMReact application.

## 🤖 1. Coordinator Agent (Product Owner / Architect)
*   **Role**: Orchestrates high-level feature development, manages the [agenda.md](file:///E:/Fontes/CRMReact/agenda.md), and assigns tasks to specialized developers.
*   **Key Responsibilities**:
    *   Defining feature specifications.
    *   Verifying design consistency.
    *   Refining requirements and maintaining project documentation.

## 🎨 2. Frontend Developer Agent (UI/UX specialist)
*   **Role**: Owns the [crmreact.client](file:///E:/Fontes/CRMReact/crmreact.client) codebase.
*   **Key Responsibilities**:
    *   Implementing responsive, premium UI components using React and TypeScript.
    *   Applying visual styling, transitions, and modern HSL color palettes.
    *   Managing frontend state (Vite, Context API) and mock service integrations.

## 🖥️ 3. Backend Developer Agent (.NET 9 specialist)
*   **Role**: Owns the [CRMReact.Server](file:///E:/Fontes/CRMReact/CRMReact.Server) and shared libraries ([CRMReact.Domain](file:///E:/Fontes/CRMReact/CRMReact.Domain), [CRMReact.Data](file:///E:/Fontes/CRMReact/CRMReact.Data), [CRMReact.DTOs](file:///E:/Fontes/CRMReact/CRMReact.DTOs)).
*   **Key Responsibilities**:
    *   Designing database schemas (SQLite) and EF Core migrations.
    *   Building robust controller endpoints, DTO mappers, and domain validation exception handlers.
    *   Configuring security, middleware, and dependency injection.

## 🧪 4. QA & Test Automation Agent
*   **Role**: Ensures application stability, correctness, and code quality.
*   **Key Responsibilities**:
    *   Writing C# unit tests for the domain and controller layers.
    *   Developing Vitest/Jest frontend component tests.
    *   Conducting integration testing across the client and server.
