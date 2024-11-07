// src/components/Navbar.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo1 } from '../assets/logo1';
import "../style/navbar.css";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const [userData, setUserData] = useState<{
        avatar: string | undefined; username: string
    } | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/auth/user', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    console.log(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

        };

        fetchUserData();
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        const logoutfunction = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
                });

                window.location.reload();
                console.log("Logging out...");

            } catch (error) {
                console.error('Error logout:', error);
            }
        };
        logoutfunction();
    };

    const handleProfileClick = () => {
        navigate(`/myprofile`);
    };
    return (
        <div className="navbar">
            <div className="container">
                <Link to="/">
                    <Logo1 />
                </Link>

                <div className="subscribesec">
                    {userData ? (
                        <div className="user-profile">
                            <div className="profile-menu">
                                <img
                                    src={userData.avatar}
                                    alt="User Avatar"
                                    className="user-avatar"
                                />
                                <svg onClick={toggleDropdown} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24">
                                    <rect x="0" fill="none" width="24" height="24" />
                                    <g>
                                        <path d="M7 10l5 5 5-5" />
                                    </g>
                                </svg>
                                {isDropdownOpen && (
                                    <div className="dropdown">
                                        <button onClick={handleProfileClick}>Profile</button>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link to="/Auth" className="a-button">
                            <button className="button">
                                <p className="text">Login</p>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Navbar;
