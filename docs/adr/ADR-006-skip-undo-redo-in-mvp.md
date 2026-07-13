# ADR-006: Skip Undo/Redo in MVP

**Status:** Proposed

## Context

Most editing applications provide undo (Ctrl+Z) and redo (Ctrl+Y) functionality. Implementing undo/redo requires:
- Maintaining a history stack of state snapshots
- Reverting canvas state to previous snapshots
- Clearing redo stack on new actions
- Careful handling of edge cases (undo during drag, etc.)

This adds non-trivial complexity.

## Decision

We will **not implement undo/redo in the MVP**. If users need to revert changes, they can re-import a previously exported file or start over.

## Consequences

**Positive:**
- Eliminates complex state management (history stack).
- Reduces bugs related to state reversal.
- Faster MVP delivery.
- Users can protect themselves: export frequently.
- Cleaner codebase without undo logic initially.

**Negative:**
- Less forgiving UX; mistakes require re-export and re-import.
- Could frustrate users used to undo.
- Users may be hesitant to make experimental changes.
- v2 will need to retrofit undo/redo (might require refactoring state structure).

## Alternatives Considered

- **Implement undo/redo:** Proper solution but adds 2-3 days of work. Worth it in v2 based on user feedback.
- **Browser history API:** Doesn't map well to diagram state; confusing for users.
- **Auto-save to localStorage:** Users can "undo" by clearing localStorage and refreshing. Crude but possible.

## Implementation Notes

- No undo/redo keyboard shortcuts or UI buttons in MVP.
- No state history stack needed.
- When v2 arrives, consider refactoring state to use Immer or Redux for immutable snapshots (easier history management).
- Document this limitation in README and project status.

**Migration path to v2:**
If undo/redo becomes essential, consider:
1. Wrapping state in Immer for immutable updates.
2. Storing snapshots in a stack on every action.
3. Implementing Ctrl+Z / Ctrl+Y handlers.
