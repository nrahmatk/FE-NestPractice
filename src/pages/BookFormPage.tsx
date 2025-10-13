import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  AlertCircle, 
  BookOpen,
  ImageIcon,
  Calendar,
  User,
  Building,
  Globe,
  Users,
  FileText
} from "lucide-react";
import type { CreateBookData } from "@/types";
import { booksAPI } from "@/services/api";

interface BookFormPageProps {
  bookId?: string;
}

const BookFormPage: React.FC<BookFormPageProps> = ({ bookId }) => {
  const isEditing = !!bookId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateBookData>({
    title: "",
    sub_title: "",
    description: "",
    author: "",
    editors: "",
    image: "",
    published: false,
    published_at: "",
    publisher: "",
    language: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBook, setIsFetchingBook] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && bookId) {
      fetchBook();
    }
  }, [isEditing, bookId]);

  const fetchBook = async () => {
    try {
      setIsFetchingBook(true);
      const book = await booksAPI.getBook(parseInt(bookId!));
      setFormData({
        title: book.title,
        sub_title: book.sub_title || "",
        description: book.description || "",
        author: book.author,
        editors: book.editors || "",
        image: book.image || "",
        published: book.published,
        published_at: book.published_at ? book.published_at.split("T")[0] : "",
        publisher: book.publisher,
        language: book.language,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch book");
    } finally {
      setIsFetchingBook(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const bookData = {
        ...formData,
        published_at: formData.published_at
          ? new Date(formData.published_at).toISOString()
          : undefined,
      };

      if (isEditing && bookId) {
        await booksAPI.updateBook(parseInt(bookId), bookData);
      } else {
        await booksAPI.createBook(bookData);
      }

      navigate("/my-books");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} book`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingBook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/my-books">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? "Edit Book" : "Add New Book"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing 
                  ? "Update your book information" 
                  : "Add a new book to your collection"}
              </p>
            </div>
          </div>

          {isEditing && (
            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
              <BookOpen className="h-3 w-3" />
              Editing Mode
            </Badge>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="Enter book title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sub_title">Subtitle</Label>
                    <Input
                      id="sub_title"
                      name="sub_title"
                      type="text"
                      placeholder="Enter book subtitle"
                      value={formData.sub_title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Author <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      type="text"
                      required
                      placeholder="Enter author name"
                      value={formData.author}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="editors" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Editors
                    </Label>
                    <Input
                      id="editors"
                      name="editors"
                      type="text"
                      placeholder="Enter editors names"
                      value={formData.editors}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher" className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Publisher <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="publisher"
                      name="publisher"
                      type="text"
                      required
                      placeholder="Enter publisher name"
                      value={formData.publisher}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Language <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="language"
                      name="language"
                      type="text"
                      required
                      placeholder="e.g., English, Spanish"
                      value={formData.language}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Image URL
                    </Label>
                    <Input
                      id="image"
                      name="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published_at" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Published Date
                    </Label>
                    <Input
                      id="published_at"
                      name="published_at"
                      type="date"
                      value={formData.published_at}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Book Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Enter a detailed description of the book..."
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* Publication Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Publication Status</h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                  <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Mark as published
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Book" : "Create Book"}
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  asChild
                  className="flex-1"
                  size="lg"
                >
                  <Link to="/my-books">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookFormPage;