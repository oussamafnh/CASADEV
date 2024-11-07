import { useState, useEffect } from 'react';
import "../../style/profile.css";
import PostCard from "./PostCard";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const MyProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isAllowed, setIsAllowed] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [bookmarks, setBookmarks] = useState(false);
    const [profile, setProfile] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const navigate = useNavigate();


    const location = useLocation(); // Get the current location

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/auth/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setUser(data.user);
                setLoading1(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading1(false);
            }
        };

        const fetchPosts = async () => {
            let fetchUrl;

            if (location.pathname === "/myprofile/bookmarks") {
                fetchUrl = `http://localhost:8090/api/save/saved_posts`;
            } else {
                fetchUrl = `http://localhost:8090/api/post/myposts`;
            }
            try {
                const response = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setPosts(data);
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching posts data:", error);
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            }
        };

        if (location.pathname === "/myprofile/bookmarks") {
            setBookmarks(true);
            setProfile(false);

        } else if (location.pathname === "/myprofile") {
            setBookmarks(false);
            setProfile(true);
        }
        fetchUser();
        fetchPosts();
    }, [location.pathname]);



    const backhome = () => {
        navigate(`/`);
    };


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
    return (
        <div className="profilecomponent">


            {!loading1 ? (
                <div className="Profilehomepage">
                    <div className="profilecard">
                        <div className="profilesection">
                            <div className="header">
                            </div>
                            <div className="name">
                                <p className="username">{user?.firstName} {user?.lastName}</p>
                                <p className="bio">{user?.bio} </p>
                            </div>
                            <img
                                src={user?.avatar}
                                alt="User Avatar"
                                className="avatar"
                            />
                        </div>
                        <div className="profilecard_navbar">
                            <button className="profilecard_navbar_btn">
                                {user?.totalPosts} Posts - followers - following
                            </button>
                            {!bookmarks && profile ? (
                                <Link to="/myprofile/bookmarks" className="profilecard_navbar_btn">
                                    <FontAwesomeIcon icon={faBookmark} className="navbar_icon" />
                                    Bookmarks
                                </Link>
                            ) : (
                                <Link to="/myprofile" className="profilecard_navbar_btn">
                                    <FontAwesomeIcon icon={faUser} className="navbar_icon" />
                                    My Profile
                                </Link>
                            )}
                            <Link to="/" onClick={handleLogout} className="profilecard_navbar_btn profilecard_navbar_btn_logout">
                                <FontAwesomeIcon icon={faSignOutAlt} className="navbar_icon" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
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
                            <div className="profilecard_navbar_btn_loading profilecard_navbar_btn_logout_loading">
                            </div>
                        </div>

                    </div>
                </div >
            )}


            {loading2 ? (
                <div className="profileposts">
                    <div className="profilepostscontainer profilepostscontainer_loading">
                        <div className="post_card ">
                            <div className="post_header_loading">
                                <div className="avatar_loading"></div>
                                <div className="post_author_info_loading">
                                    <span className="author_name_loading"></span>
                                    <span className="post_time_loading"></span>
                                </div>
                            </div>
                            <div className="post_content">
                                <div className="big_title_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="post_image_loading"></div>
                            </div>
                            <div className="post-actions">
                                <div className="likecounter"></div>
                                <div className="commentcounter"></div>
                                <div className="savecounter"></div>
                            </div>
                        </div>
                        <div className="post_card ">
                            <div className="post_header_loading">
                                <div className="avatar_loading"></div>
                                <div className="post_author_info_loading">
                                    <span className="author_name_loading"></span>
                                    <span className="post_time_loading"></span>
                                </div>
                            </div>
                            <div className="post_content">
                                <div className="big_title_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="line_loading"></div>
                                <div className="post_image_loading"></div>
                            </div>
                            <div className="post-actions">
                                <div className="likecounter"></div>
                                <div className="commentcounter"></div>
                                <div className="savecounter"></div>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <div className="profileposts">
                    <div className="profilepostscontainer">
                        {
                            bookmarks ? (
                                <p className='posttext'> <span onClick={backhome}>Home</span>  &gt; Bookmarks  </p>
                            ) : (
                                <p className='posttext'> <span onClick={backhome}>Home</span>  &gt; Posts  </p>
                            )
                        }
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post._id} post={post} isAllowed={isAllowed} />
                            ))
                        ) : (
                            <p className='noposts'>No posts available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyProfile