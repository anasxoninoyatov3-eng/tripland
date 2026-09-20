import React, { useState, useRef } from 'react';
import { Tour, User, CategoryType } from '../types';

interface CreateTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAddTour: (tour: Tour) => void;
}

const PRESET_IMAGES = [
  { name: 'Москва', url: '/images/moscow.png' },
  { name: 'Петербург', url: '/images/spb.png' },
  { name: 'Самарканд', url: '/images/samarkand.png' },
  { name: 'Ташкент', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Тбилиси', url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Стамбул', url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80' }
];

export const CreateTourModal: React.FC<CreateTourModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddTour,
}) => {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Москва');
  const [category, setCategory] = useState<CategoryType>('Пешеходная');
  const [price, setPrice] = useState<number>(3000);
  const [pricePer, setPricePer] = useState<'человека' | 'экскурсию'>('человека');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [maxGroupSize, setMaxGroupSize] = useState<number>(8);
  const [coverImage, setCoverImage] = useState<string>('/images/moscow.png');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [description, setDescription] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [itinerary, setItinerary] = useState<string[]>(['Встреча и знакомство', 'Прогулка по главному маршруту']);
  const [included, setIncluded] = useState<string[]>(['Услуги гида']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle direct file upload from local device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCoverImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItineraryStep = () => {
    setItinerary([...itinerary, '']);
  };

  const handleUpdateItinerary = (index: number, val: string) => {
    const updated = [...itinerary];
    updated[index] = val;
    setItinerary(updated);
  };

  const handleRemoveItinerary = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleAddIncludedItem = () => {
    setIncluded([...included, '']);
  };

  const handleUpdateIncluded = (index: number, val: string) => {
    const updated = [...included];
    updated[index] = val;
    setIncluded(updated);
  };

  const handleRemoveIncluded = (index: number) => {
    setIncluded(included.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !coverImage || !currentUser) return;

    setIsSubmitting(true);

    const newTour: Tour = {
      id: 'tour-' + Date.now(),
      title: title.trim(),
      city: city.trim(),
      category: category,
      price: price,
      pricePer: pricePer,
      durationHours: durationHours,
      maxGroupSize: maxGroupSize,
      rating: 5.0,
      reviewCount: 1,
      coverImage: coverImage.trim(),
      images: [coverImage.trim()],
      description: description.trim(),
      itinerary: itinerary.filter(s => s.trim().length > 0),
      included: included.filter(i => i.trim().length > 0),
      guideId: currentUser.id,
      guideName: currentUser.name,
      guideAvatar: currentUser.avatar,
      guideBadge: currentUser.bio || 'Проверенный гид Tripland',
      guideExperience: 'Местный эксперт',
      meetingPoint: meetingPoint.trim() || 'В центре города по договоренности',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await onAddTour(newTour);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-pop-in" style={{ maxWidth: '720px', padding: '28px' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748b' }}
        >
          <i className="fa-solid fa-xmark" style={{ fontSize: '1.2rem' }}></i>
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            Кабинет продавца-гида
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>
            Опубликовать новый тур
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Заполните описание, цену и загрузите файл фотографии с вашего устройства
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Название экскурсии / тура *
            </label>
            <input
              type="text"
              required
              placeholder="Например: Секретные дворики и легенды старого города"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          {/* City & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Город проведения (Любой город мира) *
              </label>
              <input
                type="text"
                required
                list="world-cities-list"
                placeholder="Введите или выберите город..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.92rem',
                  background: '#ffffff'
                }}
              />
              <datalist id="world-cities-list">
                {/* Города Узбекистана */}
                <option value="Ташкент" />
                <option value="Самарканд" />
                <option value="Бухара" />
                <option value="Хива" />
                <option value="Коканд" />
                <option value="Фергана" />
                <option value="Андижан" />
                <option value="Наманган" />
                <option value="Шахрисабз" />
                <option value="Термез" />
                <option value="Нукус" />
                <option value="Карши" />
                <option value="Ургенч" />
                <option value="Маргилан" />
                <option value="Гулистан" />
                <option value="Джизак" />
                <option value="Навои" />
                {/* Международные мегаполисы */}
                <option value="Дубай" />
                <option value="Абу-Даби" />
                <option value="Стамбул" />
                <option value="Анталья" />
                <option value="Париж" />
                <option value="Рим" />
                <option value="Лондон" />
                <option value="Нью-Йорк" />
                <option value="Лос-Анджелес" />
                <option value="Майами" />
                <option value="Токио" />
                <option value="Сеул" />
                <option value="Пекин" />
                <option value="Шанхай" />
                <option value="Бангкок" />
                <option value="Пхукет" />
                <option value="Бали" />
                <option value="Сингапур" />
                <option value="Москва" />
                <option value="Санкт-Петербург" />
                <option value="Казань" />
                <option value="Сочи" />
                <option value="Екатеринбург" />
                <option value="Тбилиси" />
                <option value="Батуми" />
                <option value="Ереван" />
                <option value="Алматы" />
                <option value="Астана" />
                <option value="Бишкек" />
                <option value="Баку" />
                <option value="Минск" />
                <option value="Амстердам" />
                <option value="Барселона" />
                <option value="Мадрид" />
                <option value="Прага" />
                <option value="Вена" />
                <option value="Будапешт" />
                <option value="Венеция" />
                <option value="Милан" />
                <option value="Мюнхен" />
                <option value="Берлин" />
                <option value="Афины" />
                <option value="Каир" />
                <option value="Сидней" />
                <option value="Торонто" />
                <option value="Рио-де-Жанейро" />
              </datalist>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Категория *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.92rem',
                  background: '#ffffff'
                }}
              >
                <option value="Пешеходная">Пешеходная</option>
                <option value="Автомобильная">Автомобильная</option>
                <option value="Музеи & Искусство">Музеи & Искусство</option>
                <option value="Гастрономическая">Гастрономическая</option>
                <option value="Природа & Загород">Природа & Загород</option>
                <option value="Ночная">Ночная</option>
              </select>
            </div>
          </div>

          {/* Pricing & Group Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Цена (₽) *
              </label>
              <input
                type="number"
                required
                min={500}
                step={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
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
                Тип цены
              </label>
              <select
                value={pricePer}
                onChange={(e) => setPricePer(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  background: '#ffffff'
                }}
              >
                <option value="человека">За человека</option>
                <option value="экскурсию">За весь тур</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Длительность (ч)
              </label>
              <input
                type="number"
                required
                min={1}
                max={12}
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
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
                Макс. гостей
              </label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Direct File Photo Upload Area */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Загрузить фото тура (Файл обложки) *
            </label>

            {/* File Input (Hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            {/* Upload Drop Zone / Button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--primary)',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'center',
                background: '#f0fdf4',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '10px'
              }}
            >
              {coverImage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={coverImage}
                    alt="Uploaded preview"
                    style={{ width: '90px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-circle-check"></i>
                      {imageFileName ? `Файл: ${imageFileName}` : 'Фотография выгружена'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Нажмите здесь, чтобы выбрать другое фото с устройства
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    Изменить фото
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Нажмите, чтобы выбрать файл изображения с ПК
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Поддерживаются файлы JPG, PNG, WEBP (загружаются напрямую)
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Image Selectors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Или готовые образцы:</span>
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCoverImage(img.url);
                    setImageFileName(img.name);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: coverImage === img.url ? 'var(--primary-light)' : '#f1f5f9',
                    border: coverImage === img.url ? '1px solid var(--primary)' : '1px solid transparent',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: coverImage === img.url ? 'var(--primary)' : 'var(--text-dark)'
                  }}
                >
                  <i className="fa-solid fa-image" style={{ fontSize: '0.75rem' }}></i>
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Подробное описание экскурсии *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Расскажите об атмосфере, особенностях маршрута и том, что увидят туристы..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
                resize: 'none'
              }}
            />
          </div>

          {/* Meeting Point */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Место встречи
            </label>
            <input
              type="text"
              placeholder="У памятника в центре или около станции метро"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Dynamic Itinerary Steps */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Шаги маршрута</label>
              <button
                type="button"
                onClick={handleAddItineraryStep}
                style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <i className="fa-solid fa-plus"></i> Добавить шаг
              </button>
            </div>
            {itinerary.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder={`Остановка ${idx + 1}`}
                  value={step}
                  onChange={(e) => handleUpdateItinerary(idx, e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                />
                {itinerary.length > 1 && (
                  <button type="button" onClick={() => handleRemoveItinerary(idx)} style={{ background: '#fef2f2', color: '#ef4444', padding: '8px', borderRadius: '8px' }}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic What's Included */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Что входит в стоимость</label>
              <button
                type="button"
                onClick={handleAddIncludedItem}
                style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <i className="fa-solid fa-plus"></i> Добавить пункт
              </button>
            </div>
            {included.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Например: Входные билеты, Услуги гида..."
                  value={item}
                  onChange={(e) => handleUpdateIncluded(idx, e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                />
                {included.length > 1 && (
                  <button type="button" onClick={() => handleRemoveIncluded(idx)} style={{ background: '#fef2f2', color: '#ef4444', padding: '8px', borderRadius: '8px' }}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-primary" 
            style={{ padding: '14px', fontSize: '1rem', marginTop: '10px' }}
          >
            {isSubmitting ? '🔥 Загрузка тура в Firebase...' : '🚀 Опубликовать тур в Firebase'}
          </button>
        </form>
      </div>
    </div>
  );
};
