# Edge PDF AI Chat Prototype Proposal

## 1. Project Goal

Build a minimal Microsoft Edge / Chromium browser extension that works alongside **Google Scholar PDF Reader** and provides exactly two AI interaction modes:

1. **Chat with Whole PDF**
2. **Ask AI About Selected Text**

The extension should not replace the PDF viewer, modify Google Scholar PDF Reader internals, or depend heavily on its implementation.

The target workflow is:

```text
Open PDF in Edge
        ↓
Google Scholar PDF Reader renders the PDF
        ↓
Our extension reads the same document context
        ↓
User chats with the whole PDF
or
selects text and asks AI about that selection
```

Primary target example:

```text
https://dl.acm.org/doi/pdf/10.1145/3746059.3747721
```

---

# 2. Core Product Requirements

## Feature A — Chat with Whole PDF

When the active browser tab contains a PDF:

1. Detect the active PDF URL.
2. Retrieve the PDF file.
3. Parse text from all pages.
4. Split the document into searchable chunks.
5. Accept a user question from an Edge Side Panel.
6. Retrieve the most relevant document chunks.
7. Send the retrieved context and question to an LLM.
8. Return an answer grounded in the PDF.
9. Include page references where possible.

Example:

```text
User:
What is the main contribution of this paper?

Assistant:
The paper proposes ...

Relevant pages:
p. 2, p. 4, p. 7
```

The user should not need to upload the PDF manually.

---

## Feature B — Ask About Selection

When the user selects text inside the PDF viewer:

1. Detect the selected text.
2. Store the latest non-empty selection.
3. Display the selection in the extension Side Panel.
4. Allow the user to ask a question about that selection.
5. Send only the selection plus the user's question to the LLM.

Example:

```text
Selected text:

"We therefore assume conditional independence..."

User:
Why is this assumption necessary?

Assistant:
...
```

Selection mode should not require parsing the whole PDF before it becomes usable.

---

# 3. Non-Goals

Do NOT implement these in V0.1:

* Current-page tracking
* Automatic scroll synchronization
* PDF annotation synchronization
* Highlight synchronization
* Editing Google Scholar PDF Reader
* Replacing the PDF viewer
* Vector database
* Persistent embeddings
* OCR
* Figure/image understanding
* Reference manager integration
* Zotero integration
* Multi-PDF library
* Cloud document storage
* Cross-device sync
* Browser history indexing
* Automatic summarization on every PDF load

Keep V0.1 intentionally small.

---

# 4. Target Environment

Primary browser:

```text
Microsoft Edge
Chromium-based
Manifest V3 extension
```

Primary PDF viewer:

```text
Google Scholar PDF Reader
Chrome Web Store extension
```

Important assumption:

The browser address bar remains on the original PDF URL, for example:

```text
https://dl.acm.org/doi/pdf/10.1145/3746059.3747721
```

The implementation should therefore treat the original PDF URL as the canonical document identifier.

Do not depend on access to Google Scholar PDF Reader's internal JavaScript objects.

---

# 5. Proposed Architecture

```text
Microsoft Edge
│
├── Active PDF Tab
│     │
│     ├── Google Scholar PDF Reader
│     │      └── Handles PDF rendering / reading UI
│     │
│     └── Content Script
│            └── Captures selected text
│
├── Extension Service Worker
│     │
│     ├── Detect active tab
│     ├── Identify PDF URL
│     ├── Fetch PDF
│     ├── Cache parsed document
│     └── Coordinate messages
│
├── PDF Processing Layer
│     │
│     ├── PDF.js / pdfjs-dist
│     ├── Extract text page-by-page
│     ├── Normalize text
│     └── Build chunks with page metadata
│
├── Retrieval Layer
│     │
│     └── Lightweight lexical retrieval
│
└── Edge Side Panel
      │
      ├── Whole PDF mode
      ├── Selection mode
      ├── Chat history
      └── LLM API client
```

---

# 6. Extension Components

Suggested project structure:

