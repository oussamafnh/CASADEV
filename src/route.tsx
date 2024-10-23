import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/auth/register';
import Home from './components/home/home';
import ProfileSetup from './components/auth/profileSetup';
import PostDetails from './components/home/PostDetails';
const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home page route */}
      <Route path="/Auth" element={<RegisterForm />} /> {/* Login page route */}
      <Route path="/Profile_setup" element={<ProfileSetup />} /> {/* Login page route */}
      <Route path="/post/:postId" element={<PostDetails/>} />
    </Routes>
  );
};

export default RouteConfig;
