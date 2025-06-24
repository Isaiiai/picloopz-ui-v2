// Mock data for the e-commerce platform

// Interfaces
export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  images: string[];
  verified: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: string;
  category: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  trending: boolean;
  materials: string;
  dimensions: string;
  processingTime: string;
  shipping: string;
  tags: string[];
  variants: ProductVariant[];
}

// Categories
export const mockCategories = [
  {
    id: 'photo-frames',
    name: 'Photo Frames',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wall-art',
    name: 'Wall Art',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'

  },
  {
    id: 'gifts',
    name: 'Personalized Gifts',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'canvas',
    name: 'Canvas Prints',
    imageUrl: 'https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mugs',
    name: 'Photo Mugs',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'magnets',
    name: 'Photo Magnets',
    imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'blankets',
    name: 'Photo Blankets',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'posters',
    name: 'Photo Posters',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wall-art',
    name: 'Wall Art',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'photo-frames',
    name: 'Photo Frames',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop'
  }
];

// Product Reviews
export const mockReviews: Record<number, Review[]> = {
  1: [ // Custom Photo Frame
    {
      id: 1,
      userName: 'Sarah Mitchell',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely love this frame! The quality is exceptional and it perfectly displays my wedding photo. The wood finish is beautiful and feels very premium.',
      images: [
        'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    },
    {
      id: 2,
      userName: 'Michael Chen',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4,
      date: '2024-01-12',
      comment: 'Great quality frame, shipped quickly. The only minor issue was the packaging could be better, but the frame itself is perfect.',
      images: [
        'https://images.unsplash.com/photo-1574705447210-76ae1ebcc442?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    },
    {
      id: 3,
      userName: 'Jessica Rodriguez',
      userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      date: '2024-01-10',
      comment: 'Ordered this for my mother\'s birthday and she absolutely loved it! The custom engraving was perfect and the frame quality exceeded expectations.',
      images: [],
      verified: true
    },
    {
      id: 4,
      userName: 'David Thompson',
      userAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      date: '2024-01-08',
      comment: 'Perfect for our family photos. The gold accent version looks elegant in our living room. Will definitely order more!',
      images: [
        'https://images.unsplash.com/photo-1622673038835-1871440f6908?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    }
  ],
  2: [ // Custom Wall Art Canvas
    {
      id: 5,
      userName: 'Emma Wilson',
      userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      rating: 5,
      date: '2024-01-14',
      comment: 'This canvas print transformed our bedroom! The colors are vibrant and the quality is amazing. Highly recommend the large size.',
      images: [
        'https://images.unsplash.com/photo-1554907984-89b1604d35d1?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551913902-c92207136625?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    },
    {
      id: 6,
      userName: 'James Parker',
      userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 4,
      date: '2024-01-11',
      comment: 'Really impressed with the print quality. The medium size was perfect for our hallway. Took about a week to arrive.',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    }
  ],
  3: [ // Personalized Photo Mug
    {
      id: 7,
      userName: 'Lisa Anderson',
      userAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
      rating: 5,
      date: '2024-01-13',
      comment: 'Love my morning coffee even more now! The photo of my dog is crystal clear and the mug feels great in hand.',
      images: [
        'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    }
  ],
  4: [ // Custom Photo Blanket
    {
      id: 8,
      userName: 'Robert Taylor',
      userAvatar: 'https://randomuser.me/api/portraits/men/28.jpg',
      rating: 5,
      date: '2024-01-09',
      comment: 'Bought this as a gift for my mom with family photos. She cried tears of joy! The sherpa is so soft and the images are beautiful.',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600&auto=format&fit=crop'
      ],
      verified: true
    }
  ]
};

// Products
export const mockProducts = [
  {
    id: 1,
    name: 'Custom Photo Frame',
    description: 'Transform your cherished memories into elegant custom frames. Perfect for displaying your favorite moments in a stylish and personalized way.',
    categoryId: 'photo-frames',
    category: 'Photo Frames',
    rating: 4.8,
    reviewCount: 124,
    soldCount: 345,
    trending: true,
    materials: 'Wood',
    dimensions: '8" x 10"',
    processingTime: '2-3 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Premium', 'Handcrafted', 'Custom Engraving'],
    variants: [
      {
        id: 1,
        name: 'Classic Wood',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 2,
        name: 'Modern Black',
        price: 34.99,
        imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 3,
        name: 'Rustic Brown',
        price: 32.99,
        imageUrl: 'https://images.unsplash.com/photo-1574705447210-76ae1ebcc442?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 4,
        name: 'Gold Accent',
        price: 39.99,
        imageUrl: 'https://images.unsplash.com/photo-1622673038835-1871440f6908?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 2,
    name: 'Custom Wall Art Canvas',
    description: 'Create stunning wall art from your photos. Our premium canvas prints transform your images into gallery-quality pieces that will brighten any room.',
    categoryId: 'wall-art',
    category: 'Wall Art',
    rating: 4.9,
    reviewCount: 89,
    soldCount: 231,
    trending: true,
    materials: 'Canvas, Wooden Frame',
    dimensions: 'Multiple sizes available',
    processingTime: '3-5 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Gallery Quality', 'UV Resistant', 'Museum Grade'],
    variants: [
      {
        id: 5,
        name: 'Small (12" x 16")',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1554907984-89b1604d35d1?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 6,
        name: 'Medium (18" x 24")',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1551913902-c92207136625?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 7,
        name: 'Large (24" x 36")',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 8,
        name: 'Extra Large (36" x 48")',
        price: 129.99,
        imageUrl: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 3,
    name: 'Personalized Photo Mug',
    description: 'Start every morning with your favorite photo on a premium ceramic mug. Makes a great gift for friends, family, or yourself!',
    categoryId: 'mugs',
    category: 'Photo Mugs',
    rating: 4.7,
    reviewCount: 156,
    soldCount: 512,
    trending: false,
    materials: 'Ceramic',
    dimensions: '11oz or 15oz',
    processingTime: '1-2 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Dishwasher Safe', 'Microwave Safe', 'Premium Ceramic'],
    variants: [
      {
        id: 9,
        name: 'White Mug (11oz)',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 10,
        name: 'White Mug (15oz)',
        price: 17.99,
        imageUrl: 'https://images.unsplash.com/photo-1520032484190-318f90a6f945?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 11,
        name: 'Black Magic Mug',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 12,
        name: 'Travel Mug',
        price: 24.99,
        imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 4,
    name: 'Custom Photo Blanket',
    description: 'Snuggle up with your favorite memories. Our custom photo blankets are soft, warm, and feature your cherished photos in stunning detail.',
    categoryId: 'gifts',
    category: 'Personalized Gifts',
    rating: 4.9,
    reviewCount: 78,
    soldCount: 165,
    trending: true,
    materials: 'Fleece, Sherpa',
    dimensions: 'Multiple sizes available',
    processingTime: '4-5 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Ultra Soft', 'Machine Washable', 'Fade Resistant'],
    variants: [
      {
        id: 13,
        name: 'Fleece (Small)',
        price: 49.99,
        imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 14,
        name: 'Fleece (Large)',
        price: 69.99,
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 15,
        name: 'Sherpa (Small)',
        price: 59.99,
        imageUrl: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 16,
        name: 'Sherpa (Large)',
        price: 79.99,
        imageUrl: 'https://images.unsplash.com/photo-1515876305430-f06edab8282a?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 5,
    name: 'Canvas Print Set',
    description: 'Create a stunning gallery wall with this set of coordinated canvas prints. Transform your space with multiple images arranged beautifully.',
    categoryId: 'canvas',
    category: 'Canvas Prints',
    rating: 4.8,
    reviewCount: 63,
    soldCount: 142,
    trending: false,
    materials: 'Canvas, Wooden Frame',
    dimensions: 'Set of 3 (8"x10" each)',
    processingTime: '3-5 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Gallery Set', 'Coordinated Design', 'Ready to Hang'],
    variants: [
      {
        id: 17,
        name: 'Triptych (3 panels)',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 18,
        name: 'Grid (4 panels)',
        price: 109.99,
        imageUrl: 'https://images.unsplash.com/photo-1585314062604-1a357de8b000?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 19,
        name: 'Gallery Wall (5 panels)',
        price: 129.99,
        imageUrl: 'https://images.unsplash.com/photo-1595834947781-82203d742a57?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 20,
        name: 'Statement Wall (7 panels)',
        price: 169.99,
        imageUrl: 'https://images.unsplash.com/photo-1596896668093-80d5a0dd9b56?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 6,
    name: 'Custom Photo Magnets',
    description: 'Turn your favorite photos into delightful magnets for your refrigerator or any magnetic surface. A fun way to display your memories!',
    categoryId: 'magnets',
    category: 'Photo Magnets',
    rating: 4.6,
    reviewCount: 94,
    soldCount: 287,
    trending: true,
    materials: 'Magnetic Sheet, Photo Paper',
    dimensions: '2"x3" or 3"x3"',
    processingTime: '1-2 business days',
    shipping: 'Free shipping on orders over $50',
    tags: ['Strong Magnets', 'Water Resistant', 'Vibrant Colors'],
    variants: [
      {
        id: 21,
        name: 'Rectangle (Set of 4)',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 22,
        name: 'Square (Set of 4)',
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1552504462-da991bcea876?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 23,
        name: 'Heart Shaped (Set of 3)',
        price: 14.99,
        imageUrl: 'https://images.unsplash.com/photo-1518449448429-87ac394165a9?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 24,
        name: 'Mixed Shapes (Set of 6)',
        price: 19.99,
        imageUrl: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=600&auto=format&fit=crop'
      }
    ]
  }
];

// Testimonials
export const mockTestimonials = [
  {
    userName: 'Sarah Johnson',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'The custom photo frame I ordered exceeded my expectations! The quality is outstanding and it arrived earlier than expected. Will definitely order again!',
    productImage: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=600&auto=format&fit=crop'
  },
  {
    userName: 'Michael Torres',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'I ordered the canvas print set for my parents\' anniversary. They absolutely loved it! The images were crisp and the colors were vibrant. Highly recommend!',
    productImage: 'https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?q=80&w=600&auto=format&fit=crop'
  },
  {
    userName: 'Emily Chen',
    userAvatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 4,
    text: 'The photo blanket makes such a perfect gift! My grandmother cried when she saw all her grandchildren on it. The fleece is so soft and the image quality is amazing.',
    productImage: null
  },
  {
    userName: 'James Wilson',
    userAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    rating: 5,
    text: 'The photo mugs I ordered for my office team were a hit! Everyone loved seeing their pets on their morning coffee cups. Great quality and fast shipping!',
    productImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop'
  }
];

// Advertisements
export const mockAdvertisements = [
  {
    title: 'Artisan Collection: Handcrafted Frames',
    description: 'Discover our premium selection of handcrafted photo frames',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&auto=format&fit=crop',
    link: '/category/photo-frames',
    cta: 'Shop Collection'
  },
  {
    title: 'New! Canvas Print Collection',
    description: 'Transform your walls with stunning high-definition prints',
    imageUrl: 'https://images.unsplash.com/photo-1605513524006-063ed6ed31e7?q=80&w=1920&auto=format&fit=crop',
    link: '/category/canvas',
    cta: 'Explore Collection'
  },
  {
    title: 'Perfect Gift for Any Occasion',
    description: 'Custom photo gifts that create lasting memories',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1920&auto=format&fit=crop',
    link: '/category/gifts',
    cta: 'Find the Perfect Gift'
  }
];