import Myposts from "./myposts"
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To get the post ID from the URL
import "../../style/profile.css";

import { Link } from 'react-router-dom';
import PostCard from "./PostCard";


const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isAllowed, setIsAllowed] = useState(false);



    useEffect(() => {
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

            } catch (error) {
                console.error("Error fetching post data:", error);
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
                setIsAllowed(data.isAllowed)

            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchUser();
        fetchPost();
    }, [userId]);


    console.log(user)

    return (
        <div className="profilecomponent">
            {/* <div className="profilesection">
                <div className="profile-1st-section">
                    <img src={user.avatar} className="avatar" />
                    <div className="profileinfos">
                        <p className="profileinfos-fullname">{user.firstName} {user.lastName}</p>
                        <p className="profileinfos-username">{user.username}</p>
                        <div className="stats">
                            <p> Posts</p>
                            <p> followers</p>
                            <p> following</p>
                            <div className="edit-profile">
                                <button
                                    className="edit-profile_btn"
                                // onClick={handlePreviousClick}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-2nd-section">
                </div>
            </div> */}




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
            <div className="profileposts">
                <div className="profilepostscontainer">
                    {/* <Myposts posts={posts} isAllowed={isAllowed}  /> */}
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard post={post} isAllowed={isAllowed} />
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            </div>
        </div>

    )
}

export default Profile