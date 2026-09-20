import React, { useEffect, useState } from 'react';
import { City } from '../types';

interface HeroProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Первое слово заголовка печатается и стирается по кругу: «… экскурсии от местных гидов»
const WORDS = ['Авторские', 'Необычные', 'Гастрономические', 'Ночные', 'Пешеходные'];
const TYPE_MS = 95;      // скорость печати
const ERASE_MS = 45;     // скорость стирания
const HOLD_MS = 1700;    // пауза, когда слово напечатано целиком
const GAP_MS = 350;      // пауза перед следующим словом

function useTypewriter(words: string[]) {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [text, setText] = useState(reduceMotion ? words[0] : '');

  useEffect(() => {
    if (reduceMotion) return;

    let wordIdx = 0;
    let charIdx = 0;
    let erasing = false;
    let timer: number;

    const tick = () => {
      const word = words[wordIdx];

      if (!erasing) {
        charIdx++;
        setText(word.slice(0, charIdx));
        if (charIdx === word.length) {
          erasing = true;
          timer = window.setTimeout(tick, HOLD_MS);
        } else {
          timer = window.setTimeout(tick, TYPE_MS);
        }
      } else {
        charIdx--;
        setText(word.slice(0, charIdx));
        if (charIdx === 0) {
          erasing = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = window.setTimeout(tick, GAP_MS);
        } else {
          timer = window.setTimeout(tick, ERASE_MS);
        }
      }
    };

    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, []);

  return text;
}

export const Hero: React.FC<HeroProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  searchQuery,
  setSearchQuery,
}) => {
  const typed = useTypewriter(WORDS);
  const [isOpen, setIsOpen] = useState(false);

  const q = searchQuery.trim().toLowerCase();
  const suggestions = (q
    ? cities.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    : cities.filter((c) => c.popular !== false)
  ).slice(0, 6);

  const scrollToTours = () => {
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickCity = (name: string) => {
    onSelectCity(name === selectedCity ? '' : name);
    setSearchQuery('');
    setIsOpen(false);
    scrollToTours();
  };

  return (
    <section className="hero">
      <h1 className="hero__title" aria-label="Экскурсии от местных гидов">
        <span className="hero__word-wrap" aria-hidden="true">
          {typed}
          <span className="hero__caret" />
        </span>
        <span className="hero__rest" aria-hidden="true">
          экскурсии от местных гидов
        </span>
      </h1>

      <p className="hero__subtitle">
        Прогулки, гастротуры и необычные места — с проверенными гидами в городе
      </p>

      <div className="hero__search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          className="hero__input"
          type="text"
          placeholder="Куда вы собираетесь?"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsOpen(false);
              scrollToTours();
            }
            if (e.key === 'Escape') setIsOpen(false);
          }}
        />

        {isOpen && (
          // onMouseDown не даёт полю потерять фокус до клика по городу
          <div className="suggest" onMouseDown={(e) => e.preventDefault()}>
            {suggestions.length > 0 ? (
              suggestions.map((city) => (
                <button key={city.id} className="suggest__item" onClick={() => pickCity(city.name)}>
                  <img src={city.image} alt="" />
                  <span>
                    <span className="suggest__name">{city.name}</span>
                    <br />
                    <span className="suggest__country">{city.country}</span>
                  </span>
                </button>
              ))
            ) : (
              <div className="suggest__empty">Такого города нет — поиск сработает по названиям туров и гидов</div>
            )}
          </div>
        )}
      </div>

      <div className="hero__perks">
        <span><i className="fa-solid fa-shield-halved"></i> Проверенные гиды</span>
        <span><i className="fa-solid fa-wallet"></i> Оплата гиду после экскурсии</span>
        <span><i className="fa-solid fa-rotate-left"></i> Бесплатная отмена за 24 часа</span>
      </div>
    </section>
  );
};
