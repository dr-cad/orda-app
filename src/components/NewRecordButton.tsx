import { AddRounded } from "@mui/icons-material";
import { Button, ButtonTypeMap, ExtendButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore } from "../config/store";

const NewRecordButton: ExtendButtonBase<ButtonTypeMap<{}, "button">> = (props: any) => {
  const nav = useNavigate();

  const addHistory = useStore((s) => s.addHistory);
  const symptoms = useStore((s) => s.symptoms);
  const reset = useStore((s) => s.reset);
  const showSnackbar = useStore((s) => s.showSnackbar);

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

  return (
    <Button onClick={handleNewRecord} startIcon={<AddRounded />} sx={{ borderRadius: 4 }} {...props}>
      New Record
    </Button>
  );
};

export default NewRecordButton;