```text
pdf-ai-extension/
│
├── manifest.json
│
├── src/
│   │
│   ├── background/
│   │   └── service-worker.js
│   │
│   ├── content/
│   │   └── selection-listener.js
│   │
│   ├── sidepanel/
│   │   ├── sidepanel.html
│   │   ├── sidepanel.js
│   │   └── sidepanel.css
│   │
│   ├── pdf/
│   │   ├── fetch-pdf.js
│   │   ├── parse-pdf.js
│   │   ├── chunk-document.js
│   │   └── retrieve.js
│   │
│   ├── llm/
│   │   └── client.js
│   │
│   └── shared/
│       ├── messages.js
│       └── types.js
│
├── vendor/
│   └── pdfjs/
│
└── README.md
```

TypeScript is preferable if the coding agent wants stronger structure, but plain JavaScript is acceptable for the first prototype.

---

# 7. Manifest Requirements

Use Manifest V3.

Likely permissions:

```json
{
  "permissions": [
    "activeTab",
    "tabs",
    "storage",
    "scripting",
    "sidePanel"
  ]
}
```

Host permissions may initially use:

```json
{
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ]
}
```

For development this is acceptable.

Later narrow permissions where practical.

The extension should not request unnecessary permissions.

---

# 8. PDF Detection

Do not rely only on `.pdf` filename suffixes.

A URL may look like:

```text
https://dl.acm.org/doi/pdf/10.1145/3746059.3747721
```

which does not end with:

```text
.pdf
```

Use multiple signals.

Possible detection strategy:

```text
1. Check active tab URL for common PDF path patterns.
2. Attempt a HEAD or GET request.
3. Inspect Content-Type.
4. Accept application/pdf as authoritative.
```

Preferred logic:

```js
contentType === "application/pdf"
```

URL heuristics should only be a shortcut.

---

# 9. PDF Fetching Strategy

Primary path:

```text
active tab URL
    ↓
fetch()
    ↓
PDF ArrayBuffer
```

Example:

```js
const response = await fetch(pdfUrl, {
  credentials: "include"
});

const contentType =
  response.headers.get("content-type") || "";

if (!contentType.includes("application/pdf")) {
  throw new Error("Active URL did not return a PDF");
}

const pdfBytes = await response.arrayBuffer();
```

Use browser cookies/session credentials when permitted.

---

# 10. Publisher Authentication and Fetch Failures

This is a major implementation risk.

Some publishers may require:

* authenticated browser cookies
* redirects
* anti-bot protection
* referer checks
* temporary download URLs

Test initially against:

```text
ACM Digital Library
arXiv
IEEE Xplore
Springer
direct static PDF URLs
```

V0.1 should use a layered fallback strategy.

## Fetch Path A

```text
background/service worker fetch
```

Use:

```js
credentials: "include"
```

## Fetch Path B

If service-worker fetch fails, attempt the fetch from an injected script running in the tab's origin where possible.

## Fetch Path C

If neither works, report:

```text
Unable to retrieve this PDF directly.
```

Do not silently hallucinate document access.

Do not over-engineer network interception in the first iteration.

---

# 11. PDF Parsing

Use:

```text
pdfjs-dist
```

Extract text page-by-page.

Pseudo-code:

```js
const loadingTask = pdfjsLib.getDocument({
  data: pdfBytes
});

const pdf = await loadingTask.promise;

const pages = [];

for (let pageNumber = 1;
     pageNumber <= pdf.numPages;
     pageNumber++) {

  const page = await pdf.getPage(pageNumber);

  const content =
    await page.getTextContent();

  const text = content.items
    .map(item => item.str)
    .join(" ");

  pages.push({
    pageNumber,
    text
  });
}
```

Preserve page numbers.

Required data shape:

```js
{
  url: "...",
  pageCount: 12,
  pages: [
    {
      pageNumber: 1,
      text: "..."
    }
  ]
}
```

---

# 12. Text Normalization

PDF text extraction often introduces:

* excessive spaces
* line breaks
* broken hyphenation
* repeated headers
* repeated footers
* page numbers

V0.1 only needs basic cleanup.

Recommended:

```text
collapse repeated whitespace
normalize line breaks
merge obvious hyphenated line breaks
drop empty text fragments
```

Do not spend significant effort reconstructing perfect academic document structure yet.

---

# 13. Chunking

Each chunk must preserve page metadata.

Suggested format:

```js
{
  id: "p4-c2",
  pageStart: 4,
  pageEnd: 4,
  text: "..."
}
```

Initial chunk size:

```text
~800–1500 tokens
```

with small overlap:

```text
~100–200 tokens
```

Exact tokenization does not need to be perfect in V0.1.

Character-based chunking is acceptable initially.

---

# 14. Retrieval

Do not implement embeddings or a vector database for V0.1.

Use lightweight lexical retrieval.

Options:

```text
BM25
TF-IDF
keyword overlap
simple weighted token matching
```

Preferred:

```text
BM25
```

Workflow:

```text
Question
   ↓
tokenize
   ↓
score chunks
   ↓
top 5–8 chunks
   ↓
LLM prompt
```

The retriever should return:

```js
[
  {
    pageStart: 3,
    pageEnd: 3,
    text: "...",
    score: 8.7
  }
]
```

---

# 15. Whole-PDF Chat Prompting

System prompt concept:

```text
You are answering questions about the attached PDF.

Use only the supplied PDF context when making claims
about the document.

If the supplied context is insufficient, say so.

When possible, cite the page number associated with
the relevant context.
```

User context:

```text
PDF context:

[Page 3]
...

[Page 7]
...

Question:
What assumptions does the proposed method rely on?
```

The output should preferably contain inline page references:

```text
The method assumes ... [p. 3]
```

Do not claim exact page support unless the relevant retrieved chunk contains that page.

---

# 16. Selection Capture

This is the main interoperability experiment with Google Scholar PDF Reader.

Create a content script that listens for selection changes.

Possible events:

```js
document.addEventListener("mouseup", captureSelection);
document.addEventListener("keyup", captureSelection);
document.addEventListener("selectionchange", ...);
```

Basic implementation:

```js
function getSelectedText() {
  return window
    .getSelection()
    ?.toString()
    .trim() || "";
}
```

When non-empty:

```js
chrome.runtime.sendMessage({
  type: "PDF_SELECTION_CHANGED",
  text
});
```

Debounce selectionchange events.

Do not send empty selections repeatedly.

---

# 17. Selection State

Maintain only the most recent meaningful selection.

Data shape:

```js
{
  text: "...",
  sourceUrl: "...",
  capturedAt: 123456789
}
```

The Side Panel should display:

```text
Selection detected

"We therefore assume ..."

[Ask about this selection]
```

If the selection belongs to another tab or PDF, clear it when the active document changes.

---

# 18. Selection Mode Prompting

Selection mode does not need whole-document retrieval.

Prompt:

```text
Selected text:

"..."

User question:
Why does the author make this assumption?
```

System instruction:

```text
Explain or analyze the selected text.

Do not assume information from the rest of the PDF
unless it has also been supplied.
```

This keeps behavior grounded and predictable.

---

# 19. Side Panel UI

Keep the first UI minimal.

Suggested layout:

```text
┌─────────────────────────────┐
│ PDF AI                      │
├─────────────────────────────┤
│                             │
│ Context                     │
│                             │
│ [ Whole PDF ] [ Selection ] │
│                             │
│ PDF:                        │
│ 3746059.3747721             │
│ 12 pages loaded             │
│                             │
│ Selected text:              │
│ "..."                       │
│                             │
│ ─────────────────────────   │
│                             │
│ User                        │
│ What is the main result?    │
│                             │
│ AI                          │
│ ...                         │
│                             │
│ ─────────────────────────   │
│ Ask anything...             │
│ [ Send ]                    │
└─────────────────────────────┘
```

No complex component library is required.

Plain HTML/CSS is acceptable.

---

# 20. Mode Behavior

## Whole PDF Mode

When selected:

```text
question
    ↓
retrieval against cached chunks
    ↓
LLM
```

## Selection Mode

When selected:

```text
question
    ↓
latest selected text
    ↓
LLM
```

If no selection exists:

```text
No text is currently selected in the PDF.
```

Do not automatically fall back to whole-PDF mode without telling the user.

---

# 21. Side Panel Activation

The user should be able to open the extension through:

```text
Edge toolbar icon
```

Optionally add a keyboard command later.

For V0.1, prioritize reliable functionality over shortcut design.

---

# 22. Caching

Avoid reparsing the same PDF every time a user asks a question.

Cache parsed document data by URL.

Example:

```js
cacheKey = canonicalPdfUrl;
```

Store:

```js
{
  url,
  pageCount,
  pages,
  chunks,
  parsedAt
}
```

For V0.1, in-memory service-worker cache plus optional `chrome.storage.local` is enough.

Be aware that Manifest V3 service workers can terminate.

Therefore persistent local caching is preferable if implementation remains simple.

---

# 23. LLM Provider Abstraction

Do not tightly couple the entire extension to one provider.

Define a minimal interface:

```js
async function askLLM({
  systemPrompt,
  messages,
  context
}) {}
```

Initial implementation can target one API only.

Examples:

```text
OpenAI API
Anthropic API
OpenRouter
local OpenAI-compatible server
```

The provider should be configurable.

---

# 24. API Key Handling

For prototype purposes:

```text
User enters API key in extension settings.
```

Store it in:

```text
chrome.storage.local
```

This is acceptable for a personal prototype but should not be treated as production-grade secret storage.

Do not hardcode API keys in source code.

---

# 25. Error States

Explicitly handle:

## Not a PDF

```text
This tab does not appear to contain a PDF.
```

## PDF fetch failed

```text
Could not retrieve this PDF.
The publisher may require browser authentication
or block extension requests.
```

## PDF parsing failed

```text
The PDF was downloaded but could not be parsed.
```

## No extractable text

```text
No text could be extracted.
This may be a scanned/image-only PDF.
OCR is not supported in V0.1.
```

## No selection

```text
Select text in the PDF first.
```

## LLM failure

Display provider error without losing conversation state.

---

# 26. Security Constraints

Do not:

* execute arbitrary code from the PDF
* inject scripts into another extension's internal pages
* access Google Scholar PDF Reader private internals
* bypass authentication systems
* scrape unrelated tabs
* transmit the entire PDF unless necessary

Prefer transmitting retrieved chunks instead of whole-document content for each query.

---

# 27. Privacy

The extension should clearly distinguish between local processing and LLM transmission.

Locally:

```text
PDF download
PDF parsing
chunking
retrieval
selection capture
```

Sent to LLM:

```text
user question
relevant PDF chunks
or
selected text
```

Do not upload the raw PDF file unless the chosen LLM implementation explicitly requires it.

---

# 28. Prototype Milestones

## Milestone 1 — Extension Shell

Success criteria:

```text
Extension installs in Edge
Side Panel opens
Active tab URL is displayed
```

---

## Milestone 2 — PDF Detection and Fetch

Success criteria:

```text
Detect PDF content type
Download ACM test PDF
Show PDF byte size
```

Test URL:

```text
https://dl.acm.org/doi/pdf/10.1145/3746059.3747721
```

Also test an arXiv PDF.

---

## Milestone 3 — PDF Text Extraction

Success criteria:

```text
Parse PDF with PDF.js
Display number of pages
Display first ~500 chars from page 1
```

---

## Milestone 4 — Whole PDF Retrieval

Success criteria:

```text
Create chunks
Ask a keyword-based question
Return top relevant chunks and their pages
```

Do this before connecting an LLM.

---

## Milestone 5 — Whole PDF Chat

