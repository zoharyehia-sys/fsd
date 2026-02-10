import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import "./styles/global.scss";
import AdoptionForm from "./pages/AdoptionForm/AdoptionForm";
import About from "./pages/About/About";
import { LastPets } from "./components/LastPets/Lastpets";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/adoption-form" element={<AdoptionForm />} />
        <Route path="/about/:id" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
