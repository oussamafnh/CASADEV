import '../style/MobileWarning.css';
import { Logo2 } from '../assets/logo2';
import bg from '../assets/bg.png';
const MobileWarning = () => {
    return (
        <div className="mobile-warning">
            <img src={bg} alt="Logo" />
            <div className="message-container">
                <Logo2 />
                <h2>We are Coming Soon!</h2>
                <p>This app is not available on mobile yet, but don't worry – we're working on it!</p>
            </div>
        </div>
    );
};

export default MobileWarning;
