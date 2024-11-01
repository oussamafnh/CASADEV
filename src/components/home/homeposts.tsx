import { useEffect, useState } from 'react';
import PostCard from './PostCard'; // Import the PostCard component
import '../../style/homeposts.css';
import { useNavigate } from "react-router-dom";


const Homeposts = () => {
    const [posts, setPosts] = useState([]);
    const [isAllowed, setIsAllowed] = useState(false); // Track if posts are allowed
    const [loading, setLoading] = useState(true); // Loading state
    const [sortType, setSortType] = useState('latest'); // Default sort type
    const [paginate, setPaginate] = useState(1); // Default sort type
    const navigate = useNavigate(); // Initialize useNavigate


    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const endpoint = sortType === 'latest'
                    ? `http://localhost:8090/api/post/latest?page=${paginate}&limit=10`
                    : `http://localhost:8090/api/post/mostliked?page=${paginate}&limit=10`;
    
                const response = await fetch(endpoint, {
                    credentials: 'include',
                });
                const data = await response.json();
    
                setIsAllowed(data.isAllowed); // Set isAllowed based on API response
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
    
        fetchPosts();
    }, [sortType, paginate]); // Add paginate to the dependency array
    const handleNextClick = () => {
        setPaginate(prev => prev + 1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Adds a smooth scroll effect
        });
    };

    
    const handlePreviousClick = () => {
        setPaginate(prev => Math.max(prev - 1, 1));
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };


    return (
        <div className={` ${loading ? 'Homeposts_loading' : 'Homeposts'}`}>
            <div className="sorting-bar">
                <div className="sorting-line"></div>
                <span className="sort-label">Sort by : </span>
                <select
                    className="sort-dropdown"
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="latest">Latest</option>
                    <option value="top">Top</option>
                </select>
            </div>

            {loading ? (
                <>
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
                </>

            ) : (
                <>
                    <div className={` ${paginate === 1 ? 'not_pagination' : 'pagination'}`}>
                        <button 
                            className="pagination_btn" 
                            onClick={handlePreviousClick} 
                            id='top'
                        >
                            Previous
                        </button>
                    </div>
                    {
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} isAllowed={isAllowed} />
                        ))
                    }
                    <div className="pagination">
                        <button 
                            className="pagination_btn" 
                            onClick={handleNextClick}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Homeposts;
