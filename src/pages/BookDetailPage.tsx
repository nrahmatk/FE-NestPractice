import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  Globe,
  Building,
  Users,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { Book } from "@/types";
import { booksAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (bookId) {
      fetchBookDetail();
    }
  }, [bookId]);

  const fetchBookDetail = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await booksAPI.getBook(Number(bookId));
      setBook(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch book details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (book) {
      navigate(`/books/${book.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!book) return;

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksAPI.deleteBook(book.id);
        navigate("/my-books");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete book");
      }
    }
  };

  const getAuthorInitials = (author: string) => {
    return author
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-8 w-96 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="w-full h-96 rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Book not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const canEdit = user?.id === book.userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {book.title}
              </h1>
              {book.sub_title && (
                <p className="text-xl text-muted-foreground">
                  {book.sub_title}
                </p>
              )}
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <Button onClick={handleEdit} size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete} size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-muted flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Author and Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Book Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">
                      {getAuthorInitials(book.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{book.author}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={book.published ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    {book.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Publishing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Published Date
                      </p>
                      <p className="font-medium">
                        {book.published_at
                          ? formatDate(book.published_at)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Added</p>
                      <p className="font-medium">
                        {formatDate(book.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {book.editors && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Editors</p>
                      <p className="font-medium">{book.editors}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {book.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Added by */}
            {book.user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Added by
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {book.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{book.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{book.user.username}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
