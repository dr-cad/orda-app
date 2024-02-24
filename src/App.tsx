import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import DiseasesPage from "./pages/DiseasesPage";
import HistoryPage from "./pages/HistoryPage";
import SymptomsPage from "./pages/SymptomsPage";
import IntroPage from "./pages/IntroPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/intro" element={<PageLayout children={<IntroPage />} />} />
        <Route path="/history" element={<PageLayout children={<HistoryPage />} />} />
        <Route path="/result" element={<PageLayout children={<DiseasesPage />} />} />
        <Route path="/list/:pageIndex" element={<PageLayout children={<SymptomsPage />} />} />
        <Route path="*" element={<Navigate to="/intro" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
