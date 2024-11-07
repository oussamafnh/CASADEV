import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "../../style/FiltreAndSearch.css";
import { useEffect, useState } from 'react';
import Alert from '../Alert';
import { formatDistanceToNow, format } from 'date-fns';

const FiltreAndSearch = () => {
    const [userData, setUserData] = useState(null);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [alert, setAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [usersResults, setUsersResults] = useState([]);
    const [userslength, setUserslength] = useState(0);
    const [postsResults, setPostsResults] = useState([]);
    const [postslength, setPostslength] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                } else {
                    console.error('Failed to fetch user data');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleCreatePostClick = () => {
        if (userData) {
            navigate('/CreatePost');
        } else {
            setAlert(true);
        }
    };

    const handleSearchChange = async (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            try {
                // Use GET method and append the query to the URL
                const response = await fetch(`http://localhost:8090/api/search?query=${encodeURIComponent(query)}`, {
                    method: 'GET', // Change to GET
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Log the response data for debugging
                    setUsersResults(data.users);
                    setPostsResults(data.posts);
                    setUserslength(data.usersResults);
                    setPostslength(data.postsResults);
                } else {
                    console.error('Error fetching search results');
                    setUsersResults([]); // Clear results on error
                }
            } catch (error) {
                console.error('Error in search request:', error);
                setUsersResults([]); // Clear results on error
            }
        } else {
            setUsersResults([]); // Clear results if input is empty
        }
    };

    const formattedPostTime = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const timeDiffInSeconds = Math.floor((now - createdDate) / 1000); // Difference in seconds

        const oneDayInSeconds = 86400; // 60 * 60 * 24
        const oneMonthInSeconds = 2592000; // 60 * 60 * 24 * 30

        if (timeDiffInSeconds < oneDayInSeconds) {
            const minutes = Math.floor(timeDiffInSeconds / 60);
            return minutes > 0 ? `${minutes} m` : 'Just now';
        } else if (timeDiffInSeconds < oneMonthInSeconds) {
            const days = Math.floor(timeDiffInSeconds / oneDayInSeconds);
            return `${days} d`;
        } else {
            return format(createdDate, 'MMMM d, yyyy'); // e.g., "September 12, 2024"
        }
    };


    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleUserClick = (UserId) => {
        navigate(`/profile/${UserId}`);
    };

    const handleSearchClick = () => {
        setShowSearchPopup(true); // Show confirmation popup
    };
    const handleHideSearchClick = () => {
        setShowSearchPopup(false);
    };

    if (loading) {
        return <div className="filterandsearch_loading"><div className="createpost_loading"></div></div>;
    }

    return (
        <>
            <div className="filterandsearch">
                <div className={`${userData ? 'createpost' : 'createpost not_createpost'}`}>
                    <div onClick={handleCreatePostClick} className="createpost_btn">
                        <FontAwesomeIcon icon={faPlus} className="plus_icon" />
                        Create A Post
                    </div>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search users or posts..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery.length > 0 && (
                        <div className="search-results">
                            {userslength === 0 && postslength === 0 && (
                                <p className="noresults">No results for "{searchQuery}"</p>
                            )}

                            {(userslength > 0 || postslength > 0) && (
                                <>
                                    {userslength > 0 && <h4>Users</h4>}
                                    {usersResults.slice(0, 3).map(user => (
                                        <div key={user._id} className="search-result-item-user" onClick={() => handleUserClick(user._id)}>
                                            <img src={user.avatar} alt={user.username} />
                                            <div className="fullandusername">
                                                <p className='fullname'>{user.firstName} {user.lastName}</p>
                                                <p className='username'>{user.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {userslength > 3 && (
                                        <p className='seemore' onClick={handleSearchClick}>See more users...</p>
                                    )}

                                    {postslength > 0 && <h4>Posts</h4>}
                                    {postsResults.slice(0, 3).map(post => (
                                        <div key={post._id} className="search-result-item-post" onClick={() => handlePostClick(post._id)}>
                                            <img src={post.authorAvatar} alt={post.title} className="post-thumbnail" />
                                            <div className="post-info">
                                                <p className="post-title">{post.title}</p>
                                                <p className="post-author">by {post.author}</p>
                                                <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
                                                <div className="guardian"></div>
                                                <p className='date'>{formattedPostTime(post.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {postsResults.length > 3 && (
                                        <p className='seemore' onClick={handleSearchClick}>See more posts...</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                </div>

                <p className="copyright">&copy; CASADEV 2024</p>
                {alert && (
                    <Alert
                        message="Please log in to create a post."
                        type="error"
                        onClose={() => setAlert(false)}
                    />
                )}
            </div>
            {showSearchPopup && (
                <div className="search-popup">
                    <div className="searchcontainer" onClick={handleHideSearchClick}>
                    </div>
                        <div className="searchdiv">

                            <input
                                type="text"
                                placeholder="Search users or posts..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    <div className="searchsdetails-popup">

                        {searchQuery.length > 0 && (
                            <div className="search-results-popup">
                                {userslength === 0 && postslength === 0 && (
                                    <p className="noresults-popup">No results for "{searchQuery}"</p>
                                )}

                                {(userslength > 0 || postslength > 0) && (
                                    <>
                                        {userslength > 0 && <h4>Users</h4>}
                                        {usersResults.map(user => (
                                            <div key={user._id} className="search-result-item-user-popup"  onClick={() => handleUserClick(user._id)}>
                                                <img src={user.avatar} alt={user.username} />
                                                <div className="fullandusername">
                                                    <p className='fullname'>{user.firstName} {user.lastName}</p>
                                                    <p className='username'>{user.username}</p>
                                                </div>
                                            </div>
                                        ))}


                                        {postslength > 0 && <h4>Posts</h4>}
                                        {postsResults.map(post => (
                                            <div key={post._id} className="search-result-item-post-popup" onClick={() => handlePostClick(post._id)}>
                                                <img src={post.authorAvatar} alt={post.title} className="post-thumbnail-popup" />
                                                <div className="post-info-popup">
                                                    <p className="post-title-popup">{post.title}</p>
                                                    <p className="post-author-popup">by {post.author}</p>
                                                    <div className="content-popup" dangerouslySetInnerHTML={{ __html: post.content }} />
                                                    <div className="guardian-popup"></div>
                                                    <p className='date-popup'>{formattedPostTime(post.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}

                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </>
    );
};
export default FiltreAndSearch;
