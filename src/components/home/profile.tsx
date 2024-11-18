import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../style/profile.css";
import PostCard from "./PostCard";
import Alert from '../Alert';

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
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [showReportPopUp, setShowReportPopUp] = useState(false);
    const [reportReason, setReportReason] = useState("Inappropriate content");
    const [reportDescription, setReportDescription] = useState("");
    const [reportLoading, setReportLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/auth/user/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    navigate('/profile/notfound ');
                    return;
                }
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
    }, [userId,navigate]);

    useEffect(() => {
        const fetchfollowersdata = async () => {
            try {
                const response1 = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/follow/${userId}/followers`);
                const response2 = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/follow/${userId}/following`);
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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/author/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                const data = await response.json();
                setPosts(data.posts);
                setIsAllowed(data.isAllowed);
                setTimeout(() => setLoading2(false), 1000);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setTimeout(() => setLoading2(false), 1000);
            }
        };

        fetchPost();
    }, [userId]);

    const fetchFollow = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/follow/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIdToFollow: userId }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.message === "Followed successfully") {
                setIsfollowed(true);
                setFollowersCount(followersCount + 1);
            } else if (data.message === "Unfollowed successfully") {
                setIsfollowed(false);
                setFollowersCount(followersCount - 1);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const submitReport = async () => {
        console.log(userId, reportReason, reportDescription);
        setReportLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetId: userId,
                    targetType: "User",
                    reason: reportReason,
                    description: reportDescription,
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setAlert({ message: "Report submitted successfully!", type: "success" });
                setShowReportPopUp(false);
            } else {
                setAlert({ message: "Failed to submit report: " + data.message, type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Failed to submit report: " + error, type: "error" });
        } finally {
            setReportLoading(false);
        }
    };


    const fetchReport = async () => {
        setShowReportPopUp(true);
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
                            <button className="profilecard_navbar_btn followerscount">
                                {user.totalPosts} Posts - {followersCount} followers - {followingCount} following
                            </button>
                            <button className={`profilecard_navbar_btn ${isAllowedtoFollow ? '' : 'cant_follow'}`} onClick={fetchFollow}>
                                {isfollowed ? "Unfollow" : (isfollowingMe ? "Follow back" : "Follow")}
                            </button>
                            <button className={`profilecard_navbar_btn profilecard_navbar_btn_logout ${isAllowed ? '' : 'cant_report'}`} onClick={fetchReport}>
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
            {showReportPopUp && (
                <>
                    <div className="reportbg" onClick={() => setShowReportPopUp(false)}>
                    </div>

                    <div className="report-popup">
                        <div className="report-popup-content">
                            <h3>Report User</h3>
                            <div className="radio-group">
                                <p>Select a reason:</p>
                                {[
                                    "Inappropriate content",
                                    "Harassment",
                                    "Spam",
                                    "Fake account",
                                    "Hate speech",
                                    "Privacy violation",
                                    "Scam or fraud",
                                    "Impersonation",
                                    "Violence or Threats"
                                ].map((reason) => (
                                    <label key={reason} className="radio-option">
                                        <input
                                            type="radio"
                                            name="report-reason"
                                            value={reason}
                                            checked={reportReason === reason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                        />
                                        {reason}
                                    </label>
                                ))}
                            </div>

                            <label htmlFor="report-description">Description (optional):</label>
                            <textarea
                                id="report-description"
                                value={reportDescription}
                                onChange={(e) => setReportDescription(e.target.value)}
                                placeholder="Provide additional details..."
                            />
                            <div className="report-popup-actions">
                                <button onClick={() => setShowReportPopUp(false)} disabled={reportLoading}>
                                    Cancel
                                </button>
                                <button onClick={submitReport} disabled={reportLoading}>
                                    {reportLoading ? "Submitting..." : "Submit Report"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>

            )}
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>

    )

}
export default Profile