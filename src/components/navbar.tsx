// src/components/Navbar.tsx
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Logo1 } from '../assets/logo1';
import { Logo2 } from '../assets/logo2';
import "../style/navbar.css";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <Link to="/"> {/* Use Link instead of <a> */}
                    <Logo1 />
                </Link>

                <div className="subscribesec">
                    <Link to="/Auth" className="a-button"> {/* Use Link for login button */}
                        <button className="button">
                            <p className="text">Login</p>
                        </button>
                    </Link>
                </div>
                    <Logo2 />
            </div>
        </div>
    );
};

export default Navbar;
