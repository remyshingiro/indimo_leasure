// generate-sitemap.js
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv'; 

// Load variables from .env file into process.env
dotenv.config();

// 1. FIREBASE CONFIG using process.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BASE_URL = 'https://kigaliswimshop.online';

async function generate() {
  console.log("🚀 Starting Sitemap Generation...");

  // 🚀 ADDED: '/blog' to the static routes
  const staticRoutes = [
    '',
    '/products',
    '/blog', 
    '/cart',
    '/about',
    '/contact',
    '/profile'
  ];

  try {
    console.log("📡 Fetching dynamic products and posts from Firebase...");
    
    // 2a. FETCH DYNAMIC PRODUCTS
    const querySnapshot = await getDocs(collection(db, "products"));
    const productSlugs = querySnapshot.docs.map(doc => `/products/${doc.data().slug}`);

    // 2b. 🚀 NEW: FETCH DYNAMIC BLOG POSTS
    const postsSnapshot = await getDocs(collection(db, "posts"));
    // Falls back to document ID if you haven't added a slug field to your posts yet
    const postSlugs = postsSnapshot.docs.map(doc => `/blog/${doc.data().slug || doc.id}`);

    const allRoutes = [...staticRoutes, ...productSlugs, ...postSlugs];

    // 3. BUILD THE XML STRING
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => {
    
    // 🚀 NEW: Smarter SEO Priority Logic
    let priority = '0.6';
    if (route === '') priority = '1.0'; // Homepage is most important
    else if (route === '/products' || route === '/blog') priority = '0.9'; // Main hubs
    else if (route.startsWith('/products/')) priority = '0.8'; // Individual items
    else if (route.startsWith('/blog/')) priority = '0.7'; // Articles

    return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

    // 4. WRITE TO PUBLIC FOLDER
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Success! ${allRoutes.length} routes saved to ./public/sitemap.xml`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    process.exit(1);
  }
}

generate();