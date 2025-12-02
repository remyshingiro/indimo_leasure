## Kigali Swim Shop – Implementation Plan

### 1. Architecture Snapshot
- **Framework**: React.js 18 with Vite (pure JavaScript, no TypeScript).
- **Styling**: Tailwind CSS with design tokens for Kigali palette (deep blue, aqua, orange, off-white).
- **Routing**: React Router for client-side navigation.
- **State**: Zustand for client cart, React Query for data hydration.
- **Data**: Plan for Supabase (auth, products, orders). For MVP, mock JSON + local persistence.
- **Payments**: Start with manual MTN MoMo/Airtel/COD instructions, abstract gateway service to swap with Flutterwave/PayPack later.
- **PWA**: Custom manifest, service worker for offline cache of catalog shell.

### 2. Feature Roadmap
1. **Phase 1 (MVP, 2-3 weeks)**
   - Landing/Home, Catalog listing, Product detail.
   - Cart + checkout wizard, delivery zones, manual payments.
   - Basic admin: product CRUD (local data), order list with status.
   - Content pages (About, Contact, Return policy EN/Kinyarwanda).
2. **Phase 2**
   - Real payment gateway, order tracking, notifications (SMS/WhatsApp/Email).
   - Customer accounts, order history, improved admin KPIs.
3. **Phase 3**
   - Reviews, wishlist, blog, loyalty, analytics, marketplace support.

### 3. Page Inventory
- `/` Hero, featured categories, best sellers, testimonials, WhatsApp CTA, trust badges.
- `/products` Catalog with filters (price slider, size, brand, gender, age).
- `/products/[slug]` Gallery, specs, dual-language tabs, size chart modal, delivery/payment info, related items.
- `/cart` + `/checkout` Multi-step (customer info, delivery zone, payment method, confirmation).
- `/about`, `/contact`, `/faq`, `/policies/returns` (EN + RW), `/policies/privacy`, `/terms`.
- `/admin` dashboard with nested routes: `products`, `orders`, `inventory`, `customers`, `analytics`.

### 4. Payment UX Flow
1. User selects method (MoMo MTN defaults) → show merchant code, amount, USSD instructions, SMS template.
2. Input transaction ID → validation placeholder, status pending review.
3. Airtel Money and Bank Transfer share same pattern; COD toggles “pay on delivery”.
4. Service interface `PaymentStrategy` for future Flutterwave.

### 5. Localization & Trust
- Language toggle (EN/RW) via React Context or custom hook.
- Currency formatter for RWF, price badges on cards.
- Size guides, testimonials, WhatsApp floating button, Google Map embed, physical location block.
- Return/exchange policy mirrored in both languages.

### 6. Delivery Logic
- Config-driven zones: {Gasabo, Kicukiro, Nyarugenge, National}. Each with fee + ETA.
- Checkout shows dynamic fee and estimated time.
- Order model: `status`, `paymentStatus`, `deliveryProgress`.

### 7. Tech Tasks Backlog
- [ ] Configure Tailwind theme + typography + icon set.
- [ ] Build layout shell (mobile nav, sticky cart button, footer with payments).
- [ ] Implement CMS-like data layer (JSON + hooks) with placeholder Supabase service.
- [ ] Cart store (Zustand) with localStorage persistence.
- [ ] Components: hero, category cards, product card, filter drawer, testimonials, payment info block, WhatsApp button.
- [ ] Checkout forms with validation (React Hook Form).
- [ ] Payment instruction modal + transaction ID capture.
- [ ] Delivery zone selector and fee calculation util.
- [ ] Static content pages (markdown or MDX).
- [ ] Admin dashboard skeleton with charts (Recharts) and tables.
- [ ] PWA configuration + manifest + service worker.
- [ ] SEO (metadata, OpenGraph, product schema), analytics hooks.

### 8. Testing & Deployment
- Unit tests for utils (Vitest).
- Playwright smoke tests for checkout.
- Lighthouse budget (<=90 mobile) enforced via CI.
- Deploy to Vercel, environment vars for Supabase/Flutterwave placeholders.

