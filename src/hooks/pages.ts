import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import getRawSymptoms from "../lib/symptoms";

export function usePageIndex() {
  // const symptoms = useStore((s) => s.symptoms);
  const symptoms = getRawSymptoms();
  const nav = useNavigate();
  const { pageIndex: pi } = useParams();
  const location = useLocation();

  const pageIndex = useMemo(() => (pi ? parseInt(pi) - 1 : 0), [pi]);
  const pages = useMemo(() => symptoms.filter((i) => i.page), [symptoms]);
  const currPage = pages[pageIndex];

  const isResult = location.pathname === "/result";
  const canGoBack = pageIndex > 0 || isResult;
  const canGoForward = !isResult && pageIndex < pages?.length - 1;

  const handleTo = (i: number) => {
    if (0 < i && i < pages.length + 1) nav("/list/" + i);
  };
  const handlePrev = () => {
    if (canGoBack) nav("/list/" + (!isResult ? pageIndex : pages?.length));
  };
  const handleNext = () => {
    if (canGoForward) nav("/list/" + (pageIndex + 2));
  };
  const handleResult = () => {
    nav("/result");
  };

  return {
    pages,
    isResult,
    pageIndex,
    currPage,
    canGoBack,
    canGoForward,
    handleTo,
    handlePrev,
    handleNext,
    handleResult,
  };
}
