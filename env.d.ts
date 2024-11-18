interface ImportMetaEnv {
    VITE_CLOUDINARY_UPLOAD_PRESET: string;
    VITE_CLOUDINARY_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  