import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../../style/profile.css";
import PostCard from "./PostCard";
import { useNavigate } from 'react-router-dom';
// import Alert from '../Alert';


const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<any>({});
    const [posts, setPosts] = useState<any[]>([]);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isAllowedtoFollow, setIsAllowedtoFollow] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [isfollowed, setIsfollowed] = useState(false);
    const [isfollowingMe, setIsfollowingMe] = useState(false);
    // const [followers, setFollowers] = useState<any>({});
    const [followersCount, setFollowersCount] = useState(0);
    // const [following, setFollowing] = useState<any>({});
    const [followingCount, setFollowingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/auth/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setUser(data);
                setIsfollowed(data.isFollowed);
                setIsAllowedtoFollow(data.isAllowed);
                setIsfollowingMe(data.isFollowing);
                setLoading1(false);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setLoading1(false);
            }
        };

        fetchUser();
    }, [userId]); // Only re-run if userId changes

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/post/author/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setPosts(data.posts);
                setIsAllowed(data.isAllowed);
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            }
        };

        fetchPost();
    }, [userId]); // Only re-run if userId changes

    useEffect(() => {
        const fetchfollowersdata = async () => {
            try {
                const response1 = await fetch(`http://localhost:8090/api/follow/${userId}/followers`);
                const response2 = await fetch(`http://localhost:8090/api/follow/${userId}/following`);
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
    }, [userId]);
    const fetchFollow = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/follow/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userIdToFollow: userId,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.message === "Followed successfully") {
                setIsfollowed(true);
                setFollowersCount(followersCount + 1);


            } else if (data.message === "Unfollowed successfully") {
                setIsfollowed(false);
                setFollowersCount(followersCount - 1);
            } else {
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const backhome = () => {
        navigate(`/`);
    };
    console.log(isfollowed);

    return (
        <div className="profilecomponent">


            {!loading1 ? (
                <div className="Profilehomepage">
                    <div className="profilecard">
                        <div className="profilesection">
                            <div className="header">
                            </div>
                            <div className="name">
                                <p className="username">{user.firstName} {user.lastName}</p>
                                <p className="bio">{user.bio} </p>
                            </div>
                            <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="avatar"
                            />
                        </div>
                        <div className="profilecard_navbar">
                            <button className="profilecard_navbar_btn">
                                {user.totalPosts} Posts - {followersCount} followers - {followingCount} following
                            </button>
                            <button className={`profilecard_navbar_btn ${isAllowedtoFollow ? '' : 'cant_follow'}`} onClick={fetchFollow}>
                                {isfollowed ? "Unfollow" : (isfollowingMe ? "Follow back" : "Follow")}
                            </button>
                            <button className="profilecard_navbar_btn profilecard_navbar_btn_logout">
                                Report
                            </button>
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

            {!loading2 ? (
                <div className="profileposts">
                    <div className="profilepostscontainer">
                        <p className='posttext'> <span onClick={backhome}>Home</span>  &gt; {user.username} &gt; Posts  </p>
                        <div className="postss">

                            {user.totalPosts > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post._id} post={post} isAllowed={isAllowed} />
                                ))
                            ) : (
                                <p className='noposts'>No posts available</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
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
            )}

        </div>

    )

}
export default Profile