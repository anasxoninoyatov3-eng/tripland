import React from 'react';

const REASONS: { icon: string; text: string }[] = [
  { icon: 'fa-solid fa-map-location-dot', text: 'Авторские экскурсии от местных гидов' },
  { icon: 'fa-solid fa-wallet', text: 'Бронирование без предоплаты — платите гиду после экскурсии' },
  { icon: 'fa-solid fa-rotate-left', text: 'Бесплатная отмена за 24 часа до начала' },
  { icon: 'fa-solid fa-star', text: 'Честные отзывы и рейтинг от 1 до 5 звёзд' },
  { icon: 'fa-solid fa-bolt', text: 'Мгновенное подтверждение брони' },
];

export const WhyUs: React.FC = () => (
  <section className="section why">
    <h2>Почему выбирают нас</h2>
    <div className="why__grid">
      {REASONS.map((r) => (
        <div key={r.icon} className="why__card">
          <div className="why__icon">
            <i className={r.icon} aria-hidden="true"></i>
          </div>
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  </section>
);
