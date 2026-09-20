import React, { useState } from 'react';
import { Tour, Review, User } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
  currentUser: User | null;
  onSubmitReview: (review: Review) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Ужасно 😞',
  2: 'Плохо 🙁',
  3: 'Нормально 😐',
  4: 'Хорошо 🙂',
  5: 'Восхитительно! ⭐⭐⭐⭐⭐'
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  tour,
  currentUser,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [guestName, setGuestName] = useState<string>(currentUser?.name || '');

  if (!isOpen || !tour) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      tourId: tour.id,
      userName: guestName.trim() || currentUser?.name || 'Гость Tripland',
      userAvatar: currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(guestName || 'Guest')}`,
      rating: rating,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: comment.trim()
    };

    onSubmitReview(newReview);
    setComment('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in" style={{ maxWidth: '500px', padding: '28px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748b' }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.2rem' }}></i>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fffbeb',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto'
          }}>
            <i className="fa-solid fa-comment-dots" style={{ fontSize: '1.5rem' }}></i>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Оставить отзыв и оценку</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            «{tour.title}»
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Interactive Star Selector */}
          <div style={{ textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--text-dark)' }}>
              Ваша оценка гиду и экскурсии:
            </label>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const activeStar = hoverRating || rating;
                const isFilled = star <= activeStar;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: 'none', padding: '4px', cursor: 'pointer', transition: 'transform 0.1s ease' }}
                  >
                    <i 
                      className={isFilled ? "fa-solid fa-star" : "fa-regular fa-star"} 
                      style={{ fontSize: '1.8rem', color: isFilled ? '#fbbf24' : '#cbd5e1' }}
                    ></i>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
              {RATING_LABELS[hoverRating || rating]}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Ваше имя
            </label>
            <input
              type="text"
              required
              placeholder="Как к вам обращаться?"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Ваш отзыв о проведенной экскурсии
            </label>
            <textarea
              required
              rows={4}
              placeholder="Расскажите, что вам больше всего понравилось? Оценка работы гида, маршрута и впечатлений..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.92rem',
                resize: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '0.95rem' }}>
            Опубликовать отзыв
          </button>
        </form>
      </div>
    </div>
  );
};
