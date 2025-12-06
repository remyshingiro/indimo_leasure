// Mock product data - will be replaced with API/database later
export const products = [
  {
    id: 1,
    name: 'Professional Swimming Cap - Silicone',
    nameRw: 'Ikofiya y\'amazi - Silicone',
    slug: 'professional-swimming-cap-silicone',
    category: 'caps',
    price: 5000,
    originalPrice: 6000,
    image: '/images/cap-1.jpg',
    images: ['/images/cap-1.jpg', '/images/cap-2.jpg'],
    description: 'High-quality silicone swimming cap for professional and recreational swimmers. Comfortable fit, durable material.',
    descriptionRw: 'Ikofiya y\'amazi y\'ubwoko bwiza bw\'ubucuruzi. Ijya neza, ikomeye.',
    brand: 'Speedo',
    sizes: ['One Size'],
    colors: ['Blue', 'Black', 'Red'],
    inStock: true,
    stock: 50,
    rating: 4.5,
    reviews: 23
  },
  {
    id: 2,
    name: 'Anti-Fog Swimming Goggles',
    nameRw: 'Amadarubindi y\'amazi',
    slug: 'anti-fog-swimming-goggles',
    category: 'goggles',
    price: 12000,
    originalPrice: 15000,
    image: '/images/goggles-1.jpg',
    images: ['/images/goggles-1.jpg'],
    description: 'Premium anti-fog swimming goggles with UV protection. Comfortable seal and adjustable straps.',
    descriptionRw: 'Amadarubindi y\'amazi y\'ubwoko bwiza. Agabanya ubwoba, agakomeza.',
    brand: 'Arena',
    sizes: ['One Size'],
    colors: ['Blue', 'Black'],
    inStock: true,
    stock: 30,
    rating: 4.8,
    reviews: 45
  },
  {
    id: 3,
    name: 'Women\'s One-Piece Swimsuit',
    nameRw: 'Impuzu y\'amazi y\'abagore',
    slug: 'womens-one-piece-swimsuit',
    category: 'swimsuits',
    price: 25000,
    originalPrice: 30000,
    image: '/images/swimsuit-women-1.jpg',
    images: ['/images/swimsuit-women-1.jpg'],
    description: 'Elegant one-piece swimsuit for women. Chlorine-resistant fabric, comfortable fit.',
    descriptionRw: 'Impuzu y\'amazi nziza y\'abagore. Ntacyo ikoresha chlorine, ijya neza.',
    brand: 'TYR',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Red'],
    inStock: true,
    stock: 25,
    rating: 4.6,
    reviews: 38
  },
  {
    id: 4,
    name: 'Men\'s Swim Trunks',
    nameRw: 'Impuzu y\'amazi y\'abagabo',
    slug: 'mens-swim-trunks',
    category: 'swimsuits',
    price: 18000,
    originalPrice: 22000,
    image: '/images/swimtrunks-1.jpg',
    images: ['/images/swimtrunks-1.jpg'],
    description: 'Comfortable men\'s swim trunks with drawstring waist. Quick-dry material.',
    descriptionRw: 'Impuzu y\'amazi y\'abagabo ijya neza. Ikwirakwiza vuba.',
    brand: 'Speedo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Red'],
    inStock: true,
    stock: 40,
    rating: 4.4,
    reviews: 29
  },
  {
    id: 5,
    name: 'Kickboard - Training Equipment',
    nameRw: 'Ikibaho cy\'amazi',
    slug: 'kickboard-training',
    category: 'training',
    price: 15000,
    originalPrice: 18000,
    image: '/images/kickboard-1.jpg',
    images: ['/images/kickboard-1.jpg'],
    description: 'Durable foam kickboard for leg training. Lightweight and buoyant.',
    descriptionRw: 'Ikibaho cy\'amazi cy\'ubwoko bwiza. Cyoroshye kandi cyoroshye.',
    brand: 'Finis',
    sizes: ['Standard'],
    colors: ['Blue', 'Red'],
    inStock: true,
    stock: 20,
    rating: 4.7,
    reviews: 15
  },
  {
    id: 6,
    name: 'Pull Buoy - Swimming Aid',
    nameRw: 'Ikibaho cy\'amazi',
    slug: 'pull-buoy-swimming-aid',
    category: 'training',
    price: 10000,
    originalPrice: 12000,
    image: '/images/pullbuoy-1.jpg',
    images: ['/images/pullbuoy-1.jpg'],
    description: 'Foam pull buoy for upper body training. Helps improve arm technique.',
    descriptionRw: 'Ikibaho cy\'amazi cy\'ubwoko bwiza. Gufasha gukomeza amaboko.',
    brand: 'Finis',
    sizes: ['Standard'],
    colors: ['Blue', 'Yellow'],
    inStock: true,
    stock: 18,
    rating: 4.5,
    reviews: 12
  },
  {
    id: 7,
    name: 'Swimming Fins - Training Fins',
    nameRw: 'Amaguru y\'amazi',
    slug: 'swimming-fins-training',
    category: 'training',
    price: 35000,
    originalPrice: 40000,
    image: '/images/fins-1.jpg',
    images: ['/images/fins-1.jpg'],
    description: 'Professional training fins for improved leg strength and technique.',
    descriptionRw: 'Amaguru y\'amazi y\'ubwoko bwiza. Gufasha gukomeza amaguru.',
    brand: 'Arena',
    sizes: ['S', 'M', 'L'],
    colors: ['Blue', 'Black'],
    inStock: true,
    stock: 15,
    rating: 4.6,
    reviews: 20
  },
  {
    id: 8,
    name: 'Swimming Towel - Quick Dry',
    nameRw: 'Ikariso y\'amazi',
    slug: 'swimming-towel-quick-dry',
    category: 'accessories',
    price: 8000,
    originalPrice: 10000,
    image: '/images/towel-1.jpg',
    images: ['/images/towel-1.jpg'],
    description: 'Large quick-dry microfiber towel. Lightweight and compact.',
    descriptionRw: 'Ikariso y\'amazi nini. Cyoroshye kandi cyoroshye.',
    brand: 'Speedo',
    sizes: ['One Size'],
    colors: ['Blue', 'Black', 'Red'],
    inStock: true,
    stock: 35,
    rating: 4.3,
    reviews: 18
  }
]

export const categories = [
  { id: 'caps', name: 'Swimming Caps', nameRw: 'Amakofiya y\'amazi', icon: '🏊' },
  { id: 'goggles', name: 'Goggles', nameRw: 'Amadarubindi', icon: '🥽' },
  { id: 'swimsuits', name: 'Swimsuits', nameRw: 'Impuzu z\'amazi', icon: '👙' },
  { id: 'training', name: 'Training Equipment', nameRw: 'Ibikoresho by\'amazi', icon: '🏋️' },
  { id: 'accessories', name: 'Accessories', nameRw: 'Ibindi bikoresho', icon: '🎒' }
]

export const getProductBySlug = (slug) => {
  return products.find(p => p.slug === slug)
}

export const getProductsByCategory = (category) => {
  if (!category) return products
  return products.filter(p => p.category === category)
}

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameRw.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery)
  )
}



