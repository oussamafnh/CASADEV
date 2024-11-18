import { useState, useEffect, useRef } from 'react';
import '../../style/postcard.css';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';


const PostCard = ({ post, isAllowed }: { post: any; isAllowed: boolean }) => {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isSaved, setIsSaved] = useState(post.isSaved);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isTallContent, setIsTallContent] = useState(false);



    const handleLikeToggle = async () => {
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to like posts!", type: "error" });
            return;
        }

        try {
            if (isLiked) {
                await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/${post._id}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount - 1);
            } else {
                await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/${post._id}/like`, {
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

    const handleSaveToggle = async () => {
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to save posts!", type: "error" });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/save/${post._id}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();

            if (data.message === "Post saved") {
                setAlert({ message: "Post saved!", type: "success" });
            } else if (data.message === "Post unsaved") {
                setAlert({ message: "Post unsaved!", type: "success" });
            } else {
                setAlert({ message: "Failed to save/unsave post.", type: "error" });
            }
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const formattedPostTime = () => {
        const createdAt = new Date(post.createdAt);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return createdAt >= oneMonthAgo
            ? formatDistanceToNow(createdAt, { addSuffix: false })
            : format(createdAt, 'MMMM d, yyyy');
    };

    const handleEditClick = () => {
        navigate(`/edit-post/${post._id}`);
    };
    const handleProfileClick = () => {
        if (post && post.authorId) {
            if (post.isMe) {
                navigate(`/myprofile`);
            }
            else {
                navigate(`/profile/${post.authorId}`);
            }
        }
    };


    const handlePostClick = () => {
        navigate(`/post/${post._id}`, { replace: true });
    };

    const handleDeleteClick = () => {
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/delete/${post._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                console.log("Post deleted successfully");
            } else {
                console.error("Error deleting post:", response.status);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setShowDeletePopup(false);
            window.location.reload();
        }
    };

    const cancelDelete = () => {
        setShowDeletePopup(false);
    };



    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.offsetHeight;
            setIsTallContent(contentHeight >= window.innerHeight * 0.45);
        }
    }, [post.content]);


    return (
        <div className="post_card">
            <div className="post_header" >
                <img
                    src={post.authorAvatar || 'https://via.placeholder.com/50'}
                    alt="Avatar"
                    className="avatar"
                    onClick={handleProfileClick}
                />
                <div className="post_author_info" >
                    <span className="author_name" onClick={handleProfileClick}>{post.isMe ? 'You' : (post.author || 'Unknown Author')}</span>
                    <span className="post_time">{formattedPostTime()}</span>
                </div>
            </div>
            <div className="post_content" onClick={handlePostClick}>
                <h3>{post.title}</h3>
                <div className="content_ct" ref={contentRef}>
                    <div className={` ${isTallContent ? 'guardian' : 'show'}`}></div>
                    <div className="post_content_content" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
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

                <button className="comment-btn elegant-btn" onClick={handleSaveToggle}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isSaved && isAllowed ? 'black' : 'none'}
                        stroke="black"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        className="comment-icon"
                    >
                        <path d="M5 3h14a2 2 0 012 2v16l-7-4-7 4V5a2 2 0 012-2z" />
                    </svg>
                    Save
                </button>
                {post.isMe && (
                    <>
                        <button className="comment-btn elegant-btn" onClick={handleEditClick}>
                            <svg className="comment-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="_24x24_On_Light_Edit" data-name="24x24/On Light/Edit">
                                <rect id="view-box" width="24" height="24" fill="none" />
                                <path id="Shape" d="M.75,17.5A.751.751,0,0,1,0,16.75V12.569a.755.755,0,0,1,.22-.53L11.461.8a2.72,2.72,0,0,1,3.848,0L16.7,2.191a2.72,2.72,0,0,1,0,3.848L5.462,17.28a.747.747,0,0,1-.531.22ZM1.5,12.879V16h3.12l7.91-7.91L9.41,4.97ZM13.591,7.03l2.051-2.051a1.223,1.223,0,0,0,0-1.727L14.249,1.858a1.222,1.222,0,0,0-1.727,0L10.47,3.91Z" transform="translate(3.25 3.25)" fill="#141124" />
                            </svg>
                            Edit
                        </button>
                        <button className="comment-btn elegant-btn" onClick={handleDeleteClick}>
                            <svg className="comment-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                            </svg>
                            Delete
                        </button>
                    </>
                )}
            </div>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
            {showDeletePopup && (
                <div className="delete-popup">
                    <div className="delete-popup-content">
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className='btns'>
                            <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                            <button onClick={confirmDelete} className="confirm-btn">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PostCard;
