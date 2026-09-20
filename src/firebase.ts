import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc 
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Tour, Review, Booking, User } from "./types";

// Official Firebase configuration for tripland-ts
const firebaseConfig = {
  apiKey: "AIzaSyCHvjRtH6pc9ijIavb8YFbP6lT2ThKhCag",
  authDomain: "tripland-ts.firebaseapp.com",
  projectId: "tripland-ts",
  storageBucket: "tripland-ts.firebasestorage.app",
  messagingSenderId: "574609446595",
  appId: "1:574609446595:web:b0b976c9460055b9e5b476",
  measurementId: "G-N0C3SYXVF0"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In helper via Firebase Popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn("Firebase Google Sign-In notice:", error);
    return null;
  }
};

// Firestore helper for Tours (Gid ma'lumotlari va turlar)
export async function saveTourToFirebase(tour: Tour) {
  try {
    await setDoc(doc(db, "tours", tour.id), tour);
    console.log("Tour successfully uploaded to Firebase:", tour.id);
    return true;
  } catch (error) {
    console.warn("Firebase saveTour error:", error);
    return false;
  }
}

export async function fetchToursFromFirebase(): Promise<Tour[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "tours"));
    const tours: Tour[] = [];
    querySnapshot.forEach((docSnapshot) => {
      tours.push({ id: docSnapshot.id, ...docSnapshot.data() } as Tour);
    });
    return tours;
  } catch (error) {
    console.warn("Firebase fetchTours error:", error);
    return [];
  }
}

export async function deleteTourFromFirebase(tourId: string) {
  try {
    await deleteDoc(doc(db, "tours", tourId));
    console.log("Tour successfully deleted from Firebase:", tourId);
    return true;
  } catch (error) {
    console.warn("Firebase deleteTour error:", error);
    return false;
  }
}

// Firestore helper for Reviews
export async function saveReviewToFirebase(review: Review) {
  try {
    await setDoc(doc(db, "reviews", review.id), review);
    return true;
  } catch (error) {
    console.warn("Firebase saveReview error:", error);
    return false;
  }
}

export async function deleteReviewFromFirebase(reviewId: string) {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
    return true;
  } catch (error) {
    console.warn("Firebase deleteReview error:", error);
    return false;
  }
}

export async function fetchReviewsFromFirebase(): Promise<Review[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    const reviews: Review[] = [];
    querySnapshot.forEach((docSnapshot) => {
      reviews.push({ id: docSnapshot.id, ...docSnapshot.data() } as Review);
    });
    return reviews;
  } catch (error) {
    console.warn("Firebase fetchReviews error:", error);
    return [];
  }
}

// Firestore helper for Bookings
export async function saveBookingToFirebase(booking: Booking) {
  try {
    await setDoc(doc(db, "bookings", booking.id), booking);
    return true;
  } catch (error) {
    console.warn("Firebase saveBooking error:", error);
    return false;
  }
}

export async function fetchBookingsFromFirebase(): Promise<Booking[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings: Booking[] = [];
    querySnapshot.forEach((docSnapshot) => {
      bookings.push({ id: docSnapshot.id, ...docSnapshot.data() } as Booking);
    });
    return bookings;
  } catch (error) {
    console.warn("Firebase fetchBookings error:", error);
    return [];
  }
}

// Firestore helper for Users (Foydalanuvchilar / Gidlar)
export async function saveUserToFirebase(user: User) {
  try {
    await setDoc(doc(db, "users", user.id), user);
    return true;
  } catch (error) {
    console.warn("Firebase saveUser error:", error);
    return false;
  }
}

export async function maulumotlarniOlish() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (err) {
    console.warn("Firestore fetch error:", err);
    return [];
  }
}

