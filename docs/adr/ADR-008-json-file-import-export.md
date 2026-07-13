# ADR-008: JSON File Import/Export (No Backend Persistence)

**Status:** Proposed

## Context

Diagrams need to persist across sessions. Options:
- Backend database: User account, cloud sync, sharing. Requires server + auth.
- Browser localStorage: Simple, but limited size (~5-10MB) and single device.
- JSON file export/import: Users manually download and upload. No server needed.
- Session storage only: Lose everything on refresh (unacceptable).

The choice affects user workflow and infrastructure complexity.

## Decision

We will use **JSON file export/import**. Users can download their diagram as a JSON file and upload it later to restore state. No server or database.

## Consequences

**Positive:**
- Zero backend infrastructure needed.
- Simple to implement (JSON.stringify / JSON.parse).
- Users own their files; can version control, backup, or share manually.
- No authentication or user management.
- Portable; users can email files, check into git, etc.
- Privacy-friendly (no cloud storage).

**Negative:**
- Manual workflow: users must remember to export.
- No automatic backups or sync across devices.
- No sharing workflow (must email files).
- Not suitable for collaborative editing.
- Users might lose work if they don't export before closing.

## Alternatives Considered

- **Backend database:** Enables cloud sync, sharing, accounts. 3-5x more work for MVP. Deferred to v2.
- **localStorage:** Simple, but limited to single browser/device. Less portable. Insufficient for serious use.
- **IndexedDB:** More storage than localStorage, but still device-bound. Better but not portable.

## Implementation Notes

**Export:**
- Serialize state to JSON: `{ shapes: [...], connectors: [...], version: "1.0" }`.
- Add a timestamp or filename for user convenience.
- Use browser download API: create a Blob, generate a download link, trigger click.

**Import:**
- File input element or drag-and-drop zone.
- Parse JSON, validate structure (shapes array, connectors array).
- Replace current canvas state with imported data.
- Clear any in-progress edits.

**Data structure:**
```json
{
  "version": "1.0",
  "shapes": [
    { "id": "shape-1", "type": "rectangle", "x": 100, "y": 50, "label": "Start" }
  ],
  "connectors": [
    { "id": "conn-1", "source": "shape-1", "target": "shape-2", "label": "Next" }
  ]
}
```

**Future v2 migration:**
If backend persistence becomes needed, the JSON format can become the API payload. No breaking changes; just upload the JSON to a server instead of a file.
