import { BrowserRouter } from 'react-router-dom';
import { Providers } from './providers';
import { Router } from './router';
import Header from '../shared/components/Header';
import '../styles/main.scss';

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