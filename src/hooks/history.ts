import { useNavigate } from "react-router-dom";
import { useStore } from "../config/store";
import { exportHistory, importHistory } from "../lib/history";

export default function useAppHistory() {
  const nav = useNavigate();

  const history = useStore((s) => s.history);
  const addHistory = useStore((s) => s.addHistory);
  const symptoms = useStore((s) => s.symptoms);
  const reset = useStore((s) => s.reset);
  const showSnackbar = useStore((s) => s.showSnackbar);

  const handleExportHistory: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    exportHistory(history);
    showSnackbar("History file exported successfully!");
  };

  const handleImportHistory: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    importHistory(addHistory, () => {
      showSnackbar("History file imported successfully!");
    });
  };

  const handleNewRecord = () => {
    // save prev data as history
    addHistory({ createdAt: new Date(), scores: [], symptoms, unsaved: true });
    // clear list
    reset();
    // nav to home page 1
    nav("/list/1");
    // show notification
    showSnackbar("Draft saved! You can view it any time in history page");
  };

  return { handleImportHistory, handleExportHistory, handleNewRecord };
}
