import React, { useEffect, useState } from 'react';
import { Tour, Booking, User } from '../types';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
  currentUser: User | null;
  onConfirmBooking: (booking: Booking) => void;
  initialDate?: string; // YYYY-MM-DD — выбрано на карточке тура
  initialTime?: string; // HH:MM
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tour,
  currentUser,
  onConfirmBooking,
  initialDate,
  initialTime,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [touristName, setTouristName] = useState<string>(currentUser?.name || '');
  const [touristEmail, setTouristEmail] = useState<string>(currentUser?.email || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // При каждом открытии подставляем выбранный на карточке слот (или значения по умолчанию)
  useEffect(() => {
    if (!isOpen) return;
    setSelectedDate(initialDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setSelectedTime(initialTime || '10:00');
    setIsSuccess(false);
    setTouristName((prev) => prev || currentUser?.name || '');
    setTouristEmail((prev) => prev || currentUser?.email || '');
  }, [isOpen, tour?.id, initialDate, initialTime]);

  if (!isOpen || !tour) return null;

  const totalPrice = tour.pricePer === 'человека' ? tour.price * guestsCount : tour.price;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName || !touristEmail) return;

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      tourId: tour.id,
      tourTitle: tour.title,
      tourCity: tour.city,
      tourImage: tour.coverImage,
      guideId: tour.guideId,
      guideName: tour.guideName,
      touristName: touristName.trim(),
      touristEmail: touristEmail.trim(),
      date: selectedDate,
      time: selectedTime,
      guestsCount: guestsCount,
      totalPrice: totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    onConfirmBooking(newBooking);
    setIsSuccess(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback
    }
  };

  const handleCloseAll = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in" style={{ maxWidth: '520px', padding: '28px' }}>
        <button
          onClick={handleCloseAll}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748b' }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.2rem' }}></i>
        </button>

        {!isSuccess ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                Быстрое онлайн-бронирование
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '2px' }}>
                {tour.title}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Гид: <strong>{tour.guideName}</strong> ({tour.city})
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Date & Time Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    <i className="fa-regular fa-calendar-days" style={{ marginRight: '4px' }}></i> Дата экскурсии
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> Время начала
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      background: '#ffffff'
                    }}
                  >
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:30">18:30 (Вечерний)</option>
                  </select>
                </div>
              </div>

              {/* Guests Count Selector */}
              {tour.pricePer === 'человека' && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Количество участников</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Максимум до {tour.maxGroupSize} человек</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border)', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '1rem', minWidth: '20px', textAlign: 'center' }}>
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(tour.maxGroupSize, guestsCount + 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border)', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Имя туриста
                </label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={touristName}
                  onChange={(e) => setTouristName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Email для билета
                </label>
                <input
                  type="email"
                  required
                  placeholder="tourist@gmail.com"
                  value={touristEmail}
                  onChange={(e) => setTouristEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Total Summary */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Итого к оплате на месте:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                  Подтвердить запись
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i>
                Оплата гиду наличными или картой после проведения
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#e6f8f1',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '2.2rem' }}></i>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
              Экскурсия успешно забронирована! 🎉
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
              Мы отправили вам подтверждение и контакты гида <strong>{tour.guideName}</strong> на <strong>{touristEmail}</strong>.
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', textAlign: 'left', marginBottom: '24px', fontSize: '0.88rem' }}>
              <div style={{ marginBottom: '6px' }}>📍 <strong>Место встречи:</strong> {tour.meetingPoint}</div>
              <div style={{ marginBottom: '6px' }}>📅 <strong>Дата и время:</strong> {selectedDate} в {selectedTime}</div>
              <div>💰 <strong>К оплате:</strong> {totalPrice.toLocaleString('ru-RU')} ₽</div>
            </div>

            <button onClick={handleCloseAll} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Отлично, перейти к экскурсиям
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
