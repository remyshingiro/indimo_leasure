// generate-sitemap.js
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv'; // 🚀 Import dotenv

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

  const staticRoutes = [
    '',
    '/products',
    '/cart',
    '/about',
    '/contact',
    '/profile'
  ];

  try {
    console.log("📡 Fetching dynamic products from Firebase...");
    // 2. FETCH DYNAMIC SLUGS FROM FIREBASE
    const querySnapshot = await getDocs(collection(db, "products"));
    const productSlugs = querySnapshot.docs.map(doc => `/products/${doc.data().slug}`);

    const allRoutes = [...staticRoutes, ...productSlugs];

    // 3. BUILD THE XML STRING
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${route === '' ? '1.0' : route.includes('/products/') ? '0.8' : '0.6'}</priority>
  </url>`).join('')}
</urlset>`;

    // 4. WRITE TO PUBLIC FOLDER
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Success! ${allRoutes.length} routes saved to ./public/sitemap.xml`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    process.exit(1);
  }
}

generate();