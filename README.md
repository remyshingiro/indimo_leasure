# Kigali Swim Shop - E-Commerce Website

A modern, mobile-first e-commerce website for selling swimming materials in Kigali, Rwanda.

## Features

### Core E-Commerce Features
- ✅ Product catalog with categories (Caps, Goggles, Swimsuits, Training Equipment, Accessories)
- ✅ Product search and filtering (by category, price, brand)
- ✅ Product detail pages with size/color selection
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout flow with customer information
- ✅ Multiple payment methods (MTN MoMo, Airtel Money, Bank Transfer, Cash on Delivery)
- ✅ Delivery zone selection (Gasabo, Kicukiro, Nyarugenge, Outside Kigali)
- ✅ Order management system

### Localization
- ✅ Bilingual support (English & Kinyarwanda)
- ✅ Language toggle in header
- ✅ All content translated

### Trust & Communication
- ✅ WhatsApp floating button for customer service
- ✅ Contact form
- ✅ FAQ page
- ✅ Return/Exchange policy (bilingual)
- ✅ Privacy Policy & Terms & Conditions
- ✅ Customer testimonials
- ✅ Trust badges

### Admin Dashboard
- ✅ Order management with status updates
- ✅ Product listing
- ✅ Sales statistics
- ✅ Revenue tracking

### Technical Features
- ✅ Progressive Web App (PWA) support
- ✅ Mobile-first responsive design
- ✅ Fast loading with Vite
- ✅ SEO optimized
- ✅ LocalStorage for cart persistence

## Tech Stack

- **Framework**: React.js 18 (Pure JavaScript, no TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Forms**: React Hook Form

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── WhatsAppButton.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── FAQ.jsx
│   │   ├── ReturnPolicy.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Terms.jsx
│   │   └── admin/
│   │       └── Dashboard.jsx
│   ├── stores/           # Zustand stores
│   │   ├── cartStore.js
│   │   └── languageStore.js
│   ├── utils/            # Utility functions
│   │   ├── currency.js
│   │   └── delivery.js
│   ├── data/             # Mock data
│   │   └── products.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Tailwind imports
└── index.html
```

## Payment Integration

The website supports multiple payment methods:

1. **MTN Mobile Money**: USSD *182# instructions with merchant code
2. **Airtel Money**: Direct transfer instructions
3. **Bank Transfer**: Bank account details display
4. **Cash on Delivery**: Pay when receiving order

Payment processing is currently manual (transaction ID entry). For production, integrate with:
- Flutterwave Rwanda
- PayPack Rwanda
- Or custom payment gateway

## Delivery Zones

- **Gasabo**: 2,000 RWF, 24 hours
- **Kicukiro**: 2,000 RWF, 24 hours
- **Nyarugenge**: 2,000 RWF, 24 hours
- **Outside Kigali**: 5,000 RWF, 48-72 hours

Free delivery for orders over 50,000 RWF within Kigali.

## Future Enhancements

- [ ] Real payment gateway integration
- [ ] Email/SMS notifications
- [ ] Customer accounts and order history
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Blog section
- [ ] Analytics integration
- [ ] Backend API integration (Supabase/Firebase)

## License

Private project for Kigali Swim Shop
