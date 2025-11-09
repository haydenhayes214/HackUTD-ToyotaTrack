import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import VehiclesPage from "./pages/VehiclesPage";
import FinancePage from "./pages/FinancePage";
import MyGaragePage from "./pages/MyGaragePage";
import FinancialLiteracyPage from "./pages/FinancialLiteracyPage";
import { createPageUrl } from "./utils";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={createPageUrl("Home")} element={<HomePage />} />
          <Route path={createPageUrl("Vehicles")} element={<VehiclesPage />} />
          <Route path={createPageUrl("Finance")} element={<FinancePage />} />
          <Route path={createPageUrl("MyGarage")} element={<MyGaragePage />} />
          <Route path={createPageUrl("FinancialLiteracy")} element={<FinancialLiteracyPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
