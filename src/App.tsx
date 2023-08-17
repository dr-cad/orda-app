import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DiseasesPage from "./pages/DiseasesPage";
import SymptomsPage from "./pages/SymptomsPage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/result"
          element={
            <PageLayout>
              <DiseasesPage />
            </PageLayout>
          }
        />
        <Route
          path="/list/:pageIndex"
          element={
            <PageLayout>
              <SymptomsPage />
            </PageLayout>
          }
        />
        <Route path="*" element={<Navigate to="/list/1" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
