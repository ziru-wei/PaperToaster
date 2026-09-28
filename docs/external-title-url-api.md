# External title–URL API

Paper Toaster exposes a read-only cross-extension messaging API for its recorded paper title–URL mappings. It does not expose notes, conversations, labels, document keys, or write operations.

## Request

Send the request from the consuming extension's background script or another extension page. In Firefox, Paper Toaster's ID is fixed by `browser_specific_settings.gecko.id` in its manifest (`paper-toaster@ziru-wei`); it is also shown at `about:debugging#/runtime/this-firefox`.

```js
const PAPER_TOASTER_EXTENSION_ID = "paper-toaster@ziru-wei";

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

No additional permission is required in the consuming extension's manifest. Paper Toaster must be installed and enabled. The returned promise rejects when the target extension ID is wrong or Paper Toaster is unavailable.

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

Firefox does not support the `externally_connectable` manifest key, so Paper Toaster accepts requests from any installed extension. Ordinary web pages cannot send these messages. To restrict access to a specific consumer, check `sender.id` in `handleExternalMessage` in `src/background/background.js`.
