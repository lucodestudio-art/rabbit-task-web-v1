import { Property, PropertyType, TransactionType, Agent, Project } from './types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'a1',
    name: 'Nguyễn Văn An',
    avatar: 'https://picsum.photos/seed/agent1/200/200',
    rating: 4.8,
    reviewCount: 124,
    phone: '0901234567',
    verified: true,
    soldCount: 45
  },
  {
    id: 'a2',
    name: 'Trần Thị Mai',
    avatar: 'https://picsum.photos/seed/agent2/200/200',
    rating: 4.9,
    reviewCount: 89,
    phone: '0909888777',
    verified: true,
    soldCount: 32
  },
  {
    id: 'a3',
    name: 'Lê Hoàng Nam',
    avatar: 'https://picsum.photos/seed/agent3/200/200',
    rating: 4.5,
    reviewCount: 56,
    phone: '0912345678',
    verified: false,
    soldCount: 12
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Penthouse View Sông Sài Gòn - The River Thủ Thiêm',
    address: 'Đại lộ Vòng Cung, Thủ Thiêm',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    price: 45.5,
    priceUnit: 'Tỷ',
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    images: [
      'https://picsum.photos/seed/p1a/800/600',
      'https://picsum.photos/seed/p1b/800/600',
      'https://picsum.photos/seed/p1c/800/600',
    ],
    type: PropertyType.APARTMENT,
    transactionType: TransactionType.SALE,
    direction: 'Đông Nam',
    legal: 'Sổ hồng lâu dài',
    description: 'Căn hộ Penthouse đẳng cấp thượng lưu, view trực diện sông Sài Gòn và Quận 1. Nội thất nhập khẩu Ý 100%. Tiện ích chuẩn 5 sao: hồ bơi vô cực, gym, spa, BBQ...',
    agent: MOCK_AGENTS[0],
    isHot: true,
    postedDate: '2024-05-15',
    coordinates: { lat: 10.77, lng: 106.70 }
  },
  {
    id: 'p2',
    title: 'Biệt thự Đảo Kim Cương - Hồ bơi riêng',
    address: 'Đường số 1, Bình Trưng Tây',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    price: 120,
    priceUnit: 'Tỷ',
    area: 600,
    bedrooms: 6,
    bathrooms: 7,
    images: [
      'https://picsum.photos/seed/p2a/800/600',
      'https://picsum.photos/seed/p2b/800/600',
    ],
    type: PropertyType.VILLA,
    transactionType: TransactionType.SALE,
    direction: 'Nam',
    legal: 'Hợp đồng mua bán',
    description: 'Biệt thự đơn lập khu Compound an ninh 24/7. Sân vườn rộng, hồ bơi riêng. Cộng đồng cư dân tinh hoa.',
    agent: MOCK_AGENTS[1],
    isHot: true,
    postedDate: '2024-05-18',
    coordinates: { lat: 10.78, lng: 106.75 }
  },
  {
    id: 'p3',
    title: 'Căn hộ Studio Vinhomes Grand Park - Full nội thất',
    address: 'Nguyễn Xiển, Long Thạnh Mỹ',
    district: 'Quận 9',
    city: 'TP. Hồ Chí Minh',
    price: 6.5,
    priceUnit: 'Triệu/tháng',
    area: 35,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      'https://picsum.photos/seed/p3a/800/600',
      'https://picsum.photos/seed/p3b/800/600',
    ],
    type: PropertyType.APARTMENT,
    transactionType: TransactionType.RENT,
    direction: 'Bắc',
    legal: 'Sổ hồng',
    description: 'Cho thuê căn hộ Studio full nội thất đẹp, chỉ xách vali vào ở. View nội khu công viên ánh sáng.',
    agent: MOCK_AGENTS[2],
    isHot: false,
    postedDate: '2024-05-20',
    coordinates: { lat: 10.83, lng: 106.82 }
  },
  {
    id: 'p4',
    title: 'Nhà phố thương mại Global City - Vị trí vàng',
    address: 'Đỗ Xuân Hợp, An Phú',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    price: 38,
    priceUnit: 'Tỷ',
    area: 120,
    bedrooms: 0,
    bathrooms: 4,
    images: [
      'https://picsum.photos/seed/p4a/800/600',
      'https://picsum.photos/seed/p4b/800/600',
    ],
    type: PropertyType.HOUSE,
    transactionType: TransactionType.SALE,
    direction: 'Tây Nam',
    legal: 'Sổ hồng',
    description: 'Shophouse mặt tiền đường chính, thuận tiện kinh doanh đa ngành nghề. Tiềm năng tăng giá cao.',
    agent: MOCK_AGENTS[0],
    isHot: true,
    postedDate: '2024-05-10',
    coordinates: { lat: 10.80, lng: 106.76 }
  },
  {
    id: 'p5',
    title: 'Đất nền dự án ven sông Đồng Nai',
    address: 'Hương Lộ 2, Long Hưng',
    district: 'Biên Hòa',
    city: 'Đồng Nai',
    price: 4.2,
    priceUnit: 'Tỷ',
    area: 100,
    bedrooms: 0,
    bathrooms: 0,
    images: [
      'https://picsum.photos/seed/p5a/800/600',
      'https://picsum.photos/seed/p5b/800/600',
    ],
    type: PropertyType.LAND,
    transactionType: TransactionType.PROJECT,
    direction: 'Đông',
    legal: 'Sổ đỏ từng nền',
    description: 'Đất nền sổ đỏ, xây dựng tự do. Hạ tầng hoàn thiện, điện âm nước máy.',
    agent: MOCK_AGENTS[1],
    isHot: false,
    postedDate: '2024-05-21',
    coordinates: { lat: 10.90, lng: 106.85 }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'pr1',
    name: 'The Global City',
    investor: 'Masterise Homes',
    status: 'Đang mở bán',
    thumbnail: 'https://picsum.photos/seed/project1/600/400',
    minPrice: 'Từ 35 Tỷ',
    location: 'An Phú, TP. Thủ Đức'
  },
  {
    id: 'pr2',
    name: 'Vinhomes Grand Park',
    investor: 'Vinhomes',
    status: 'Sắp bàn giao',
    thumbnail: 'https://picsum.photos/seed/project2/600/400',
    minPrice: 'Từ 2.5 Tỷ',
    location: 'Long Thạnh Mỹ, TP. Thủ Đức'
  },
  {
    id: 'pr3',
    name: 'Eaton Park',
    investor: 'Gamuda Land',
    status: 'Đang mở bán',
    thumbnail: 'https://picsum.photos/seed/project3/600/400',
    minPrice: 'Từ 5 Tỷ',
    location: 'Mai Chí Thọ, TP. Thủ Đức'
  }
];

export const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai'];
export const DISTRICTS = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'TP. Thủ Đức'];
