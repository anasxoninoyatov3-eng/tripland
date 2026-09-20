import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '60px 20px 30px 20px',
      borderTop: '1px solid #1e293b',
      marginTop: '60px'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#00b976',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fa-solid fa-compass" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>Tripland</span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#64748b' }}>
              Онлайн-платформа для бронирования экскурсий и авторских туров от местных гидов.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Популярные направления</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>Экскурсии в Москве</li>
              <li>Экскурсии в Санкт-Петербурге</li>
              <li>Туры по Самарканду</li>
              <li>Гастрономический Ташкент</li>
              <li>Прогулки по Тбилиси</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Гидам и Экспертам</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>Как начать продавать туры</li>
              <li>Правила публикации объявлений</li>
              <li>Комиссии и выводы средств</li>
              <li>Личный кабинет продавца</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Поддержка и безопасность</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#00b976' }}></i> Авторизация через Google
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-award" style={{ color: '#fbbf24' }}></i> Рейтинг и отзывы 1-5 звезд
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>© {new Date().getFullYear()} Tripland. Все права защищены.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Сделано с <i className="fa-solid fa-heart" style={{ color: '#ef4444', margin: '0 4px' }}></i> для путешественников и гидов
          </div>
        </div>
      </div>
    </footer>
  );
};
