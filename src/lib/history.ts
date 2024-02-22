import { IHistoryItem } from "../types/interfaces";

export async function exportHistory(history: IHistoryItem[]) {
  const prefix = "ORDA";
  const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
  const link = document.createElement("a");
  link.href = data;
  link.download = `${prefix} ${new Date().toLocaleString()}.json`;
  document.body.appendChild(link); // required for firefox
  link.click();
  link.remove();
}

export async function importHistory(addHistory: (history: IHistoryItem) => IHistoryItem[], callback: Function) {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = false;
  input.accept = "application/json";
  input.onchange = (e) => {
    const file = (e.target as any).files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      try {
        const content = readerEvent.target!.result;
        if (!content) throw new Error("empty file");
        const data = JSON.parse(content!.toString());
        if (!Array.isArray(data)) throw new Error("wrong content");
        data.forEach((item) => addHistory(item));
        callback();
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
      }
    };
  };
  input.click();
}
