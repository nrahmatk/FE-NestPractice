import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Library, 
  Plus, 
  User, 
  ArrowRight,
  Users,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Library,
      title: "Browse Collection",
      description: "Explore our vast collection of books from various authors and publishers",
      href: "/books",
      color: "bg-blue-500"
    },
    {
      icon: BookOpen,
      title: "My Library",
      description: "Manage your personal book collection and track your reading progress",
      href: "/my-books",
      color: "bg-green-500"
    },
    {
      icon: Plus,
      title: "Add Books",
      description: "Contribute to our collection by adding your favorite books",
      href: "/books/new",
      color: "bg-purple-500"
    }
  ];

  const stats = [
    { label: "Active Readers", value: "1,234", icon: Users },
    { label: "Books Added", value: "5,678", icon: BookOpen },
    { label: "Reviews", value: "2,345", icon: Star },
    { label: "Growing Daily", value: "+50", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BookStore
            </span>
          </h1>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-xl text-muted-foreground mb-8">
                Hello, <span className="font-semibold text-foreground">{user?.name}</span>! 
                Ready to explore your book collection?
              </p>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Zap className="mr-1 h-3 w-3" />
                Welcome back!
              </Badge>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover, organize, and share your favorite books in our beautiful, 
                modern book management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/register">
                    <User className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {!isAuthenticated && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Features/Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link to={isAuthenticated ? feature.href : "/login"}>
                      {isAuthenticated ? "Explore" : "Sign in to Access"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto border-dashed border-2 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold mb-4">Ready to start your book journey?</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of book lovers and start organizing your personal library today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/register">
                      Create Free Account
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/books">
                      Browse Books
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;