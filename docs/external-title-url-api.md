# External title–URL API

Paper Toaster exposes a read-only Chrome cross-extension messaging API for its recorded paper title–URL mappings. It does not expose notes, conversations, labels, document keys, or write operations.

## Request

Send the request from the consuming extension's service worker or another extension page. Replace `PAPER_TOASTER_EXTENSION_ID` with the ID shown for Paper Toaster at `chrome://extensions`.

```js
const PAPER_TOASTER_EXTENSION_ID = "replace-with-paper-toaster-extension-id";

export async function getPaperToasterMappings(scope = "all") {
  const response = await chrome.runtime.sendMessage(
    PAPER_TOASTER_EXTENSION_ID,
    {
      type: "paper-toaster:get-paper-title-url-mappings",
      apiVersion: 1,
      scope
    }
  );

  if (!response?.ok) {
    throw new Error(response?.error?.message || "Paper Toaster API request failed.");
  }
  return response.mappings;
}
```

`scope` accepts:

- `"all"` (default): Dashboard and Archive records.
- `"board"`: Dashboard records only.
- `"archive"`: Archive records only.

No additional permission is required in the consuming extension's manifest. Paper Toaster must be installed and enabled. The call rejects through `chrome.runtime.lastError`/the returned promise when the target extension ID is wrong or Paper Toaster is unavailable.

## Successful response

```js
{
  ok: true,
  apiVersion: 1,
  scope: "all",
  mappings: [
    {
      title: "Attention Is All You Need",
      url: "https://example.org/paper.pdf"
    }
  ]
}
```

The current development manifest accepts requests from any Chrome extension and does not accept requests from ordinary web pages. Once the consuming extension has a stable ID, replace `"*"` in Paper Toaster's `externally_connectable.ids` with that ID to restrict access.
