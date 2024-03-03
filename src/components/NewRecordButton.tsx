import { AddRounded } from "@mui/icons-material";
import { Button, ButtonTypeMap, ExtendButtonBase, Typography } from "@mui/material";
import useAppHistory from "../hooks/history";

const NewRecordButton: ExtendButtonBase<ButtonTypeMap<{}, "button">> = (props: any) => {
  const { handleNewRecord } = useAppHistory();

  return (
    <Button onClick={handleNewRecord} startIcon={<AddRounded />} sx={{ borderRadius: 4 }} {...props}>
      <Typography fontSize="0.65rem" className="text-ellipsis">
        New Record
      </Typography>
    </Button>
  );
};

export default NewRecordButton;
