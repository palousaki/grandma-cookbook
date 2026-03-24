import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// StrictMode is intentionally omitted — StPageFlip uses imperative DOM
// manipulation (loadFromHTML moves elements into its own wrapper structure),
// so StrictMode's double-invocation of effects leaves the DOM in a broken
// state on the second run.
createRoot(document.getElementById('root')!).render(<App />);
