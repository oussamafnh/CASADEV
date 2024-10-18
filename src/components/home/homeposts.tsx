// import { useEffect, useState } from 'react';
// import PostCard from './PostCard'; // Import the PostCard component
// import '../../style/homeposts.css';

// const Homeposts = () => {
//     const [posts, setPosts] = useState([]);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await fetch('http://localhost:8080/api/post/latest', {
//                     credentials: 'include',
//                 });
//                 const data = await response.json();

//                 setPosts(data.posts);
//                 console.log(posts)

//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             }
//         };

//         fetchPosts();
//     }, []);

//     return (
//         <div className="Homeposts">
//             {posts.map((post) => (
//                 <PostCard key={post._id} post={post} />
//             ))}
//         </div>
//     );
// };

// export default Homeposts;




import { useEffect, useState } from 'react';
import PostCard from './PostCard'; // Import the PostCard component
import '../../style/homeposts.css';

const Homeposts = () => {
    const [posts, setPosts] = useState([]);
    const [isAllowed, setIsAllowed] = useState(false); // Track if posts are allowed

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/post/latest', {
                    credentials: 'include',
                });
                const data = await response.json();

                setIsAllowed(data.isAllowed); // Set isAllowed based on API response
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="Homeposts">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} isAllowed={isAllowed} /> // Pass isAllowed to PostCard
            ))}
        </div>
    );
};

export default Homeposts;
