import { Routes, Route } from 'react-router-dom';
import RegisterForm from './components/auth/register';
import Home from './components/home/home';
import EditPost from './components/home/editpost';
import CreatePost from './components/home/creatpost';
import Profile from './components/home/profile';
import MyProfile from './components/home/myprofile';
import ProfileSetup from './components/auth/profileSetup';
import PostDetails from './components/home/PostDetails';
import PageFound from './components/PageFound';
import PostFound from './components/PostFound';
import ProfileFound from './components/ProfileFound';
const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Auth" element={<RegisterForm />} />
      <Route path="/Profile_setup" element={<ProfileSetup />} />
      <Route path="/post/:postId" element={<PostDetails />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/myprofile/bookmarks" element={<MyProfile />} />
      <Route path="*" element={<PageFound />} />
      <Route path="/post/notfound" element={<PostFound />} />
      <Route path="/profile/notfound" element={<ProfileFound />} />

    </Routes>
  );
};

export default RouteConfig;
