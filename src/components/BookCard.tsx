import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Users,
  Building,
} from "lucide-react";
import type { Book } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  showActions?: boolean;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  className = "",
}) => {
  const { user } = useAuth();
  const canEdit = user?.id === book.userId;

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
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    if (onView) {
      onView(book.id);
    }
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) {
      onView(book.id);
    }
  };

  return (
    <Card
      className={`group pt-0 relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {book.image && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-6 line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </CardTitle>
            {book.sub_title && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {book.sub_title}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-muted">
                  {getAuthorInitials(book.author)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {book.author}
              </span>
            </div>
          </div>

          {showActions && canEdit && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(book);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(book.id);
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-3">
        {/* Publisher and Language */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            <span>{book.publisher}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{book.language}</span>
          </div>
        </div>

        {/* Editors */}
        {book.editors && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span className="truncate">Editors: {book.editors}</span>
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {book.published_at
                ? formatDate(book.published_at)
                : formatDate(book.createdAt)}
            </span>
          </div>
          {book.user && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">by {book.user.name}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge
              variant={book.published ? "default" : "secondary"}
              className="text-xs"
            >
              <BookOpen className="mr-1 h-3 w-3" />
              {book.published ? "Published" : "Draft"}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleViewClick}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
