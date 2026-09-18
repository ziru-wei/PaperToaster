import {
  createBulkActions,
  createComparisonCard,
  createDashboardToolbar,
  createFloatingAction,
  createIconButton,
  createKeyboardHint,
  createLabelChip,
  createLabelControl,
  createPaperCard,
  createPaperGroup,
  createSortMenu,
  enableDashboardDragAndDrop
} from "./dashboard-ui-kit.js";

const papers = [
  { id: "p1", title: "Attention Is All You Need", label: "Transformers", tone: 0, messages: 18, starred: true },
  { id: "p2", title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", label: "Transformers", tone: 0, messages: 7 },
  { id: "p3", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", label: "RAG", tone: 2, messages: 13 },
  { id: "p4", title: "Lost in the Middle: How Language Models Use Long Contexts", label: "Evaluation", tone: 3, messages: 2 },
  { id: "p5", title: "A Survey of Large Language Models", label: "", tone: "neutral", messages: 0 }
];

const labelOptions = [
  { name: "Transformers", tone: 0 },
  { name: "Methods", tone: 1 },
  { name: "RAG", tone: 2 },
  { name: "Evaluation", tone: 3 },
  { name: "Favorite", tone: 4 }
];

const sortControl = createSortMenu({
  activeId: "recent",
  options: [
    { id: "label", label: "Label", grouping: true },
    { id: "recent", label: "Recently discussed" },
    { id: "title", label: "Title" },
    { id: "starred", label: "Starred first" }
  ],
  onChange: ({ option }) => announce(`Sort: ${option.label}`)
});

document.querySelector("#toolbar").append(createDashboardToolbar({
  status: "5 papers · 2 comparisons",
  actions: [
    { icon: "select", label: "Select papers", onClick: () => announce("Manage mode") },
    { element: sortControl },
    { icon: "group", label: "Change grouping", onClick: () => announce("Grouping changed") },
    { icon: "eye", label: "Toggle message rings", onClick: () => announce("Message rings toggled") },
    { spacer: true },
    { icon: "archive", label: "Open archive", onClick: () => announce("Archive") }
  ],
  onSearch: ({ value }) => filterPapers(value)
}));

document.querySelector("#bulk").append(createBulkActions({
  selectedCount: 2,
  actions: [
    { id: "all", label: "Select all", onClick: () => announce("All visible records selected") },
    { id: "archive", label: "Archive", icon: "archive", onClick: () => announce("Archive action") },
    { id: "export", label: "Export", icon: "download", onClick: () => announce("Export action") },
    { id: "delete", label: "Delete", icon: "trash", danger: true, onClick: () => announce("Delete action") }
  ]
}));

renderGroups(papers);
enableDashboardDragAndDrop(document.querySelector("#paperGroups"), {
  onReorderGroups: ({ order }) => announce(`Group order: ${order.join(" → ")}`),
  onMoveCard: ({ groupId }) => announce(`Paper moved to ${groupId}`)
});

const comparisonData = [
  { id: "c1", title: "Transformers vs retrieval-augmented generation", time: "Today 14:32", starred: true, active: true },
  { id: "c2", title: "How evaluation methods changed across three papers", time: "Yesterday 09:16", related: true }
];
document.querySelector("#comparisons").append(...comparisonData.map((item) => createComparisonCard({
  ...item,
  onActivate: ({ title }) => announce(`Open: ${title}`),
  onToggleStar: ({ starred }) => announce(starred ? "Comparison starred" : "Comparison unstarred")
})));

document.querySelector("#controls").append(
  createIconButton({ icon: "select", label: "Select", active: true }),
  createIconButton({ icon: "sort", label: "Sort" }),
  createIconButton({ icon: "group", label: "Group" }),
  createIconButton({ icon: "eye", label: "Visibility" }),
  createIconButton({ icon: "archive", label: "Archive" })
);

document.querySelector("#labels").append(
  ...["Theory", "Methods", "Results", "To read", "Favorite"].map((label, tone) => createLabelChip({
    label,
    tone,
    onClick: ({ label: clicked }) => announce(`Label: ${clicked}`)
  })),
  createLabelChip({ onClick: () => announce("Create label") })
);

document.querySelector("#labelManagement").append(createLabelControl({
  label: "Methods",
  tone: 1,
  options: labelOptions,
  open: true,
  onChange: ({ label }) => announce(label ? `Assigned ${label}` : "Label cleared"),
  onCreate: ({ label }) => announce(`Created ${label}`),
  onRename: ({ previousLabel, label }) => announce(`Renamed ${previousLabel} to ${label}`),
  onDelete: ({ label }) => announce(`Deleted ${label}`)
}));

document.querySelector("#floating").append(createFloatingAction({
  label: "Send papers to comparison",
  onClick: () => announce("Sent to Comparative Reading")
}));
document.querySelector("#hint").append(createKeyboardHint({ keys: ["↑", "↓", "↵"], text: "Navigate and open" }));

function renderGroups(items) {
  const groups = new Map();
  for (const paper of items) {
    const key = paper.label || "Unlabeled";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(paper);
  }
  const nodes = [...groups.entries()].map(([label, records]) => createPaperGroup({
    id: label.toLowerCase(),
    label,
    tone: records[0]?.tone ?? "neutral",
    draggable: true,
    selectState: label === "Transformers" ? "partial" : "none",
    onToggleSelection: ({ selected }) => announce(`${selected ? "Select" : "Clear"} ${label}`),
    cards: records.map((paper) => createPaperCard({
      id: paper.id,
      title: paper.title,
      label: paper.label,
      labelTone: paper.tone,
      labelOptions,
      messageCount: paper.messages,
      starred: paper.starred,
      active: paper.id === "p3",
      related: paper.id === "p1",
      onActivate: ({ title }) => announce(`Open: ${title}`),
      onToggleStar: ({ starred }) => announce(starred ? "Paper starred" : "Paper unstarred"),
      onLabelChange: ({ label: next }) => announce(next ? `Assigned ${next}` : "Label cleared"),
      onLabelCreate: ({ label: created }) => announce(`Created ${created}`),
      onLabelRename: ({ previousLabel, label: next }) => announce(`Renamed ${previousLabel} to ${next}`),
      onLabelDelete: ({ label: deleted }) => announce(`Deleted ${deleted}`)
    }))
  }));
  document.querySelector("#paperGroups").replaceChildren(...nodes);
}

function filterPapers(value) {
  const query = value.trim().toLowerCase();
  renderGroups(papers.filter((paper) => !query || `${paper.title} ${paper.label}`.toLowerCase().includes(query)));
}

let feedbackTimer;
function announce(message) {
  const feedback = document.querySelector("#feedback");
  feedback.textContent = message;
  feedback.hidden = false;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    feedback.hidden = true;
  }, 1400);
}
