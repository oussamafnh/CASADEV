import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '../Alert';
import '../../style/PostDetails.css';
import { formatDistanceToNow, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';




const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState({
        _id: "",
        title: "",
        content: "",
        image: "",
        video: "",
        author: "",
        authorId: "",
        authorAvatar: "",
        isEdited: false,
        createdAt: "",
        updatedAt: ""
    });
    const [newComment, setNewComment] = useState('');
    const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isMe, setisMe] = useState(0);
    const [isAllowed, setIsAllowed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setPost(data.post);
                setIsLiked(data.isLiked);
                setIsSaved(data.isSaved);
                setLikeCount(data.likeCount);
                setisMe(data.isMe);
                setIsAllowed(data.isAllowed);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSaveToggle = async () => {
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to save posts!", type: "error" });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/save/${postId}/save`, {
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


    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };
    useEffect(() => {
        fetchComments();
    }, [postId]);




    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAllowed) {
            setAlert({ message: "You must be logged in to comment!", type: "error" });
            return;
        }

        if (!newComment.trim()) {
            setAlert({ message: "Comment cannot be empty!", type: "error" });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                await fetchComments();
                setNewComment('');
            } else {
                const error = await response.json();
                setAlert({ message: error.message || "Failed to post comment.", type: "error" });
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            setAlert({ message: "An error occurred while posting your comment.", type: "error" });
        }
    };

    const handleLikeToggle = async () => {
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to like posts!", type: "error" });
            return;
        }

        try {
            if (isLiked) {
                await fetch(`${API_BASE_URL}/api/post/${postId}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount - 1);
            } else {
                await fetch(`${API_BASE_URL}/api/post/${postId}/like`, {
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

    const handleEditClick = () => {
        navigate(`/edit-post/${postId}`);
    };


    const formattedPostTime = () => {
        const createdAt = new Date(post.createdAt);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return createdAt >= oneMonthAgo
            ? formatDistanceToNow(createdAt, { addSuffix: false })
            : format(createdAt, 'MMMM d, yyyy');
    };

    const formattedCommentTime = (createdAt: string | number | Date) => {
        const createdAtDate = new Date(createdAt);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return createdAtDate >= oneMonthAgo
            ? formatDistanceToNow(createdAtDate, { addSuffix: true })
            : format(createdAtDate, 'MMMM d, yyyy');
    };
    const handleProfileClick = () => {
        if (isMe) {
            navigate(`/myprofile`);
        }
        else {
            navigate(`/profile/${post.authorId}`);
        }
    };

    const handleCommentProfileClick = (userId: any, isMe: any) => {
        if (isMe) {
            navigate(`/myprofile`);
        } else {
            navigate(`/profile/${userId}`);
        }
    };


    const handleDeleteClick = () => {
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/post/delete/${post._id}`, {
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
        }
    };

    const cancelDelete = () => {
        setShowDeletePopup(false);
    };


    if (loading) {
        return (


            <div className="postdetailspage_loading">
                <div className="postdetails_loading">
                    <div className="post-detail_loadings">
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
                        </div>

                        <div className="comment-form_loading">
                            <div className="commenttextarea_loading"></div>
                            <div className="btn_loading"></div>
                        </div>
                        <div className="post-actions_loading">
                            <div className="likecounter_loading"></div>
                            <div className="commentcounter_loading"></div>
                            <div className="savecounter_loading"></div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }


    return (

        <div className="postdetailspage">
            <div className={` ${post.image ? 'postdetails' : 'postdetails withou-img'}`}>
                {post.image &&
                    <div className="postdetailsimg">
                        <img onClick={handleProfileClick} src={post.image} alt="Post content" className="post-image" />
                    </div>
                }
                <div className="post-details">
                    <div className="post-header">
                        <img
                            src={post.authorAvatar || 'https://via.placeholder.com/50'}
                            alt="Avatar"
                            className="avatar"
                        />
                        <div className="post-author-info">
                            <span onClick={handleProfileClick} className="author_name">{isMe ? 'You' : (post.author || 'Unknown Author')}</span>
                            <span className="post-time">{formattedPostTime()}</span>
                        </div>
                    </div>

                    <div className="post-content">
                        <h3>{post.title}</h3>
                        <div className="post-content_content" dangerouslySetInnerHTML={{ __html: post.content }} />


                        <div className="comments-section">
                            {comments.length > 0 ? (
                                comments.map((comment: { _id: Key | null | undefined; userAvatar: any; username: string | undefined; userId: any; isMe: any; content: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; createdAt: string | number | Date; }) => (
                                    <div key={comment._id} className="comment">
                                        <img
                                            src={comment.userAvatar || 'https://via.placeholder.com/50'}
                                            alt={comment.username}
                                            onClick={() => handleCommentProfileClick(comment.userId, comment.isMe)}
                                            className="comment-avatar"
                                        />
                                        <div className="comment-content">
                                            <span className="comment-username" onClick={() => handleCommentProfileClick(comment.userId, comment.isMe)}>{comment.username || 'Unknown User'}</span>
                                            <p>{comment.content}</p>
                                            <span className="comment-time">{formattedCommentTime(comment.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <p className='nocomments'>no comments</p>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className={`post-actions ${!isAllowed ? 'notalolwed-post-actions' : ''}`}>
                        <form className={`comment-form ${!isAllowed ? 'notallowed-comment-form' : ''}`} onSubmit={handleCommentSubmit}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment"
                            ></textarea>
                            <button type="submit" className="elegant-btn">Submit</button>
                        </form>
                        <div className="btns">
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
                            {isMe && (
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

                    </div>
                </div>
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

export default PostDetails;
