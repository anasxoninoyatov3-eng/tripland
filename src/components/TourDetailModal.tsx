import React, { useState } from 'react';
import { Tour, Review, User } from '../types';

interface TourDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
  reviews: Review[];
  currentUser: User | null;
  onOpenBooking: (tour: Tour) => void;
  onOpenAddReview: (tour: Tour) => void;
}

export const TourDetailModal: React.FC<TourDetailModalProps> = ({
  isOpen,
  onClose,
  tour,
  reviews,
  currentUser,
  onOpenBooking,
  onOpenAddReview,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');

  if (!isOpen || !tour) return null;

  const tourReviews = reviews.filter(r => r.tourId === tour.id);
  const activeImage = selectedImage || tour.coverImage;

  // Calculate rating counts for breakdown bar
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  tourReviews.forEach(r => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  return (
    <div className="modal-overlay" style={{ padding: '20px 10px' }}>
      <div className="modal-content animate-pop-in" style={{ maxWidth: '920px' }}>
        {/* Sticky Close Header */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.1rem' }}></i>
        </button>

        {/* Gallery Image Display */}
        <div style={{ position: 'relative', height: '360px', background: '#0f172a' }}>
          <img
            src={activeImage}
            alt={tour.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            display: 'flex',
            gap: '8px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            padding: '6px',
            borderRadius: '12px'
          }}>
            {tour.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                style={{
                  width: '54px',
                  height: '40px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: activeImage === img ? '2px solid #00b976' : '2px solid transparent',
                  opacity: activeImage === img ? 1 : 0.7
                }}
              />
            ))}
          </div>

          <div style={{ position: 'absolute', top: '16px', left: '20px', display: 'flex', gap: '8px' }}>
            <span className="badge-city" style={{ fontSize: '0.85rem' }}><i className="fa-solid fa-location-dot" style={{ color: '#00e08f', marginRight: '4px' }}></i> {tour.city}</span>
            <span className="badge-category" style={{ fontSize: '0.85rem' }}>{tour.category}</span>
          </div>
        </div>

        {/* Main Content Layout (Left Details, Right Sticky Booking Card) */}
        <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          {/* Left Column */}
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
              {tour.title}
            </h1>

            {/* Meta bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <span className="badge-rating" style={{ fontSize: '0.92rem' }}>
                <i className="fa-solid fa-star" style={{ color: '#d97706' }}></i>
                {tour.rating.toFixed(2)} ({tour.reviewCount} {tour.reviewCount === 1 ? 'отзыв' : 'отзывов'})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-clock" style={{ color: 'var(--primary)' }}></i> {tour.durationHours} часа
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-user-group" style={{ color: 'var(--primary)' }}></i> Группа до {tour.maxGroupSize} чел.
              </span>
            </div>

            {/* Guide Card Widget */}
            <div style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '28px'
            }}>
              <img
                src={tour.guideAvatar}
                alt={tour.guideName}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00b976' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{tour.guideName}</h3>
                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>{tour.guideBadge}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tour.guideExperience}</div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>Об экскурсии</h2>
              <p style={{ color: '#334155', fontSize: '0.96rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {tour.description}
              </p>
            </div>

            {/* Itinerary Timeline */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>Программа маршрута</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tour.itinerary.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--text-dark)', paddingTop: '2px' }}>
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Features */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Что включено</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tour.included.map((inc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#1e293b' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary)' }}></i>
                    {inc}
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Point */}
            <div style={{ marginBottom: '32px', background: '#e6f8f1', padding: '14px 18px', borderRadius: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857', marginBottom: '2px' }}>
                📍 Место встречи:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#064e3b' }}>
                {tour.meetingPoint}
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Отзывы путешественников</h2>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Оценка {tour.rating.toFixed(2)} на основе {tour.reviewCount} отзывов
                  </div>
                </div>

                <button
                  onClick={() => onOpenAddReview(tour)}
                  className="btn-outline"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                >
                  <i className="fa-solid fa-comment-dots"></i>
                  Оставить отзыв
                </button>
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tourReviews.length > 0 ? (
                  tourReviews.map((rev) => (
                    <div key={rev.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={rev.userAvatar} alt={rev.userName} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{rev.userName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{rev.date}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={i < rev.rating ? "fa-solid fa-star" : "fa-regular fa-star"}
                              style={{ color: i < rev.rating ? '#d97706' : '#cbd5e1', fontSize: '0.85rem' }}
                            ></i>
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Пока отзывов нет. Будьте первым, кто оставит впечатление после экскурсии!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Box */}
          <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Стоимость:</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>
                  {tour.price.toLocaleString('ru-RU')} ₽
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                  за {tour.pricePer}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                ✔️ Бесплатная отмена за 24 часа<br />
                ✔️ Мгновенное подтверждение
              </div>

              <button
                onClick={() => onOpenBooking(tour)}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginBottom: '12px' }}
              >
                <i className="fa-solid fa-calendar-days"></i>
                Забронировать
              </button>

              <button
                onClick={() => onOpenAddReview(tour)}
                className="btn-outline"
                style={{ width: '100%', padding: '10px', fontSize: '0.88rem', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-star" style={{ color: '#fbbf24' }}></i> Оценить экскурсию
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
