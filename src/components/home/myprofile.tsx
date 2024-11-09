import { useState, useEffect } from 'react';
import "../../style/profile.css";
import PostCard from "./PostCard";
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';


const MyProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isAllowed, setIsAllowed] = useState(true);
    const [bookmarks, setBookmarks] = useState(false);
    const [profile, setProfile] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    // const [followers, setFollowers] = useState<any>({});
    const [followersCount, setFollowersCount] = useState(0);
    // const [following, setFollowing] = useState<any>({});
    const [followingCount, setFollowingCount] = useState(0);
    const navigate = useNavigate();

    const location = useLocation();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
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
                fetchUrl = `${API_BASE_URL}/api/save/saved_posts`;
            } else {
                fetchUrl = `${API_BASE_URL}/api/post/myposts`;
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
                setIsAllowed(true);
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


        const fetchfollowersdata = async () => {
            try {
                const response1 = await fetch(`${API_BASE_URL}/api/follow/${user._id}/followers`);
                const response2 = await fetch(`${API_BASE_URL}/api/follow/${user._id}/following`);
                if (response1.ok && response2.ok) {
                    const data1 = await response1.json();
                    const data2 = await response2.json();
                    // setFollowers(data1.followers);
                    setFollowersCount(data1.followersCount);
                    // setFollowing(data2.following);
                    setFollowingCount(data2.followingCount);
                }
            } catch (error) {
                console.error('Error fetching followers data:', error);
            }
        };

        fetchfollowersdata();
    }, [location.pathname]);



    const backhome = () => {
        navigate(`/`);
    };


    const handleLogout = () => {
        const logoutfunction = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
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
                                {user.totalPosts} Posts - {followersCount} followers - {followingCount} following
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