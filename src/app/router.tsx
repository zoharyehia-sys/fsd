import { Navigate, Route, Routes } from "react-router";
import LandingPage from "../fsd/pets/pages/LandingPage";
import CataloguePage from "../fsd/pets/pages/CataloguePage";
import PetPage from "../fsd/pets/pages/PetPage";
import AdoptionPage from "../fsd/pets/pages/AdoptionPage";
import NotFoundPage from "../fsd/pets/pages/NotFoundPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/catalog" element={<CataloguePage />} />
      <Route path="/adoption" element={<Navigate to="/adoption-form" replace />} />
      <Route path="/pet/:id" element={<PetPage />} />
      <Route path="/pets/:id" element={<PetPage />} />
      <Route path="/adoption-form" element={<AdoptionPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
