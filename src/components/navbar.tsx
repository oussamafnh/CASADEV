// src/components/Navbar.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo1 } from '../assets/logo1';
import { Logo2 } from '../assets/logo2';
import "../style/navbar.css";

const Navbar = () => {
    const [userData, setUserData] = useState<{ username: string } | null>(null); // State to hold user data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/user', {
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

        fetchUserData(); // Call the fetch function on component mount
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
    };

    const handleLogout = () => {
        // Handle logout logic here
        console.log("Logging out...");
    };

    return (
        <div className="navbar">
            <div className="container">
                <Link to="/">
                    <Logo1 />
                </Link>

                <div className="subscribesec">
                    {userData ? (
                        // Show user profile if logged in
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
                                        <button onClick={() => console.log('Go to Profile')}>Profile</button>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Show login button if not logged in
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
