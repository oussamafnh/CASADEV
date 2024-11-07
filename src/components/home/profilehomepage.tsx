import "../../style/profilehomepage.css";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Profilehomepage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    setLoading(false); // Stop loading when data is fetched
                } else {
                    console.error('Failed to fetch user data');
                    setLoading(false); // Stop loading even if there is an error
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Stop loading on error
            }
        };

        fetchUserData();
    }, []);


    const handleLogout = () => {
        const logoutfunction = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.reload();
                    console.log("Logging out...");
                } else {
                    console.error('Failed to logout');
                }
            } catch (error) {
                console.error('Error logout:', error);
            }
        };
        logoutfunction();
    };

    if (loading) {
        return (
            <div className="Profilehomepage_loading">
                <div className="profilecard_loading">
                    <div className="profilesection_loading">
                        <div className="header_loading">
                        </div>
                        <div className="name_loading">
                            <div className="username_loading"></div>
                            <div className="bio_loading"></div>
                        </div>
                        <div className="avatar_loading"></div>
                    </div>
                    <div className="profilecard_navbar_loading">
                        <div className="profilecard_navbar_btn_loading">
                        </div>
                        <div className="profilecard_navbar_btn_loading">
                        </div>
                        <div onClick={handleLogout} className="profilecard_navbar_btn_loading profilecard_navbar_btn_logout_loading">
                        </div>
                    </div>

                </div>
            </div >
        );
    }

    if (!userData) {
        return (
            <div className="Profilehomepage">
                <div className="profilecard">
                    <div className="profilecard_navbar">
                        <Link to="/Auth" onClick={handleLogout} className="profilecard_navbar_btn profilecard_navbar_btn_signin">
                            <FontAwesomeIcon icon={faSignInAlt} className="navbar_icon" />
                            Sign in / Sign up
                        </Link>
                    </div>

                </div>
            </div>

        );
    }

    return (
        <div className="Profilehomepage">
            <div className="profilecard">
                <div className="profilesection">
                    <div className="header">
                    </div>
                    <div className="name">
                        <p className="username">{userData.firstName} {userData.lastName}</p>
                        <p className="bio">{userData.bio} </p>
                    </div>
                    <img
                        src={userData.avatar}
                        alt="User Avatar"
                        className="avatar"
                    />
                </div>
                <div className="profilecard_navbar">
                    <Link to="/myprofile" className="profilecard_navbar_btn">
                        <FontAwesomeIcon icon={faUser} className="navbar_icon" />
                        My Profile
                    </Link>
                    <Link to="/myprofile/bookmarks" className="profilecard_navbar_btn">
                        <FontAwesomeIcon icon={faBookmark} className="navbar_icon" />
                        Bookmarks
                    </Link>
                    <Link to="/" onClick={handleLogout} className="profilecard_navbar_btn profilecard_navbar_btn_logout">
                        <FontAwesomeIcon icon={faSignOutAlt} className="navbar_icon" />
                        Logout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profilehomepage;
