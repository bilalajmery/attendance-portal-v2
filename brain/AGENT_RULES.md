# MANDATORY AGENT RULES — ATTENDANCE PORTAL

> [!CRITICAL]
> **Operating Contract for AI Agents**:
> These rules are **NON-NEGOTIABLE**. Every AI agent operating on the **Attendance Portal** codebase must adhere strictly to these protocols.

---

## 1. The Core Development Loop

For every future development task:

$$\textbf{READ BRAIN} \longrightarrow \textbf{INSPECT CODE} \longrightarrow \textbf{UNDERSTAND IMPACT} \longrightarrow \textbf{IMPLEMENT} \longrightarrow \textbf{VERIFY} \longrightarrow \textbf{UPDATE BRAIN} \longrightarrow \textbf{REPORT}$$

### Step 1: Pre-Task Investigation (Before Touching Code)
1. Read `brain/README.md`.
2. Read `brain/AGENT_RULES.md` (this file).
3. Read `brain/CONTEXT_HANDOFF.md`.
4. Read `brain/CURRENT_STATUS.md`.
5. Read domain-specific brain files relevant to the task (e.g. `BUSINESS_LOGIC.md`, `ATTENDANCE_RULES.md`, `DATABASE.md`).
6. Inspect the actual relevant source code in `src/`.
7. The active source code is the single source of truth for runtime behavior. If brain docs conflict with code, investigate before modifying anything.

### Step 2: Implementation Discipline (During Work)
- **Smallest Coherent Changes**: Make minimal surgical edits. Avoid sprawling refactors or unsolicited code aesthetic changes.
- **Preserve Business Logic**: Never silently modify deduction math, penalty rates (1.2x off penalty), grace periods, or cutoff dates without explicit user instruction.
- **Maintain Security Controls**: Never disable role guards, remove WiFi IP checks, or weaken authentication checks.
- **Handle Errors Gracefully**: Always wrap async Firestore calls in try/catch with `sonner` notifications and console logging.
- **Respect Coding Standards**: Adhere to conventions documented in `CODING_STANDARDS.md`.

### Step 3: Post-Task Memory Preservation (After Work)
Immediately upon completing an implementation task, you must automatically:
1. Review all modified files.
2. Verify results using safe, read-only terminal checks (e.g. `npm run build` or `npm run lint`).
3. Update the affected brain documents (e.g. `FEATURE_REGISTRY.md`, `MODULE_REGISTRY.md`).
4. Record any new architectural decisions in `DECISIONS.md`.
5. Record any new bugs or technical debt in `KNOWN_ISSUES.md`.
6. Update `CURRENT_STATUS.md` and `CONTEXT_HANDOFF.md`.
7. Update `CHANGELOG.md`.
8. Create or update the relevant task record under `brain/tasks/TASK-XXXX-...md`.
9. Report implementation and verification results to the user.

---

## 2. Strict Source Code Protection Rules
- **Do not redesign interfaces** unless explicitly requested by the user.
- **Do not alter existing database schemas** or Firestore document collection paths without approval.
- **Do not delete or rename existing application files** without approval.
- **Do not introduce heavy third-party dependencies** without user consent.

---

## 3. Git Policy — MANUAL ONLY
> [!CAUTION]
> **The project owner retains exclusive manual control over all Git operations.**
> 
> Under NO circumstances may an AI agent automatically:
> - Run `git add` or stage files
> - Run `git commit`
> - Run `git push` or `git pull`
> - Run `git checkout`, `git switch`, or `git branch`
> - Run `git merge` or `git rebase`
> - Run `git reset` or `git clean`
> 
> You may use **read-only** commands (`git status`, `git log`, `git diff`) to inspect the working tree.
> Report changed files to the user and suggest commit messages, but leave all Git write operations to the human developer.

---

## 4. Privacy & Confidentiality
- Never print, log, or commit private keys, service account JSON files, or user passwords.
- Never record employee personal details (phone numbers, addresses, government IDs) in brain documentation. Use generic placeholders.
