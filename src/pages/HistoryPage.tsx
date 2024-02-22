import { List, Stack } from "@mui/material";

export default function HistoryPage() {
  return (
    <Stack aria-label="diseases-page" flex={1} p={2} gap={2}>
      <List>
        {/* {[].map<ISymptom[]>((symptoms, i) => (
          <HistoryItem key={i} data={symptoms} />
        ))} */}
      </List>
    </Stack>
  );
}

// const HistoryItem = ({ data }: { data: ISymptom[] }) => {
//   return (
//     <Fragment>
//       <ListItem
//         sx={{ justifyContent: "space-between", opacity: value > 0.25 ? 1 : 0.35, borderBottom: "var(--app-border)" }}>
//         <ListItemText primary={name} />
//         <Typography sx={{ textAlign: "end" }}>{Math.round(value * 100) / 100}</Typography>
//       </ListItem>
//     </Fragment>
//   );
// };
