import React, { useState } from 'react';
import { Tour, User } from '../types';

export interface BookingSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

interface TourCardProps {
  tour: Tour;
  currentUser: User | null;
  onSelect: (tour: Tour) => void;
  onBook: (tour: Tour, slot?: BookingSlot) => void;
  onDelete?: (tourId: string) => void;
}

const FAV_KEY = 'tripland_favorites';
// Те же времена начала, что и в окне бронирования
const SLOT_TIMES = ['10:00', '14:00'];

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  } catch {
    return [];
  }
}

// Локальная дата в формате YYYY-MM-DD (без сдвига по UTC)
function localDateISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// 1 отзыв, 2–4 отзыва, 5+ отзывов (с учётом 11–14)
function reviewsLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} отзыв`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} отзыва`;
  return `${count} отзывов`;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  currentUser,
  onSelect,
  onBook,
  onDelete,
}) => {
  const [isFav, setIsFav] = useState(() => readFavorites().includes(tour.id));
  const isGuideOwner =
    !!currentUser && currentUser.role === 'guide' && currentUser.id === tour.guideId;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = localDateISO(tomorrow);

  const toggleFavorite = () => {
    const favs = readFavorites();
    const next = isFav ? favs.filter((id) => id !== tour.id) : [...favs, tour.id];
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {
      // хранилище недоступно — избранное живёт только до перезагрузки
    }
    setIsFav(!isFav);
  };

  const typeLine = [
    tour.category,
    `до ${tour.maxGroupSize} чел.`,
    `${tour.durationHours} ч.`,
  ].join(' · ');

  return (
    <article className="tour-card">
      <div className="tour-card__media">
        <button className="tour-card__open" onClick={() => onSelect(tour)} aria-label={tour.title}>
          <img src={tour.coverImage} alt="" loading="lazy" />
        </button>

        <button
          className={`tour-card__fav ${isFav ? 'is-fav' : ''}`}
          onClick={toggleFavorite}
          aria-pressed={isFav}
          aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <i className={isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>

        <span className="tour-card__place">
          <i className="fa-solid fa-location-dot"></i>
          {tour.city}
        </span>
      </div>

      <div className="tour-card__rating">
        {tour.reviewCount > 0 ? (
          <>
            <i className="fa-solid fa-star"></i>
            <strong>{Number(tour.rating.toFixed(1))}</strong>
            <span>· {reviewsLabel(tour.reviewCount)}</span>
          </>
        ) : (
          <span>Новое предложение</span>
        )}
      </div>

      <h3 className="tour-card__title">
        <button className="tour-card__link" onClick={() => onSelect(tour)}>
          {tour.title}
        </button>
      </h3>

      <div className="tour-card__type">{typeLine}</div>

      <div className="tour-card__guide">
        <img src={tour.guideAvatar} alt="" />
        <span>{tour.guideName}</span>
      </div>

      <div className="tour-card__slots">
        {SLOT_TIMES.map((time) => (
          <button
            key={time}
            className="slot"
            onClick={() => onBook(tour, { date: tomorrowISO, time })}
          >
            Завтра в {time}
          </button>
        ))}
        <button
          className="slot-calendar"
          onClick={() => onBook(tour)}
          aria-label="Выбрать другую дату и время"
          title="Выбрать другую дату"
        >
          <i className="fa-regular fa-calendar-days"></i>
        </button>
      </div>

      <div className="tour-card__foot">
        <div className="tour-card__price">
          <strong>
            {tour.pricePer === 'человека' ? 'от ' : ''}
            {tour.price.toLocaleString('ru-RU')} ₽
          </strong>
          <span>за {tour.pricePer}</span>
        </div>

        {isGuideOwner && onDelete && (
          <button
            className="icon-btn-danger"
            onClick={() => onDelete(tour.id)}
            title="Удалить тур"
            aria-label="Удалить тур"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        )}
      </div>
    </article>
  );
};
