import { useState, useEffect } from 'react';
import '../style/alert.css';
const Alert = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) {
                onClose();
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    if (!visible) return null;
    return (
        <div className={`alert-box ${type}`}>
            <p>{message}</p>
        </div>
    );
};
export default Alert;