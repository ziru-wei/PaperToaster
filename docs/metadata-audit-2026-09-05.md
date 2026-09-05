# PDF Metadata Audit 2026-09-05

Scope: 10 most recently downloaded PDFs from `/Users/ziru/Downloads` at roughly 2026-09-05 10:09-10:11.

Command:

```sh
node scripts/audit-pdf-metadata.js \
  "/Users/ziru/Downloads/Weiser-Computer21st-1991.pdf" \
  "/Users/ziru/Downloads/Seeing_Thru_Walls_Visualizing_Mobile_Robots_in_Augmented_Reality.pdf" \
  "/Users/ziru/Downloads/1029632.1029676.pdf" \
  "/Users/ziru/Downloads/s00779-014-0775-2 (1).pdf" \
  "/Users/ziru/Downloads/bakker-chi14wp.pdf" \
  "/Users/ziru/Downloads/Gaze-Vergence-Controlled_See-Through_Vision_in_Augmented_Reality.pdf" \
  "/Users/ziru/Downloads/3290605.3300233.pdf" \
  "/Users/ziru/Downloads/3746059.3747748.pdf" \
  "/Users/ziru/Downloads/s00779-014-0775-2.pdf" \
  "/Users/ziru/Downloads/3491102.3501939 (1).pdf"
```

## Summary

XMP metadata was empty for all 10 samples. The only consistently present fields are technical PDF fields such as `PDFFormatVersion`, `IsLinearized`, `Producer`, and sometimes creation/modification dates. These are not paper identity fields.

Usable identity/title fields were inconsistent:

- `info.Title`: usable in 6/10 samples.
- `info.Title`: absent in 3/10 samples.
- `info.Title`: bad in 1/10 sample (`Microsoft Word - p321-matthews-final.doc`).
- `info.Author`: present in 5/10 samples.
- `info.Subject`: present in 5/10 samples.
- `info.Keywords`: present in 4/10 samples.
- DOI in metadata: present in 1/10 samples, embedded inside `Subject`, not as a dedicated field.
- XMP DOI/title fields: 0/10 samples.

## Sample Table

| File | Pages | Useful title in metadata | Other useful fields | Problem |
| --- | ---: | --- | --- | --- |
| `Weiser-Computer21st-1991.pdf` | 13 | `The Computer for the 21 st Century` | none | title spacing has artifact |
| `Seeing_Thru_Walls_Visualizing_Mobile_Robots_in_Augmented_Reality.pdf` | 6 | `Seeing Thru Walls: Visualizing Mobile Robots in Augmented Reality` | `Author`, `Subject` includes DOI | DOI is buried in subject |
| `1029632.1029676.pdf` | 10 | no | `Author` only | title is source filename |
| `s00779-014-0775-2 (1).pdf` | 16 | no | none | metadata has no paper identity |
| `bakker-chi14wp.pdf` | 79 | `Proceedings of Peripheral Interaction Shaping the Research and Design Space` | `Author`, `Subject`, `Keywords` | workshop proceedings, not a normal paper |
| `Gaze-Vergence-Controlled_See-Through_Vision_in_Augmented_Reality.pdf` | 11 | no | none | metadata has no paper identity |
| `3290605.3300233.pdf` | 13 | `Guidelines for Human-AI Interaction` | `Author`, `Subject`, `Keywords` | good ACM metadata |
| `3746059.3747748.pdf` | 22 | `Sensible Agent: A Framework for Unobtrusive Interaction with Proactive AR Agents` | `Author`, `Subject`, `Keywords` | good ACM metadata |
| `s00779-014-0775-2.pdf` | 16 | no | none | duplicate of Springer sample, same missing identity fields |
| `3491102.3501939 (1).pdf` | 18 | `Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization` | `Author`, `Subject`, `Keywords` | good ACM metadata |

## Implication For Memory Key

Title should not be used as the memory key:

- It can be absent.
- It can be wrong.
- It can be manually edited by the user.
- Different papers can share generic/proceedings-like titles.
- Duplicate downloads can have different filenames but the same paper identity.

Recommended key priority remains:

1. DOI from URL or a clearly parsed metadata/source field.
2. arXiv id from URL.
3. IEEE `arnumber` from URL.
4. Cleaned URL fallback.

Metadata should remain a title candidate source, not the primary identity source, until a larger audit shows a stable cross-publisher identity field.
