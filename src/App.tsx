import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import DiseasesPage from "./pages/DiseasesPage";
import HistoryPage from "./pages/HistoryPage";
import SymptomsPage from "./pages/SymptomsPage";

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/result" element={<DiseasesPage />} />
          <Route path="/list/:pageIndex" element={<SymptomsPage />} />
          <Route path="*" element={<Navigate to="/list/1" replace />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
