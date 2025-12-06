# Product Images Directory

This folder is where you can store product images that will be referenced by URL in your products.

## How to Add Images

### Option 1: Upload via Admin Dashboard (Recommended)
1. Go to Admin Dashboard → Products tab
2. Click "Add Product" or "Edit" on an existing product
3. In the "Product Image" section:
   - Click "Choose File" to upload from your computer
   - OR enter an image URL
4. Images uploaded via the form are automatically converted to base64 and saved to localStorage

### Option 2: Place Images in This Folder
1. Add your image files to this `public/images/` folder
2. Use the URL format: `/images/your-image-name.jpg` in the product form
3. Example: If you add `cap-1.jpg` here, use `/images/cap-1.jpg` as the image URL

## Image Requirements
- **Max file size**: 5MB
- **Supported formats**: JPG, PNG, GIF, WebP
- **Recommended dimensions**: 800x800px or larger (square format works best)

## Current Product Images
The following images are referenced in the default products:
- `/images/cap-1.jpg` - Swimming cap image
- `/images/cap-2.jpg` - Swimming cap alternate image
- `/images/goggles-1.jpg` - Swimming goggles image
- `/images/swimsuit-1.jpg` - Swimsuit image
- `/images/kickboard-1.jpg` - Kickboard image
- `/images/pullbuoy-1.jpg` - Pull buoy image

## Notes
- Images uploaded via the form are stored as base64 in localStorage
- Images referenced by URL must be in the `public/images/` folder
- When editing a product, you'll see the current image in the preview
- You can replace an image by uploading a new one or changing the URL

