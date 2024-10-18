// import { useState } from 'react';
// import '../../style/homeposts.css';

// const PostCard = ({ post }) => {
//     const [isLiked, setIsLiked] = useState(false); // Initial like state
//     const [likeCount, setLikeCount] = useState(post.likeCount); // Like count

//     const handleLikeToggle = async () => {
//         try {
//             if (isLiked) {
//                 // Unlike the post
//                 await fetch(`http://localhost:8080/api/post/${post._id}/unlike`, {
//                     method: 'DELETE',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     credentials: 'include'
//                 });
//                 setLikeCount(likeCount - 1); // Decrease like count
//             } else {
//                 // Like the post
//                 await fetch(`http://localhost:8080/api/post/${post._id}/like`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     credentials: 'include'
//                 });
//                 setLikeCount(likeCount + 1); // Increase like count
//             }
//             setIsLiked(!isLiked); // Toggle the like state
//         } catch (error) {
//             console.error('Error toggling like:', error);
//         }
//     };

//     return (
//         <div className="post_card">
//             <div className="post_header">
//                 <img
//                     src={post.authorAvatar || 'https://via.placeholder.com/50'}
//                     alt="Avatar"
//                     className="avatar"
//                 />
//                 <div className="post_author_info">
//                     <span className="author_name">{post.author || 'Unknown Author'}</span>
//                     <span className="post_time">{new Date(post.createdAt).toLocaleString()}</span>
//                 </div>
//             </div>
//             <div className="post_content">
//                 <h3>{post.title}</h3>
//                 <p>{post.content}</p>
//                 {post.image && <img src={post.image} alt="Post content" className="post_image" />}
//             </div>

//             <div className="post-actions">
//                 <button className={`like-btn elegant-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeToggle}>
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill={isLiked ? '#0073b1' : 'none'}
//                         stroke="#0073b1"
//                         viewBox="0 0 24 24"
//                         strokeWidth="2"
//                         className="like-icon"
//                     >
//                         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                     </svg>
//                     {likeCount} Like
//                 </button>
//                 <button className="comment-btn elegant-btn">
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         stroke="#0073b1"
//                         viewBox="0 0 24 24"
//                         strokeWidth="2"
//                         className="comment-icon"
//                     >
//                         <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
//                     </svg>
//                     Comment
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PostCard;


import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/homeposts.css';

const PostCard = ({ post, isAllowed }) => {
    const [isLiked, setIsLiked] = useState(false); // Initial like state
    const [likeCount, setLikeCount] = useState(post.likeCount); // Like count
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLikeToggle = async () => {
        // Redirect if posts are not allowed
        if (!isAllowed) {
            navigate("/", { replace: true });
        }

        try {
            if (isLiked) {
                // Unlike the post
                await fetch(`http://localhost:8080/api/post/${post._id}/unlike`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount - 1); // Decrease like count
            } else {
                // Like the post
                await fetch(`http://localhost:8080/api/post/${post._id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                setLikeCount(likeCount + 1); // Increase like count
            }
            setIsLiked(!isLiked); // Toggle the like state
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Set isLiked to true if isAllowed is true and post is already liked
    useEffect(() => {
        if (isAllowed && post.likeCount > 0) {
            setIsLiked(true); // Set as liked if there are likes
        }
    }, [isAllowed, post.likeCount]);

    return (
        <div className="post_card">
            <div className="post_header">
                <img
                    src={post.authorAvatar || 'https://via.placeholder.com/50'}
                    alt="Avatar"
                    className="avatar"
                />
                <div className="post_author_info">
                    <span className="author_name">{post.author || 'Unknown Author'}</span>
                    <span className="post_time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div className="post_content">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post content" className="post_image" />}
            </div>

            <div className="post-actions">
                <button className={`like-btn elegant-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeToggle}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isLiked ? '#0073b1' : 'none'}
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
            </div>
        </div>
    );
};

export default PostCard;
