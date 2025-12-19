// src/utils/uploadService.js

// 1. REPLACE WITH YOUR ACTUAL KEYS FROM CLOUDINARY DASHBOARD
const CLOUD_NAME = 'dvsf1nao5'; 
const UPLOAD_PRESET = 'bad9m3zn'; 

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'kigali-swim-products'); // Keeps your cloud organized

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Image upload failed');
    }

    const data = await response.json();
    return data.secure_url; // This returns the permanent HTTP URL
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};