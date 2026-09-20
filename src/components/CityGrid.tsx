import React, { useRef } from 'react';
import { City, Tour } from '../types';

interface CityGridProps {
  cities: City[];
  tours: Tour[];
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
}

// 1 предложение, 2–4 предложения, 5+ предложений (с учётом 11–14)
function offersLabel(count: number): string {
  if (count === 0) return 'Пока нет предложений';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} предложение`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} предложения`;
  return `${count} предложений`;
}

export const CityGrid: React.FC<CityGridProps> = ({
  cities,
  tours,
  selectedCity,
  onSelectCity,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const getCityTourCount = (cityName: string) =>
    tours.filter((t) => t.city.toLowerCase() === cityName.toLowerCase()).length;

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="section cities">
      <div className="section-head section-head--row">
        <h2>Города</h2>
        {selectedCity && (
          <button className="link-btn" onClick={() => onSelectCity('')}>
            Сбросить: {selectedCity}
          </button>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <div className="cities__scroller" ref={scrollerRef}>
          {cities.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                className={`city-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectCity(isSelected ? '' : city.name)}
                aria-pressed={isSelected}
              >
                <img src={city.image} alt="" loading="lazy" />
                <span>
                  <span className="city-item__name" style={{ display: 'block' }}>{city.name}</span>
                  <span className="city-item__count" style={{ display: 'block' }}>
                    {offersLabel(getCityTourCount(city.name))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button className="cities__next" onClick={scrollNext} aria-label="Показать другие города">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};
