import { Done } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Pagination, PaginationItem, Stack, paginationItemClasses } from "@mui/material";
import { usePageIndex } from "../hooks/pages";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { isResult, canGoForward, handleTo, handleResult, pageIndex } = usePageIndex();

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight;
  return (
    <Stack
      overflow="hidden"
      flex={1}
      gap={2}
      justifyContent="space-between"
      alignItems="stretch"
      sx={{ height: [vh, "100vh"] }}>
      {children}
      <Stack direction="row" gap={1} justifyContent="center" alignItems="center" sx={{ py: 2 }}>
        <Pagination
          count={6}
          defaultPage={pageIndex + 1}
          color="primary"
          shape="rounded"
          hidePrevButton
          onChange={(e, p) => {
            handleTo(p);
          }}
          renderItem={(item) => {
            const isNext = item.type === "next";
            const isDone = isNext && !canGoForward;
            return (
              <PaginationItem
                slots={{ next: canGoForward ? ChevronRightIcon : Done }}
                {...item}
                disabled={isDone ? false : item.disabled}
                onClick={isDone ? handleResult : item.onClick}
                selected={isResult ? isDone : item.selected}
                sx={{
                  [`&.${paginationItemClasses.root}, &.${paginationItemClasses.root}:hover`]: {
                    background: isResult && isDone ? "#00bd5e" : undefined,
                  },
                }}
              />
            );
          }}
        />
      </Stack>
    </Stack>
  );
}
