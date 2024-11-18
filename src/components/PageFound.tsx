import { Link } from 'react-router-dom';
import '../style/notfound.css';

const PageFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default PageFound;