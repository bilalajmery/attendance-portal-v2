# TASK MEMORY DIRECTORY — ATTENDANCE PORTAL

This directory preserves structured records of meaningful development and maintenance tasks executed on the **Attendance Portal**.

### File Naming Convention
Every task file must be named according to the standard convention:
```
TASK-XXXX-short-description.md
```
*(e.g., `TASK-0001-setup-local-env.md` or `TASK-0002-dynamic-office-ip.md`)*

### Operating Protocol
1. **Create Record**: When beginning a significant task, copy `TASK_TEMPLATE.md` to a new `TASK-XXXX-...md` file in this directory.
2. **Track Evolution**: Keep the file updated as implementation progresses.
3. **Record Evidence**: Include exact file paths, lines changed, verification commands, and test outputs.
4. **Never Create Duplicates**: Never create multiple conflicting files for the same task.
5. **No Historical Fabrications**: When documenting past tasks, only record details substantiated by Git commit history or code comments.
