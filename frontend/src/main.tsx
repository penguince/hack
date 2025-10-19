import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Home from './landingpage.tsx';

function Main() {
  const [showApp, setShowApp] = useState(false);

  return (
    <StrictMode>
      {showApp ? <App /> : <Home onStart={() => setShowApp(true)} />}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Main />);