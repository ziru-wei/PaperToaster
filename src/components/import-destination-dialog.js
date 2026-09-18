export function chooseImportDestination() {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "import-destination-dialog";

    const form = document.createElement("form");
    form.method = "dialog";
    const title = document.createElement("h2");
    title.textContent = "Where should imported records go?";
    const actions = document.createElement("div");
    actions.className = "import-destination-actions";

    const boardButton = createChoiceButton("Import to Dashboard", "board");
    const archiveButton = createChoiceButton("Import to Archive", "archive");
    const cancelButton = createChoiceButton("Cancel", "cancel");
    actions.append(boardButton, archiveButton, cancelButton);
    form.append(title, actions);
    dialog.append(form);
    document.body.append(dialog);

    dialog.addEventListener("close", () => {
      const destination = dialog.returnValue === "board" || dialog.returnValue === "archive"
        ? dialog.returnValue
        : null;
      dialog.remove();
      resolve(destination);
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
