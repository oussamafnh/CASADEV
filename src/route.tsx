import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/auth/register';
import Home from './components/home/home';
const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home page route */}
      <Route path="/Auth" element={<RegisterForm />} /> {/* Login page route */}
    </Routes>
  );
};

export default RouteConfig;
