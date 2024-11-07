import { useEffect, useState } from 'react';
import '../../style/profilesetup.css';
import { useNavigate } from "react-router-dom";


interface Avatar {
  _id: string;
  avatarUrl: string;
}
const ProfileSetup = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(''); 

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    avatar: '',
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    birthday: '',
  });
  
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/auth/avatars', {
          credentials: 'include'
        });
        const data = await response.json();
        setAvatars(data);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars();
  }, []);

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setFormData({ ...formData, avatar: avatarUrl });
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8090/api/auth/setup-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Error setting up profile:', error);
    }
  };

  return (
    <div className="profilesetup">
      <div className="container">
        <div className="avatar-slider">

          {avatars.map((avatar) => (
            <div
              key={avatar._id}
              className={`avatar-slide ${selectedAvatar === avatar.avatarUrl ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(avatar.avatarUrl)}
            >
              <img src={avatar.avatarUrl} alt="Avatar" />
            </div>
          ))}
        </div>

        <div className="cardmid">
          <div className="card">

            <div className="card-title">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
              />
              <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSetup;
