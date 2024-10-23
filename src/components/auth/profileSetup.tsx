import { useEffect, useState } from 'react';
import '../../style/profilesetup.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProfileSetup = () => {
  const [avatars, setAvatars] = useState([]); // State to hold avatars
  const [selectedAvatar, setSelectedAvatar] = useState(''); // State to hold selected avatar
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    avatar: '',
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    birthday: '',
  }); // State for form data

  // Fetch avatars from the endpoint
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/auth/avatars', {
          credentials: 'include' // Include credentials for cookies
        });
        const data = await response.json();
        setAvatars(data); // Assuming the response is an array of avatar objects
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars(); // Call the function
  }, []);

  // Handle avatar selection
  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setFormData({ ...formData, avatar: avatarUrl });
  };


  // Handle input changes for form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Send user profile data to setup-profile endpoint
      await fetch('http://localhost:8090/api/auth/setup-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Include credentials for cookies
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
        {/* Avatar Slider Section */}
        <div className="avatar-slider">
          {avatars.map((avatar) => (
            <div
              key={avatar._id}
              className={`avatar-slide ${selectedAvatar === avatar.avatarUrl ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(avatar.avatarUrl as string)}
            >
              <img src={avatar.avatarUrl} alt="Avatar" />
            </div>
          ))}
        </div>

        {/* Card Section */}
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
