---
name: dotnet-commands
description: Guide for running, building, testing, and applying migrations to the .NET 9 backend.
---

# .NET Developer & Command Guide

Use this skill when interacting with the .NET backend API ([CRMReact.Server](file:///E:/Fontes/CRMReact/CRMReact.Server)) or running database migrations.

## Commands Reference

Always run dotnet commands from the root directory [CRMReact.sln](file:///E:/Fontes/CRMReact/CRMReact.sln) or the specific project directory.

*   **Build Solution**:
    ```bash
    dotnet build
    ```
*   **Run Aspire Orchestrator**:
    ```bash
    dotnet run --project CRMReact.AppHost
    ```
*   **Database Migrations**:
    Migrations are applied automatically in development mode on startup inside [Program.cs](file:///E:/Fontes/CRMReact/CRMReact.Server/Program.cs). To manually add a migration:
    ```bash
    dotnet ef migrations add <MigrationName> --project CRMReact.Data --startup-project CRMReact.Server
    ```

## Error Handling
If EF Core operations fail, ensure SQLite database folder permission exists and check the Data Source connection string in [Program.cs](file:///E:/Fontes/CRMReact/CRMReact.Server/Program.cs).
