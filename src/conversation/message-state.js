export function createQuestionResponseMap(messages) {
  const responseIndexes = new Map();
  let pendingQuestionIndex = -1;

  (Array.isArray(messages) ? messages : []).forEach((message, messageIndex) => {
    if (message?.role === "user") {
      pendingQuestionIndex = messageIndex;
    } else if (message?.role === "assistant" && pendingQuestionIndex >= 0) {
      responseIndexes.set(pendingQuestionIndex, messageIndex);
      pendingQuestionIndex = -1;
    }
  });

  return responseIndexes;
}

export function getHistoricalAssistantMessageIndexes(messages, exceptMessageIndex = -1) {
  const indexes = new Set();
  (Array.isArray(messages) ? messages : []).forEach((message, index) => {
    if (index !== exceptMessageIndex && message?.role === "assistant" && !message.pending) {
      indexes.add(index);
    }
  });
  return indexes;
}

export function getChronologicalMessageEntries(messages) {
  return (Array.isArray(messages) ? messages : [])
    .map((message, messageIndex) => ({ message, messageIndex }))
    .sort((left, right) => (
      (Number(left.message?.createdAt) || 0) - (Number(right.message?.createdAt) || 0) ||
      left.messageIndex - right.messageIndex
    ));
}
