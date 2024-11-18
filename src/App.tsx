import './App.css';
import MobileWarning from './components/MobileWarning';
import Navbar from './components/navbar';
import RouteConfig from './route';
import { useEffect, useState } from 'react';


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
      <MobileWarning />
    ) : (
      <>
        <Navbar />
        <RouteConfig />
      </>
    )
  );
}

export default App;
