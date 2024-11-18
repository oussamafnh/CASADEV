import { Link } from 'react-router-dom';
import '../style/notfound.css';

const PostFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Post Not Found</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default PostFound;