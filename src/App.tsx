import './App.css';
import MobileWarning from './components/MobileWarning';
import Navbar from './components/navbar';
import RouteConfig from './route';
import { useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust based on your mobile breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return (
    isMobile ? (
      <>
        <MobileWarning />
        <Analytics />
      </>
    ) : (
      <>
        <Analytics />
        <Navbar />
        <RouteConfig />
      </>
    )
  );
}

export default App;
