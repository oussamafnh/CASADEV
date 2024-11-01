import { useEffect, useRef } from 'react';
import PostCard from './PostCard';
import '../../style/myposts.css';
import Masonry from 'masonry-layout'; // Import Masonry

const Myposts = ({ posts, isAllowed }) => {

    return (
        <div className="mypostspage" >
            <div className="postsmasonry">

                {posts.length > 0 ? (
                    posts.map(post => (
                        <div className="postcontainer" key={post._id}> {/* Move key to this div */}
                            <PostCard post={post} isAllowed={isAllowed} />
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </div>
    );
};

export default Myposts;

