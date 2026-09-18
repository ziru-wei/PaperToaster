import assert from "node:assert/strict";
import test from "node:test";
import {
  createQuestionResponseMap,
  getChronologicalMessageEntries,
  getHistoricalAssistantMessageIndexes
} from "../src/conversation/message-state.js";

test("a new answer belongs to the latest unanswered question", () => {
  const messages = [
    { role: "user", text: "Earlier failed question" },
    { role: "user", text: "Current question" },
    { role: "assistant", pending: true }
  ];
  assert.deepEqual([...createQuestionResponseMap(messages)], [[1, 2]]);
});

test("normal question-answer pairs retain their own answers", () => {
  const messages = [
    { role: "user" }, { role: "assistant" },
    { role: "user" }, { role: "assistant" }
  ];
  assert.deepEqual([...createQuestionResponseMap(messages)], [[0, 1], [2, 3]]);
});

test("expanded messages sort by time without changing their original indexes", () => {
  const messages = [
    { role: "user", createdAt: 30 },
    { role: "assistant", createdAt: 40 },
    { role: "user", createdAt: 10 },
    { role: "assistant", createdAt: 20 }
  ];
  assert.deepEqual(getChronologicalMessageEntries(messages).map(({ messageIndex }) => messageIndex), [2, 3, 0, 1]);
  assert.deepEqual(messages.map(({ createdAt }) => createdAt), [30, 40, 10, 20]);
});

for (const limit of [40, 80]) {
  test(`the current answer stays expanded after a ${limit}-message history is truncated`, () => {
    const history = Array.from({ length: limit }, (_, index) => ({
      role: index % 2 ? "assistant" : "user"
    }));
    const pendingMessages = [...history, { role: "user" }, { role: "assistant", pending: true }];
    const pendingCollapsed = getHistoricalAssistantMessageIndexes(pendingMessages);
    assert.equal(pendingCollapsed.has(pendingMessages.length - 1), false);

    const storedMessages = [...history, { role: "user" }, { role: "assistant" }].slice(-limit);
    const currentAnswerIndex = storedMessages.length - 1;
    const collapsed = getHistoricalAssistantMessageIndexes(storedMessages, currentAnswerIndex);
    assert.equal(collapsed.has(currentAnswerIndex), false);
    assert.equal(collapsed.size, (limit / 2) - 1);
    assert.ok([...collapsed].every((index) => storedMessages[index].role === "assistant"));
  });
}
