import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, BookOpen, AlertCircle } from "lucide-react";
import type { Book } from "@/types";
import { booksAPI } from "@/services/api";
import BookCard from "@/components/BookCard";

const MyBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await booksAPI.getMyBooks();
      setBooks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch your books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    navigate(`/books/${book.id}/edit`);
  };

  const handleViewBook = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksAPI.deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete book");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Books</h1>
              <p className="text-muted-foreground mt-2">
                Manage your personal book collection
              </p>
            </div>
            <Button asChild size="lg" className="w-fit">
              <Link to="/books/new">
                <Plus className="mr-2 h-5 w-5" />
                Add New Book
              </Link>
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Books Grid */}
        {books.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                You haven't added any books yet. Start building your collection
                by adding your first book.
              </p>
              <Button asChild size="lg">
                <Link to="/books/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Book
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>
                  {books.length} {books.length === 1 ? "book" : "books"} in your
                  collection
                </span>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleViewBook}
                  showActions={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBooksPage;