Success criteria:

```text
Question entered in Side Panel
Relevant chunks sent to LLM
Grounded answer returned
Page references shown
```

---

## Milestone 6 — Selection Capture

Success criteria:

```text
Select text inside Google Scholar PDF Reader
Extension receives exact selected string
Side Panel displays it
```

This milestone determines whether direct integration with the viewer is viable.

---

## Milestone 7 — Selection Chat

Success criteria:

```text
Select text
Ask question
LLM receives selection
Answer appears in Side Panel
```

---

# 29. Critical Technical Experiment

Before building extensive UI, immediately test this:

```js
window.getSelection().toString()
```

inside the Google Scholar PDF Reader environment.

Test:

```text
1. Open ACM PDF.
2. Confirm Scholar PDF Reader is active.
3. Inject/run content script.
4. Select visible text.
5. Log selection.
```

Possible result A:

```text
Selection text is accessible.
```

Then continue normally.

Possible result B:

```text
Selection text is not accessible.
```

If so, investigate whether:

* text lives in an iframe
* the iframe is same-origin
* content scripts require `all_frames: true`
* the viewer uses Shadow DOM
* Scholar Reader intercepts/replaces selection
* the selection lives in another extension's isolated context

Do not redesign the entire project before completing this experiment.

---

# 30. Suggested Content Script Configuration

Initially try:

```json
{
  "content_scripts": [
    {
      "matches": [
        "http://*/*",
        "https://*/*"
      ],
      "js": [
        "src/content/selection-listener.js"
      ],
      "all_frames": true,
      "run_at": "document_idle"
    }
  ]
}
```

If this is too broad, narrow it after testing.

---

# 31. Acceptance Criteria

The prototype is considered successful if all of the following work:

### Whole PDF

```text
Open an ACM or arXiv PDF in Edge.
Google Scholar PDF Reader remains the visible viewer.
Open AI Side Panel.
Ask a question about the document.
Receive a grounded answer using PDF content.
Answer includes useful page references.
```

### Selection

```text
Select a sentence or paragraph in the visible PDF.
Open or focus the AI Side Panel.
Selection appears automatically.
Ask a question about it.
Receive an answer grounded in the selection.
```

No manual PDF upload should be required.

---

# 32. Engineering Priority

Prioritize in this order:

```text
1. Reliable PDF retrieval
2. Reliable text extraction
3. Selection capture
4. Grounded retrieval
5. LLM integration
6. UI polish
```

Do not spend significant time on visual design before the first four items are validated.

---

# 33. Recommended Implementation Strategy

The coding agent should first produce a short technical plan, then implement incrementally.

Recommended sequence:

```text
Step 1
Create Manifest V3 extension with Side Panel.

Step 2
Read active tab URL.

Step 3
Verify current document is a PDF.

Step 4
Fetch and parse PDF.

Step 5
Cache page text.

Step 6
Implement chunking + BM25 retrieval.

Step 7
Add LLM provider.

Step 8
Implement selection listener.

Step 9
Connect selection to Side Panel.

Step 10
Test against Google Scholar PDF Reader.

Step 11
Test ACM + arXiv.

Step 12
Document known publisher limitations.
```

---

# 34. Design Principle

The key architectural rule is:

```text
Do not integrate with Google Scholar PDF Reader
more deeply than necessary.
```

Treat Scholar Reader as the presentation layer.

Treat the original PDF URL as the document source.

Our extension independently handles:

```text
document understanding
retrieval
AI conversation
selection context
```

This keeps the implementation resilient if Google changes the Scholar PDF Reader UI or internal architecture.

---

# 35. Final V0.1 Definition

V0.1 should feel like this:

```text
I open any accessible academic PDF in Edge.

Google Scholar PDF Reader displays it normally.

I open my AI Side Panel.

I can:

1. Ask questions about the entire PDF.

2. Highlight/select some text and ask a question
   specifically about that text.

Nothing else.
```

That is the complete intended scope of the first prototype.
