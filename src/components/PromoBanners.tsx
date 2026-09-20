import React from 'react';
import { User } from '../types';

interface PromoBannersProps {
  user: User | null;
  onOpenAuth: () => void;
  onOpenCreateTour: () => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ user, onOpenAuth, onOpenCreateTour }) => {
  const isGuide = user?.role === 'guide';

  const scrollToTours = () => {
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section promo">
      <div className="promo__card promo__card--green">
        <div>
          <h2 className="promo__title">Вы гид? Продавайте свои экскурсии</h2>
          <p className="promo__text">Опубликуйте авторский тур и принимайте бронирования от туристов</p>
          <button className="btn-primary promo__btn" onClick={isGuide ? onOpenCreateTour : onOpenAuth}>
            {isGuide ? 'Создать тур' : 'Стать гидом'}
          </button>
        </div>
        <i className="fa-solid fa-route promo__icon" aria-hidden="true"></i>
      </div>

      <div className="promo__card promo__card--sand">
        <div>
          <h2 className="promo__title">Бронируйте без предоплаты</h2>
          <p className="promo__text">Платите гиду наличными или картой после экскурсии</p>
          <button className="btn-primary promo__btn" onClick={scrollToTours}>
            Смотреть экскурсии
          </button>
        </div>
        <i className="fa-solid fa-wallet promo__icon promo__icon--sand" aria-hidden="true"></i>
      </div>
    </section>
  );
};
