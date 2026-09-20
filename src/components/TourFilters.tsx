import React from 'react';

type SortBy = 'rating' | 'price-asc' | 'price-desc';

interface TourFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  totalCount: number;
}

const CATEGORIES: { label: string; icon: string }[] = [
  { label: 'Все категории', icon: 'fa-solid fa-compass' },
  { label: 'Пешеходная', icon: 'fa-solid fa-person-walking' },
  { label: 'Автомобильная', icon: 'fa-solid fa-car' },
  { label: 'Музеи & Искусство', icon: 'fa-solid fa-building-columns' },
  { label: 'Гастрономическая', icon: 'fa-solid fa-utensils' },
  { label: 'Природа & Загород', icon: 'fa-solid fa-tree' },
  { label: 'Ночная', icon: 'fa-solid fa-moon' },
];

export const TourFilters: React.FC<TourFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  totalCount,
}) => {
  return (
    <div>
      <div className="chips">
        {CATEGORIES.map((cat) => {
          const isActive =
            (selectedCategory === '' && cat.label === 'Все категории') || selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              className={`chip ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(cat.label === 'Все категории' ? '' : cat.label)}
              aria-pressed={isActive}
            >
              <i className={cat.icon}></i>
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="filters-bar">
        <div className="filters-bar__group">
          <label className="filter">
            <span>
              Цена до <strong>{maxPrice.toLocaleString('ru-RU')} ₽</strong>
            </span>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>

          <label className="filter">
            Рейтинг
            <select className="select" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>Любой</option>
              <option value={4.5}>от 4.5</option>
              <option value={4.8}>от 4.8</option>
              <option value={4.9}>от 4.9</option>
            </select>
          </label>

          <label className="filter">
            Сортировка
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
              <option value="rating">По рейтингу</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>
        </div>

        <div className="filters-bar__count">Найдено: {totalCount}</div>
      </div>
    </div>
  );
};
