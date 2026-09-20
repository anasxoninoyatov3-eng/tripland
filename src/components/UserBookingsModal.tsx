import React from 'react';
import { Booking, Tour } from '../types';

interface UserBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  tours: Tour[];
  onOpenAddReview: (tour: Tour) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  tours,
  onOpenAddReview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in" style={{ maxWidth: '680px', padding: '28px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748b' }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.2rem' }}></i>
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Мои забронированные экскурсии</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Список всех ваших актуальных поездок и встреч с гидами
          </p>
        </div>

        {bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((booking) => {
              const matchedTour = tours.find(t => t.id === booking.tourId);

              return (
                <div
                  key={booking.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr auto',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={booking.tourImage}
                    alt={booking.tourTitle}
                    style={{ width: '90px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  <div>
                    <span className="badge-city" style={{ fontSize: '0.72rem', padding: '2px 8px', marginBottom: '4px', display: 'inline-block' }}>
                      {booking.tourCity}
                    </span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, lineHeight: 1.3 }}>
                      {booking.tourTitle}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Гид: <strong>{booking.guideName}</strong> • {booking.guestsCount} чел.
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                      📅 {booking.date} в {booking.time}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      {booking.totalPrice.toLocaleString('ru-RU')} ₽
                    </div>

                    {matchedTour && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAddReview(matchedTour);
                        }}
                        className="btn-outline"
                        style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                      >
                        <i className="fa-solid fa-comment-dots"></i> Отзыв
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            У вас пока нет забронированных туров. Выберите город и забронируйте первую экскурсию!
          </div>
        )}
      </div>
    </div>
  );
};
