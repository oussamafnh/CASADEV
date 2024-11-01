import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import "../../style/FiltreAndSearch.css";
import { useEffect, useState } from 'react';
import Alert from '../Alert';

const FiltreAndSearch = () => {
    const [userData, setUserData] = useState(null);
    const [alert, setAlert] = useState(false); // State to control alert visibility
    const navigate = useNavigate(); // Initialize useNavigate
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/auth/user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                    setLoading(false); // Stop loading when data is fetched

                } else {
                    console.error('Failed to fetch user data');
                    setLoading(false); // Stop loading even if there is an error
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false); // Stop loading even if there is an error
            }
        };

        fetchUserData();
    }, []);

    const handleCreatePostClick = () => {
        if (userData) {
            navigate('/CreatePost'); // Redirect if userData exists
        } else {
            setAlert(true); // Show alert if no userData
        }
    };

    if (loading) {
        return (

            <div className="filterandsearch_loading">
                <div className="createpost_loading">
                    <div className="createpost_btn_loading">
                    </div>
                </div>





            </div>
        );
    }
    return (
        <div className="filterandsearch">
            <div className={`${userData ? 'createpost' : 'createpost not_createpost'}`}>
                <div onClick={handleCreatePostClick} className="createpost_btn">
                    <FontAwesomeIcon icon={faPlus} className="plus_icon" />   
                       Create A Post
                </div>
            </div>



            {alert && (
                <Alert
                    message="Please log in to create a post."
                    type="error"
                    onClose={() => setAlert(false)} // Close alert after timeout
                />
            )}
        </div>
    );
};

export default FiltreAndSearch;
