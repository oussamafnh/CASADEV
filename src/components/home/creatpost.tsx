import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../../style/creatpost.css";
import Alert from '../Alert';

const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);


    const handleImageUpload = async (file: string | Blob) => {
        console.log('Starting image upload...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_CLOUDINARY_URL}`, {
                method: 'POST',
                body: formData,
            });

            console.log('Image upload response:', response);
            const data = await response.json();

            if (response.ok) {
                setImage(data.secure_url);
                setUploadProgress(100);
                setAlert({ message: "Image uploaded successfully!", type: "success" });

            } else {
                setAlert({ message: "Image upload failed!", type: "error" });
                throw new Error(data.message || 'Image upload failed.');

            }
        } catch (error) {
            setAlert({ message: "Image upload failed!", type: "error" });
            console.error("Image upload failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Form submitted:', { title, content, image });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT_URL}/api/post/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, content, image }),
            });


            const responseData = await response.json();

            if (!response.ok) {
                setAlert({ message: "You must be logged in to create a post!", type: "error" });
                throw new Error(responseData.message || 'Failed to create post.');

            }

            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    
    return (
        <div className="createpostpage">
            <h1>Create a Post</h1>
            <div className="container">
                <div
                    className={`image-upload ${image || loading ? 'img-uploaded' : ''}`}
                    onClick={() => document.getElementById('file-input')?.click()}
                    onDrop={(e) => {
                        e.preventDefault();
                        console.log('Image dropped:', e.dataTransfer.files[0]);
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
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                                handleImageUpload(files[0]);
                            }
                        }}
                    />
                    {loading && <progress value={uploadProgress} max="100"></progress>}
                    {image && <img src={image} alt="Uploaded" className="uploaded-image-preview" />}
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
                        placeholder="Write your post content here..."
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
                        Submit
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

export default CreatePost;