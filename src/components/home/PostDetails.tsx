import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the post ID from the URL
import Alert from '../Alert';
import '../../style/postdetails.css'; // Create a new CSS file for styling

const PostDetails = () => {
    const { postId } = useParams(); // Get postId from URL
    const [post, setPost] = useState(null); // State to hold post data
    // const [comments, setComments] = useState([]); // State to hold comments
    const [newComment, setNewComment] = useState(''); // State to hold new comment input
    const [alert, setAlert] = useState(null); // State to control alert
    const [isLiked, setIsLiked] = useState(false); // Initial like state
    const [likeCount, setLikeCount] = useState(0); // Like count
    const [isAllowed, setIsAllowed] = useState(false); // Permission to interact (like/comment)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/post/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                setPost(data.post);
                setIsLiked(data.isLiked); // Assuming you have a field in your API response that tells if the post is liked
                setLikeCount(data.likeCount);
                setIsAllowed(data.isAllowed);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleLikeToggle = async () => {
        if (!isAllowed) {
            setAlert({ message: "You must be logged in to like posts!", type: "error" });
            return;
        }

        try {
            if (isLiked) {
                // Unlike the post
                await fetch(`http://localhost:8090/api/post/${postId}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount - 1); // Decrease like count
            } else {
                // Like the post
                await fetch(`http://localhost:8090/api/post/${postId}/like`, {
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

    // const handleCommentSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!newComment.trim()) return;

    //     if (!isAllowed) {
    //         setAlert({ message: "You must be logged in to comment!", type: "error" });
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:8090/api/post/${post._id}/comment`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ comment: newComment }),
    //             credentials: 'include',
    //         });
    //         const data = await response.json();
    //         setComments([...comments, data.comment]); // Append the new comment
    //         setNewComment(''); // Clear input
    //     } catch (error) {
    //         console.error('Error adding comment:', error);
    //     }
    // };
    if (!post) {
        return (
            
        );
    }

    return (
        <div className="postdetailspage">
            {post.image &&
                <div className="postdetailswithimage">
                    <div className="postdetailsimg">
                        <img src={post.image} alt="Post content" className="post-image" />
                    </div>
                    <div className="post-details">
                        <div className="post-header">
                            <img
                                src={post.authorAvatar || 'https://via.placeholder.com/50'}
                                alt="Avatar"
                                className="avatar"
                            />
                            <div className="post-author-info">
                                <span className="author-name">{post.author || 'Unknown Author'}</span>
                                <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="post-content">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </div>

                        <div className={`post-actions ${!isAllowed ? 'notalolwed-post-actions' : ''}`}>
                            <form className={`comment-form ${!isAllowed ? 'notallowed-comment-form' : ''}`}>
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
                                <button className="comment-btn elegant-btn">
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
                                    Comment
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
                            </div>

                        </div>

                        {/* Comments Section */}
                        {/* <div className={`comments-section ${!isAllowed ? 'disabled' : ''}`}>
                            {comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <p>{comment.text}</p>
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>

            }
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)} // Clear the alert after it closes
                />
            )}
        </div>


    );
};

export default PostDetails;
