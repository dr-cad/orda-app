import { IHistoryItem } from "../types/interfaces";

export async function downloadData(history: IHistoryItem[]) {
  const prefix = "ORDA";
  const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
  const link = document.createElement("a");
  link.href = data;
  link.download = `${prefix} ${new Date().toLocaleString()}.json`;
  document.body.appendChild(link); // required for firefox
  link.click();
  link.remove();
}
