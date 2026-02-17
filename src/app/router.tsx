import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/pets/pages/LandingPage';
import CataloguePage from '../features/pets/pages/CataloguePage';
import PetPage from '../features/pets/pages/PetPage';
import AdoptionPage from '../features/pets/pages/AdoptionPage';
import AdoptionForm from '../features/pets/pages/AdoptionForm';
import NotFound from '../features/pets/pages/NotFound';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/pet/:id" element={<PetPage />} />
      <Route path="/adoption/:id" element={<AdoptionPage />} />
      <Route path="/adoption" element={<AdoptionForm />} />
      <Route path="/adoption-form" element={<AdoptionForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
