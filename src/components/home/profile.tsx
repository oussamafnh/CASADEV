import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the post ID from the URL
import "../../style/profile.css";
import PostCard from "./PostCard";
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const { userId } = useParams();


    const [user, setUser] = useState<any>({});
    const [posts, setPosts] = useState<any[]>([]);
    const [isAllowed, setIsAllowed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const navigate = useNavigate();

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
                setLoading1(false);
            } catch (error) {
                console.error("Error fetching post data:", error);
                setLoading1(false);
            }
        };


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
                setIsLiked(data.posts.isLiked);
                setIsSaved(data.posts.isSaved);
        
                // Add a 1-second delay before setting loading2 to false
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching post data:", error);
                
                // Ensure loading2 is set to false after the delay even if there was an error
                setTimeout(() => {
                    setLoading2(false);
                }, 1000);
            }
        };
        
        fetchUser();
        fetchPost();
        


    const backhome = () => {
        navigate(`/`); // Navigate to edit post page
    };
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
                                {user.totalPosts} Posts - followers - following
                            </button>
                            <button className="profilecard_navbar_btn">
                                Follow
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
                        {user.totalPosts > 0 ? (
                            posts.map(post => (
                                <PostCard key={post._id} post={post} isAllowed={isAllowed} />
                            ))
                        ) : (
                            <p className='noposts'>No posts available</p>
                        )}
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