export function chooseImportDestination() {
  return chooseRecordTransferOption({
    title: "Where should imported records go?",
    choices: [
      ["Import to Dashboard", "board"],
      ["Import to Archive", "archive"],
      ["Cancel", "cancel"]
    ],
    acceptedValues: new Set(["board", "archive"])
  });
}

export function chooseExportFormat(selectedCount = 0) {
  const recordLabel = Number(selectedCount) === 1 ? "record" : "records";
  return chooseRecordTransferOption({
    title: `Export ${Number(selectedCount) || 0} selected ${recordLabel} as`,
    choices: [
      ["Table (.csv)", "table"],
      ["Re-importable (.json)", "re-importable"],
      ["Both", "both"],
      ["Cancel", "cancel"]
    ],
    acceptedValues: new Set(["table", "re-importable", "both"])
  });
}

function chooseRecordTransferOption({ title: titleText, choices, acceptedValues }) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "import-destination-dialog record-transfer-dialog";

    const form = document.createElement("form");
    form.method = "dialog";
    const title = document.createElement("h2");
    title.textContent = titleText;
    const actions = document.createElement("div");
    actions.className = "import-destination-actions record-transfer-actions";
    actions.append(...choices.map(([label, value]) => createChoiceButton(label, value)));
    form.append(title, actions);
    dialog.append(form);
    document.body.append(dialog);

    dialog.addEventListener("close", () => {
      const choice = acceptedValues.has(dialog.returnValue) ? dialog.returnValue : null;
      dialog.remove();
      resolve(choice);
    }, { once: true });
    dialog.addEventListener("cancel", () => {
      dialog.returnValue = "cancel";
    });
    dialog.showModal();
  });
}

function createChoiceButton(label, value) {
  const button = document.createElement("button");
  button.type = "submit";
  button.value = value;
  button.textContent = label;
  return button;
}
