import React from 'react';
import { Tour, Booking, User } from '../types';

interface GuideDashboardProps {
  user: User;
  tours: Tour[];
  bookings: Booking[];
  onOpenCreateTour: () => void;
  onDeleteTour: (tourId: string) => void;
  onSelectTour: (tour: Tour) => void;
}

export const GuideDashboard: React.FC<GuideDashboardProps> = ({
  user,
  tours,
  bookings,
  onOpenCreateTour,
  onDeleteTour,
  onSelectTour,
}) => {
  const guideTours = tours.filter(t => t.guideId === user.id);
  const guideBookings = bookings.filter(b => b.guideId === user.id);

  const totalRevenue = guideBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const avgRating = guideTours.length > 0
    ? (guideTours.reduce((sum, t) => sum + t.rating, 0) / guideTours.length).toFixed(2)
    : '5.0';

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Dashboard Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #042f2e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00e08f' }}
          />
          <div>
            <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#00e08f', fontWeight: 700, letterSpacing: '0.5px' }}>
              Кабинет гида • Продажи
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              Здравствуйте, {user.name}!
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              Управляйте вашими авторскими турами, отслеживайте бронирования и заработок
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateTour}
          className="btn-primary"
          style={{ padding: '14px 24px', fontSize: '0.95rem' }}
        >
          <i className="fa-solid fa-circle-plus"></i>
          Создать и продать тур
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Заработано</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            {totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Общая сумма подтвержденных броней</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Заказов от туристов</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '4px' }}>
            {guideBookings.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Активные записи на экскурсии</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Активных туров</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '4px' }}>
            {guideTours.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Опубликовано на платформе</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Средний рейтинг</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-star" style={{ color: '#d97706', fontSize: '1.5rem' }}></i> {avgRating}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>Оценка от гостей</div>
        </div>
      </div>

      {/* Section 1: My Listed Tours */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '18px' }}>
          Мои опубликованные туры ({guideTours.length})
        </h2>

        {guideTours.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {guideTours.map((tour) => (
              <div key={tour.id} style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={tour.coverImage} alt={tour.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge-city" style={{ fontSize: '0.75rem', marginBottom: '8px', display: 'inline-block' }}>{tour.city}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>{tour.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px' }}>
                      {tour.price.toLocaleString('ru-RU')} ₽ / {tour.pricePer}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <button
                      onClick={() => onSelectTour(tour)}
                      className="btn-outline"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      Просмотр
                    </button>
                    <button
                      onClick={() => onDeleteTour(tour.id)}
                      style={{ background: '#fef2f2', color: '#ef4444', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      <i className="fa-solid fa-trash-can" style={{ marginRight: '4px' }}></i> Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '32px', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>У вас пока нет активных объявлений туров.</p>
            <button onClick={onOpenCreateTour} className="btn-primary">
              <i className="fa-solid fa-circle-plus"></i> Опубликовать первый тур
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Recent Tourist Bookings */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '18px' }}>
          Заказы от туристов ({guideBookings.length})
        </h2>

        {guideBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {guideBookings.map((b) => (
              <div key={b.id} style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={b.tourImage} alt="tour" style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{b.tourTitle}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      👤 Турист: <strong>{b.touristName}</strong> ({b.touristEmail}) • 👥 {b.guestsCount} чел.
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    📅 {b.date} в {b.time}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                    + {b.totalPrice.toLocaleString('ru-RU')} ₽
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#e6f8f1', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    Подтверждено
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '24px', borderRadius: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Бронирований от туристов пока нет. Как только туристы забронируют ваш тур, заказ появится здесь!
          </div>
        )}
      </div>
    </div>
  );
};
