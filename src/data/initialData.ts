import { City, Tour, Review } from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'tashkent',
    name: 'Ташкент',
    country: 'Узбекистан',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'samarkand',
    name: 'Самарканд',
    country: 'Узбекистан',
    image: '/images/samarkand.png',
    popular: true
  },
  {
    id: 'bukhara',
    name: 'Бухара',
    country: 'Узбекистан',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'khiva',
    name: 'Хива',
    country: 'Узбекистан',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'dubai',
    name: 'Дубай',
    country: 'ОАЭ',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'istanbul',
    name: 'Стамбул',
    country: 'Турция',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'paris',
    name: 'Париж',
    country: 'Франция',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'moscow',
    name: 'Москва',
    country: 'Россия',
    image: '/images/moscow.png',
    popular: true
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    country: 'Россия',
    image: '/images/spb.png',
    popular: true
  },
  {
    id: 'tbilisi',
    name: 'Тбилиси',
    country: 'Грузия',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80',
    popular: true
  },
  {
    id: 'yerevan',
    name: 'Ереван',
    country: 'Армения',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
    popular: false
  },
  {
    id: 'rome',
    name: 'Рим',
    country: 'Италия',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    popular: false
  },
  {
    id: 'tokyo',
    name: 'Токио',
    country: 'Япония',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80',
    popular: false
  },
  {
    id: 'london',
    name: 'Лондон',
    country: 'Великобритания',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    popular: false
  }
];

// Демо-данных нет: туры и отзывы создаются реальными пользователями
export const INITIAL_TOURS: Tour[] = [];

export const INITIAL_REVIEWS: Review[] = [];
