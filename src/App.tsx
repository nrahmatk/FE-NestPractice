import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import MyBooksPage from "./pages/MyBooksPage";
import BookFormPage from "./pages/BookFormPage";
import BookDetailPage from "./pages/BookDetailPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <BooksPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/:bookId"
              element={
                <ProtectedRoute>
                  <BookDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBooksPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/new"
              element={
                <ProtectedRoute>
                  <BookFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books/:bookId/edit"
              element={
                <ProtectedRoute>
                  <BookFormPageWithParams />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component wrapper to handle route params
const BookFormPageWithParams: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  return <BookFormPage bookId={bookId} />;
};

export default App;
