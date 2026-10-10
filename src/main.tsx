import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Sur la 2: Nouvelle version disponible');
  },
  onOfflineReady() {
    console.log('Sur la 2: Prêt pour le mode hors-ligne');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
