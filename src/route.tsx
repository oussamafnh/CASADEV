import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/auth/register';
import Home from './components/home/home';
import ProfileSetup from './components/auth/profileSetup';
import PostDetails from './components/home/PostDetails';
import Creatpost from './components/home/creatpost';
import Myposts from './components/home/myposts';
import Profile from './components/home/profile';
const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home page route */}
      <Route path="/Auth" element={<RegisterForm />} /> {/* Login page route */}
      <Route path="/Profile_setup" element={<ProfileSetup />} /> {/* Login page route */}
      <Route path="/post/:postId" element={<PostDetails/>} />
      <Route path="/CreatePost" element={<Creatpost/>} />
      <Route path="/profile/:userId" element={<Profile/>} />
    </Routes>
  );
};

export default RouteConfig;
