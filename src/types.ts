export type UserRole = 'tourist' | 'guide';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isVerifiedGuide?: boolean;
  bio?: string;
  phone?: string;
}

export interface Review {
  id: string;
  tourId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 - 5
  date: string;
  comment: string;
}

export type CategoryType = 
  | 'Пешеходная'
  | 'Автомобильная'
  | 'Музеи & Искусство'
  | 'Гастрономическая'
  | 'Природа & Загород'
  | 'Ночная';

export interface Tour {
  id: string;
  title: string;
  city: string;
  category: CategoryType;
  price: number; // In RUB
  pricePer: 'человека' | 'экскурсию';
  durationHours: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images: string[];
  description: string;
  itinerary: string[];
  included: string[];
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideBadge: string;
  guideExperience: string;
  meetingPoint: string;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  image: string;
  tourCount?: number;
  popular?: boolean;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourCity: string;
  tourImage: string;
  guideId: string;
  guideName: string;
  touristName: string;
  touristEmail: string;
  date: string;
  time: string;
  guestsCount: number;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}
