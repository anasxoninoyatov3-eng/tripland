import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCreateTour: () => void;
  onOpenBookings: () => void;
  onOpenDashboard: () => void;
  activeView: 'home' | 'dashboard';
  setActiveView: (view: 'home' | 'dashboard') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenCreateTour,
  onOpenBookings,
  onOpenDashboard,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
}) => {
  const isGuide = user?.role === 'guide';

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button className="brand" onClick={() => setActiveView('home')} aria-label="Tripland — на главную">
          <span className="brand__mark">
            <i className="fa-solid fa-compass"></i>
          </span>
          <span className="brand__name">Tripland</span>
        </button>

        <label className="header-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Город, гид или тема экскурсии"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'home') setActiveView('home');
            }}
          />
        </label>

        <nav className="header-nav">
          {user ? (
            <>
              <button className="nav-link" onClick={onOpenBookings}>
                <i className="fa-solid fa-bookmark"></i>
                <span className="hide-sm">Бронирования</span>
              </button>

              {isGuide && (
                <>
                  <button
                    className={`nav-link ${activeView === 'dashboard' ? 'is-active' : ''}`}
                    onClick={onOpenDashboard}
                  >
                    <i className="fa-solid fa-id-card"></i>
                    <span className="hide-sm">Кабинет гида</span>
                  </button>
                  <button className="btn-primary btn-sm" onClick={onOpenCreateTour}>
                    <i className="fa-solid fa-plus"></i>
                    <span className="hide-sm">Продать тур</span>
                  </button>
                </>
              )}

              <div className="user-chip">
                <img src={user.avatar} alt={user.name} />
                <div className="user-chip__text hide-sm">
                  <div className="user-chip__name">{user.name}</div>
                  <div className="user-chip__role">{isGuide ? 'Гид' : 'Турист'}</div>
                </div>
                <button className="user-chip__logout" onClick={onLogout} title="Выйти" aria-label="Выйти">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={onOpenAuth}>Вход</button>
              <button className="btn-primary btn-sm" onClick={onOpenAuth}>Регистрация</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
