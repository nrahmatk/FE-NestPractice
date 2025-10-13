import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BookOpen,
  User,
  LogOut,
  Library,
  Plus,
  Home,
  Menu,
} from "lucide-react";

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    ...(isAuthenticated
      ? [
          { to: "/books", label: "All Books", icon: Library },
          { to: "/my-books", label: "My Books", icon: BookOpen },
          { to: "/books/new", label: "Add Book", icon: Plus },
        ]
      : []),
  ];

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.to}
                  variant={isActive(item.to) ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link to={item.to}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-5">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/"
                      className="flex items-center space-x-2"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                        <BookOpen className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold">BookStore</span>
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.to}
                          variant={isActive(item.to) ? "default" : "ghost"}
                          asChild
                          className="justify-start"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <Link to={item.to}>
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </Button>
                      );
                    })}

                    {!isAuthenticated && (
                      <>
                        <Button
                          variant="ghost"
                          asChild
                          className="justify-start"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <Link to="/login">
                            <User className="mr-2 h-4 w-4" />
                            Login
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="justify-start"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <Link to="/register">
                            <User className="mr-2 h-4 w-4" />
                            Register
                          </Link>
                        </Button>
                      </>
                    )}

                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        className="justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
