# Paper Reading RAG Plan

Goal: keep the current extension lightweight while making paper questions more reliable than plain top-k chunk retrieval.

## Target Architecture

```text
stored cleaned Markdown
-> section-aware chunks
-> query intent router
-> retrieval plan
-> lexical scoring + section boost
-> neighbor / section expansion
-> lightweight evidence compression
-> prompt local Codex or another provider
```

The browser extension remains the orchestrator. Codex is still an answer engine, not a process that scans local files.

## Implemented Steps

1. Add this plan as the working design note.
2. Add a rule-based query intent router.
3. Attach weak section metadata to chunks when documents are created or rehydrated from storage.
4. Upgrade retrieval to use intent-aware section boosts and neighbor expansion.
5. Add a deterministic paper overview cache on the stored document record.
6. Add lightweight evidence compression before prompt assembly.

## Intent Classes

- `selection_explain`: selected text is present; explain local meaning first.
- `paper_overview`: broad prompts such as "explain the paper" or "summarize this paper".
- `method_question`: questions about method, system, study design, model, or procedure.
- `result_question`: questions about findings, results, evaluation, or evidence.
- `limitation_question`: questions about limitations, threats, caveats, or future work.
- `comparison_question`: compare, contrast, difference, versus.
- `targeted_qa`: default focused question answering.

## Retrieval Policy

Selection questions keep nearby context around the selected text. Whole-paper questions use opening context plus retrieved evidence. Overview questions use the cached paper overview and section samples instead of pretending top-k retrieval covers the whole paper.

Retrieval remains lexical for now. Section metadata is treated as a weak signal only: it is inferred from plausible Markdown headings when available, but the system must still work when headings are missing, wrong, or noisy.

## Future Upgrades

- Add fixture-based tests for RAG prompt construction.
- Add optional embedding-based retrieval behind the same `retrieveRelevantChunks()` contract.
- Add selected-text offsets into Markdown to store quote references instead of full quote text.
- Add LLM reranking only if the deterministic evidence compression is not enough.
