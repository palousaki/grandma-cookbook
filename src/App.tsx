import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import TocEditor from './pages/TocEditor';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/toc-editor" element={<TocEditor />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
