import React, { useState, useEffect, useMemo } from 'react';
import { User, Tour, City, Review, Booking } from './types';
import { INITIAL_CITIES, INITIAL_TOURS, INITIAL_REVIEWS } from './data/initialData';
import { 
  fetchToursFromFirebase, 
  saveTourToFirebase, 
  deleteTourFromFirebase, 
  fetchReviewsFromFirebase, 
  saveReviewToFirebase, 
  deleteReviewFromFirebase, 
  fetchBookingsFromFirebase, 
  saveBookingToFirebase, 
  saveUserToFirebase 
} from './firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CityGrid } from './components/CityGrid';
import { TourFilters } from './components/TourFilters';
import { TourCard } from './components/TourCard';
import { TourDetailModal } from './components/TourDetailModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CreateTourModal } from './components/CreateTourModal';
import { BookingModal } from './components/BookingModal';
import { ReviewModal } from './components/ReviewModal';
import { GuideDashboard } from './components/GuideDashboard';
import { UserBookingsModal } from './components/UserBookingsModal';
import { Footer } from './components/Footer';
import { PromoBanners } from './components/PromoBanners';
import { WhyUs } from './components/WhyUs';
import type { BookingSlot } from './components/TourCard';

// ID старых демо-данных (из прежнего initialData.ts) — удаляются везде при загрузке
const isDemoTour = (id: string) => /^tour-[1-6]$/.test(id);
const isDemoReview = (id: string) => /^rev-[1-4]$/.test(id);

