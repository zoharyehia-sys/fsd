import { BrowserRouter } from "react-router";
import { Providers } from "./providers";
import { Router } from "./router";
import { Header } from "../shared/components";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>
    </Providers>
  );
}


