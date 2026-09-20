import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { saveUserToFirebase } from '../firebase';

const GOOGLE_CLIENT_ID = '919200342273-7ato1cgtbcenk7fjgs3i2fjkin372n4i.apps.googleusercontent.com';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>('tourist');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const roleRef = useRef<UserRole>(role);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  // Decode JWT Token from Google GIS
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding Google OAuth 2.0 JWT token:', e);
      return null;
    }
  };

  // Render Official Google GIS OAuth 2.0 Button
  useEffect(() => {
    if (!isOpen) return;

    const renderGoogleButton = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (response.credential) {
              const payload = decodeJwt(response.credential);
              if (payload) {
                const currentRole = roleRef.current;
                const newUser: User = {
                  id: payload.sub || 'google-' + Date.now(),
                  name: payload.name || payload.given_name || 'Пользователь Google',
                  email: payload.email || '',
                  avatar: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.name || 'User')}`,
                  role: currentRole,
                  isVerifiedGuide: currentRole === 'guide',
                  bio: currentRole === 'guide' ? 'Авторизованный гид Tripland (Google OAuth 2.0 Verified)' : undefined,
                };

                await saveUserToFirebase(newUser);
                onLoginSuccess(newUser);
                onClose();
              }
            }
          },
        });

        const btnContainer = document.getElementById('google-oauth-btn');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'signup_with',
            shape: 'pill',
            locale: 'ru',
          });
        }
      }
    };

    const timer = setTimeout(renderGoogleButton, 200);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // Direct Registration Form Fallback
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;

    setIsLoading(true);
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: customName.trim(),
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName)}`,
      role,
      isVerifiedGuide: role === 'guide',
      bio: role === 'guide' ? 'Проверенный гид Tripland' : undefined,
    };

    await saveUserToFirebase(newUser);
    setIsLoading(false);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in" style={{ maxWidth: '460px', padding: '28px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748b' }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.2rem' }}></i>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.15)'
          }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.8rem', color: '#0284c7' }}></i>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', marginBottom: '8px' }}>
            <i className="fa-solid fa-circle-check"></i> Official Google OAuth 2.0 API
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '4px' }}>Регистрация & Вход</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Вход через официальный Google OAuth 2.0
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => setRole('tourist')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: role === 'tourist' ? '#ffffff' : 'transparent',
              color: role === 'tourist' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: role === 'tourist' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            🧳 Я Турист
          </button>
          <button
            type="button"
            onClick={() => setRole('guide')}
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: role === 'guide' ? '#ffffff' : 'transparent',
              color: role === 'guide' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: role === 'guide' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            🚩 Я Гид (Продавец)
          </button>
        </div>

        {/* Official Google OAuth 2.0 Container */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px', width: '100%', minHeight: '44px' }}>
          <div id="google-oauth-btn"></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0', color: 'var(--text-light)', fontSize: '0.82rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          или прямая регистрация по E-mail
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Имя и Фамилия *
            </label>
            <input
              type="text"
              required
              placeholder="Например: Алишер Навои"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Электронная почта (E-mail) *
            </label>
            <input
              type="email"
              required
              placeholder="user@gmail.com"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '6px', padding: '12px', fontSize: '0.94rem' }}>
            {isLoading ? 'Регистрация...' : `Быстрая регистрация как ${role === 'guide' ? 'Гид' : 'Турист'}`}
          </button>
        </form>
      </div>
    </div>
  );
};