export const App: React.FC = () => {
  // State Initialization with LocalStorage fallback
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tripland_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('tripland_tours');
    const parsed: Tour[] = saved ? JSON.parse(saved) : INITIAL_TOURS;
    return parsed.filter(t => !isDemoTour(t.id));
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('tripland_reviews');
    const parsed: Review[] = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    return parsed.filter(r => !isDemoReview(r.id));
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tripland_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoadingFirebase, setIsLoadingFirebase] = useState(true);

  // UI View States
  const [activeView, setActiveView] = useState<'home' | 'dashboard'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateTourOpen, setIsCreateTourOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [selectedTourForDetail, setSelectedTourForDetail] = useState<Tour | null>(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<Tour | null>(null);
  const [bookingSlot, setBookingSlot] = useState<BookingSlot | null>(null);
  const [selectedTourForReview, setSelectedTourForReview] = useState<Tour | null>(null);

  // Load live data from Firebase Firestore on Mount
  useEffect(() => {
    async function loadDataFromFirebase() {
      setIsLoadingFirebase(true);
      try {
        // 1. Туры из Firebase (демо-туры удаляются из базы и не показываются)
        const fbTours = await fetchToursFromFirebase();
        const demoTours = fbTours.filter(t => isDemoTour(t.id));
        for (const t of demoTours) {
          await deleteTourFromFirebase(t.id);
        }
        setTours(fbTours.filter(t => !isDemoTour(t.id)));

        // 2. Отзывы из Firebase (демо-отзывы тоже удаляются)
        const fbReviews = await fetchReviewsFromFirebase();
        const demoReviews = fbReviews.filter(r => isDemoReview(r.id));
        for (const r of demoReviews) {
          await deleteReviewFromFirebase(r.id);
        }
        setReviews(fbReviews.filter(r => !isDemoReview(r.id)));

        // 3. Fetch bookings from Firebase
        const fbBookings = await fetchBookingsFromFirebase();
        if (fbBookings && fbBookings.length > 0) {
          setBookings(fbBookings);
        }
      } catch (err) {
        console.warn('Firebase sync notice:', err);
      } finally {
        setIsLoadingFirebase(false);
      }
    }

    loadDataFromFirebase();
  }, []);

  // Sync state changes to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('tripland_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripland_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tripland_tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('tripland_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('tripland_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handle Google Login Success
  const handleLoginSuccess = async (loggedUser: User) => {
    setUser(loggedUser);
    await saveUserToFirebase(loggedUser);
    if (loggedUser.role === 'guide') {
      setActiveView('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setActiveView('home');
  };

  // Add New Tour (for Guides) -> Uploads guide tour to Firebase Firestore
  const handleAddTour = async (newTour: Tour) => {
    setTours(prev => [newTour, ...prev]);
    setActiveView('dashboard');
    await saveTourToFirebase(newTour);
  };

  // Delete Tour (for Guides) -> Deletes tour from Firebase Firestore
  const handleDeleteTour = async (tourId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тур из Firebase?')) {
      setTours(prev => prev.filter(t => t.id !== tourId));
      await deleteTourFromFirebase(tourId);
    }
  };

  // Confirm Booking -> Uploads booking to Firebase
  const handleConfirmBooking = async (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    await saveBookingToFirebase(newBooking);
  };

  // Submit Review -> Uploads review to Firebase
  const handleSubmitReview = async (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
    await saveReviewToFirebase(newReview);

    // Recalculate average rating & review count for the tour and sync to Firebase
    setTours(prev => prev.map(t => {
      if (t.id === newReview.tourId) {
        const tourRevs = reviews.filter(r => r.tourId === t.id);
        const newCount = t.reviewCount + 1;
        const totalRatingSum = tourRevs.reduce((sum, r) => sum + r.rating, 0) + newReview.rating;
        const newAvg = Number((totalRatingSum / newCount).toFixed(2));

        const updatedTour = {
          ...t,
          rating: newAvg,
          reviewCount: newCount
        };
        saveTourToFirebase(updatedTour);
        return updatedTour;
      }
      return t;
    }));
  };

  // Filtered Tours Calculation
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tour.title.toLowerCase().includes(q);
        const matchCity = tour.city.toLowerCase().includes(q);
        const matchGuide = tour.guideName.toLowerCase().includes(q);
        const matchCategory = tour.category.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchGuide && !matchCategory) return false;
      }

      // City filter
      if (selectedCity && tour.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory && tour.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (tour.price > maxPrice) {
        return false;
      }

      // Rating filter
      if (tour.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [tours, searchQuery, selectedCity, selectedCategory, maxPrice, minRating, sortBy]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreateTour={() => setIsCreateTourOpen(true)}
        onOpenBookings={() => setIsBookingsOpen(true)}
        onOpenDashboard={() => setActiveView('dashboard')}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Router */}
      {activeView === 'dashboard' && user && user.role === 'guide' ? (
        <GuideDashboard
          user={user}
          tours={tours}
          bookings={bookings}
          onOpenCreateTour={() => setIsCreateTourOpen(true)}
          onDeleteTour={handleDeleteTour}
          onSelectTour={(t) => setSelectedTourForDetail(t)}
        />
      ) : (
        <main style={{ flex: 1 }}>
          {/* Hero Banner */}
          <Hero
            cities={INITIAL_CITIES}
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* City Explorer Catalog */}
          <CityGrid
            cities={INITIAL_CITIES}
            tours={tours}
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
          />

          {/* Tour Listing */}
          <section id="tours" className="section section--tours">
            <div className="section-head">
              <h2>{selectedCity ? `Экскурсии: ${selectedCity}` : 'Популярные экскурсии'}</h2>
              <p>
                {selectedCity
                  ? 'Авторские туры местных гидов в выбранном городе'
                  : 'Авторские туры и прогулки от местных гидов'}
              </p>
            </div>

            <TourFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={filteredTours.length}
            />

            {filteredTours.length > 0 ? (
              <div className="tour-grid">
                {filteredTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    currentUser={user}
                    onSelect={(t) => setSelectedTourForDetail(t)}
                    onBook={(t, slot) => {
                      setBookingSlot(slot ?? null);
                      setSelectedTourForBooking(t);
                    }}
                    onDelete={handleDeleteTour}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fa-solid fa-map-location-dot"></i>
                <h3>{tours.length === 0 ? 'Пока нет ни одной экскурсии' : 'Ничего не найдено'}</h3>
                <p>
                  {tours.length === 0
                    ? 'Гиды ещё не опубликовали туры. Зарегистрируйтесь как гид, чтобы добавить первый.'
                    : 'Измените запрос, выберите другой город или сбросьте фильтры по цене и рейтингу.'}
                </p>
                {tours.length > 0 && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('');
                      setSelectedCategory('');
                      setMaxPrice(15000);
                      setMinRating(0);
                    }}
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}
          </section>

          <PromoBanners
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenCreateTour={() => setIsCreateTourOpen(true)}
          />

          <WhyUs />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CreateTourModal
        isOpen={isCreateTourOpen}
        onClose={() => setIsCreateTourOpen(false)}
        currentUser={user}
        onAddTour={handleAddTour}
      />

      <TourDetailModal
        isOpen={!!selectedTourForDetail}
        onClose={() => setSelectedTourForDetail(null)}
        tour={selectedTourForDetail}
        reviews={reviews}
        currentUser={user}
        onOpenBooking={(t) => {
          setSelectedTourForDetail(null);
          setBookingSlot(null);
          setSelectedTourForBooking(t);
        }}
        onOpenAddReview={(t) => setSelectedTourForReview(t)}
      />

      <BookingModal
        isOpen={!!selectedTourForBooking}
        onClose={() => {
          setSelectedTourForBooking(null);
          setBookingSlot(null);
        }}
        tour={selectedTourForBooking}
        initialDate={bookingSlot?.date}
        initialTime={bookingSlot?.time}
        currentUser={user}
        onConfirmBooking={handleConfirmBooking}
      />

      <ReviewModal
        isOpen={!!selectedTourForReview}
        onClose={() => setSelectedTourForReview(null)}
        tour={selectedTourForReview}
        currentUser={user}
        onSubmitReview={handleSubmitReview}
      />

      <UserBookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
        tours={tours}
        onOpenAddReview={(t) => setSelectedTourForReview(t)}
      />
    </div>
  );
};
