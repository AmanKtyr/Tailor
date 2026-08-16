---
name: project-memory
description: Manages the .ai/ project memory layer, progressive disclosure, document synchronization, and drift detection between source reality and memory cache.
---

# Project Memory Skill

Activate this skill when interacting with, reading, updating, or repairing `.ai/` memory files or resolving documentation drift.

## 1. Project Memory Hierarchy
Project memory is an **indexed cache of project facts**, NOT absolute truth. When a conflict occurs:
1. Verifiable Source Code & Configs (`package.json`, `schema.prisma`, `routes`)
2. Project Memory Files (`.ai/STACK.md`, `.ai/API.md`, etc.)
3. Old comments or outdated human docs

If memory conflicts with source code: **Trust the source code, flag the drift, and update the memory document.**

## 2. Progressive Disclosure Rules
- Read `.ai/INDEX.md` first.
- Only load domain documents relevant to the current task:
  - Working on UI? Read `.ai/UI.md` and `.ai/CONVENTIONS.md`.
  - Working on Database? Read `.ai/DATABASE.md`.
  - Adding a package? Read `.ai/DEPENDENCIES.md`.
- Keep memory documents concise, structured, and evidence-based.

## 3. Drift Detection & Memory Sync
- Check if manifests (`package.json`, `requirements.txt`) have changed.
- If dependencies or database models were modified during an agent session, update the corresponding `.ai/` document before finishing.
