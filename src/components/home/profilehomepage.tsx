import "../../style/profilehomepage.css";
import { useEffect, useState } from 'react';


const Profilehomepage = () => {
    const [userData, setUserData] = useState<{
        avatar: string | undefined; username: string
    } | null>(null); // State to hold user data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/auth/user', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    console.log(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

        };

        fetchUserData(); // Call the fetch function on component mount
    }, []);

    return (
        <div className="Profilehomepage">
            <div className="profilecard">
                <div className=" profilesection">
                    <div className="header">
                    </div>
                    <div className="name">
                        <p className="username">{userData.firstName} {userData.lastName}</p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Profilehomepage