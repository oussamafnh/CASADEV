import { useState, useEffect } from 'react';
import '../../style/postcard.css';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';


const PostCard = ({ post, isAllowed }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handlePostClick = () => {
        navigate(`/post/${post._id}`);
    };

    const [isLiked, setIsLiked] = useState(false); // Initial like state
    const [likeCount, setLikeCount] = useState(post.likeCount); // Like count
    const [alert, setAlert] = useState(null); // State to control alert

    const handleLikeToggle = async () => {
        console.log(isAllowed);
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to like posts!", type: "error" });
            return;
        }

        try {
            if (isLiked) {
                await fetch(`http://localhost:8090/api/post/${post._id}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount - 1);
            } else {
                await fetch(`http://localhost:8090/api/post/${post._id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    useEffect(() => {
        if (isAllowed && post.likeCount > 0) {
            setIsLiked(true);
        }
    }, [isAllowed, post.likeCount]);

    // Helper function to format the post time
    const formattedPostTime = () => {
        const createdAt = new Date(post.createdAt);
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return createdAt >= oneMonthAgo
            ? formatDistanceToNow(createdAt, { addSuffix: false }) // e.g., "20 mins ago"
            : format(createdAt, 'MMMM d, yyyy'); // e.g., "September 12, 2024"
    };  

    const handleEditClick = () => {
        navigate(`/editPost/${post._id}`); // Navigate to edit post page
    };
    // console.log('Post:', post.commentCou
    const handleProfileClick = () => {
        if (post && post.authorId) {
          navigate(`/profile/${post.authorId}`);
        }
      };

    return (
        <div className="post_card" onClick={handleProfileClick}>
            <div className="post_header">
                <img
                    src={post.authorAvatar || 'https://via.placeholder.com/50'}
                    alt="Avatar"
                    className="avatar"
                />
                <div className="post_author_info" >
                    <span className="author_name">{post.isMe ? 'You' : (post.author || 'Unknown Author')}</span>
                    {/* <span className="author_name">{post.author || 'Unknown Author'}</span> */}
                    <span className="post_time">{formattedPostTime()}</span>
                </div>
            </div>
            <div className="post_content" onClick={handlePostClick}>
                <h3>{post.title}</h3>
                <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.image && <img src={post.image} alt="Post content" className="post_image" />}
            </div>

            <div className="post-actions">
                <button
                    className={`like-btn elegant-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLikeToggle}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isLiked && isAllowed ? '#0073b1' : 'none'}
                        stroke="#0073b1"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        className="like-icon"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {likeCount} Like
                </button>

                <button className="comment-btn elegant-btn " onClick={handlePostClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="#0073b1"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        className="comment-icon"
                    >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {post.commentCount} Comment{post.commentCount > 0 ? 's' : ''}
                </button>

                <button className="comment-btn elegant-btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="#0073b1"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        className="comment-icon"
                    >
                        <path d="M5 3h14a2 2 0 012 2v16l-7-4-7 4V5a2 2 0 012-2z" />
                    </svg>
                    Save
                </button>
                {post.isMe && ( // Check if isMe is true
                    <button className="comment-btn elegant-btn" onClick={handleEditClick}>
                        <svg className="comment-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="_24x24_On_Light_Edit" data-name="24x24/On Light/Edit">
                            <rect id="view-box" width="24" height="24" fill="none" />
                            <path id="Shape" d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0,0,1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0,0-1.727,0L10.47,3.91Z" transform="translate(3.25 3.25)" fill="#141124" />
                        </svg>
                        Edit
                    </button>
                )}
            </div>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>
    );
};

export default PostCard;
