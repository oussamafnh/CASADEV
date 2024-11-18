import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../style/creatpost.css";
import Alert from '../Alert';

const EditPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.post.title);
                    setContent(data.post.content);
                    setImage(data.post.image);
                } else {
                    setAlert({ message: "Failed to load post data", type: "error" });
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchPost();
    }, [id]);


    const handleImageUpload = async (file: string | Blob) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'f2cepch9');
        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/dq7kjds8s/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setImage(data.secure_url);
                setUploadProgress(100);
                setAlert({ message: "Image uploaded successfully!", type: "success" });
            } else {
                setAlert({ message: "Image upload failed!", type: "error" });
            }
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/${id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, content, image }),
            });
            console.log({ title, content, image })

            if (response.ok) {
                navigate(`/post/${id}`);
            } else {
                setAlert({ message: "Failed to update post", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "error", type: "error" });
        }
    };

    const handleImageDelete = async () => {
        setImage(null);
    };


    return (
        <div className="createpostpage">
            <h1>Edit Post</h1>
            <div className="container">
                <div
                    className={`image-upload ${image || loading ? 'img-uploaded' : ''}`}
                    onClick={() => document.getElementById('file-input')?.click()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleImageUpload(e.dataTransfer.files[0]);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <FontAwesomeIcon icon={faImage} className="upload-icon" />
                    <p>Drag and drop an image or click to upload</p>
                    <input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                    />
                    {loading && <progress value={uploadProgress} max="100"></progress>}
                    {image && <img src={image} alt="Uploaded" className="uploaded-image-preview" />}
                </div>
                <div className="imgbtns">

                    {image && (
                        <>
                            <button type="button" onClick={handleImageDelete} className="delete-image-btn">
                                Delete Image
                            </button>
                            <button type="button" onClick={() => document.getElementById('file-input')?.click()} className="upload-new-image-btn">
                                Upload New Image
                            </button>
                        </>
                    )}
                </div>

                <div className="create-post-container">
                    <input
                        className='title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post Title"
                        required
                    />

                    <ReactQuill
                        value={content}
                        className='contenttext'
                        onChange={setContent}
                        placeholder="Edit your post content here..."
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'color': [] }, { 'background': [] }],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />

                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleFormSubmit}
                    >
                        Update Post
                    </button>
                </div>
            </div>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </div>
    );
};

export default EditPost;
