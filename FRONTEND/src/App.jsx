import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <BrowserRouter>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <main className="relative h-screen w-full overflow-hidden bg-white">
        <Navbar/>
        <Hero/>
      </main>
    </BrowserRouter>
  );
}

export default App;