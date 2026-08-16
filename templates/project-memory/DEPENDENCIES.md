# Dependency Governance

**Last Verified:** {{DATE}}  
**Audit Policy:** Require automated vulnerability & license checks before adding new packages.

## Recorded Dependencies
{{DEPENDENCY_LIST}}

## Policy for New Dependencies
1. Check if existing installed packages or framework built-ins already solve the problem.
2. Evaluate maintenance activity, security history, and license compatibility (e.g. MIT, Apache-2.0, BSD).
3. Do not add packages for trivial operations easily handled by 5-10 lines of standard code.
