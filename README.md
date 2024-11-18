# CASADEV

CASADEV is a social media application inspired by platforms like Facebook, Instagram, and LinkedIn. It allows users to create posts, interact with content, manage their profiles, and more. The app is designed to provide an engaging and user-friendly experience for users to share updates, interact with friends, and keep up with what’s happening in their community.

## Features

- **User Authentication**: Secure login and registration system.
- **Post Creation**: Create, edit, and delete posts.
- **Profile Management**: Set up and manage your profile.
- **Image Upload**: Upload images to Cloudinary.
- **Real-time Interactions**: Like, comment, and bookmark posts.
- **Responsive Design**: Optimized for both desktop and mobile.

## Technology Stack

- **Frontend**: React.js, TypeScript, Vite
- **Backend**: Node.js, Express, MongoDB (or your chosen backend stack)
- **Cloud Storage**: Cloudinary for image uploads
- **Deployment**: Vercel (Frontend), Render (Backend)

## Environment Variables

Before running the application locally, make sure you have the following environment variables set in your `.env` file:

```env
VITE_CLOUDINARY_UPLOAD_PRESET=f2cepch9
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/dq7kjds8s/image/upload
VITE_API_ENDPOINT_URL=https://casadev2-4aiv.onrender.com
```

- `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset key for uploading images.
- `VITE_CLOUDINARY_URL`: Cloudinary API URL for uploading images.
- `VITE_API_ENDPOINT_URL`: URL of the backend API endpoint.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

To get started with CASADEV, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/casadev.git
cd casadev
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the root of the project and add the required environment variables:

```env
VITE_CLOUDINARY_UPLOAD_PRESET=f2cepch9
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/dq7kjds8s/image/upload
VITE_API_ENDPOINT_URL=https://casadev2-4aiv.onrender.com
```

### 4. Run the development server

```bash
npm run dev
```

Your app should now be running at [http://localhost:3000](http://localhost:3000).

## Contributing

We welcome contributions to CASADEV! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Open a pull request.

## License

This project is licensed under the MIT License

## Acknowledgments

- [Vite](https://vitejs.dev/) for fast development
- [Cloudinary](https://cloudinary.com/) for image hosting
- [React](https://reactjs.org/) for building the UI
- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend
