import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ideasAPI } from '../services/api';
import type { Idea } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, MapPin, DollarSign, TrendingUp } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  useEffect(() => {
    filterIdeas();
  }, [searchQuery, categoryFilter, ideas]);

  const loadIdeas = async () => {
    try {
      const data = await ideasAPI.getAll();
      setIdeas(data);
      setFilteredIdeas(data);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIdeas = () => {
    let filtered = ideas;

    if (searchQuery) {
      filtered = filtered.filter(
        idea =>
          idea.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(idea => idea.category === categoryFilter);
    }

    setFilteredIdeas(filtered);
  };

  const categories = Array.from(new Set(ideas.map(idea => idea.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Connect Entrepreneurs with Investors
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover innovative startup ideas or find the perfect investors to bring your vision to life
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Get Started
              </button>
            </Link>
            <Link to="/login">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <TrendingUp className="inline h-8 w-8 mr-2 text-blue-600" />
            Featured Ideas
          </h2>
          <p className="text-gray-600">
            Showing {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No ideas found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <Link key={idea.id} to={`/ideas/${idea.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{idea.category}</Badge>
                      <Badge
                        variant={idea.status === 'PUBLISHED' ? 'default' : 'outline'}
                      >
                        {idea.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{idea.businessName}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {idea.shortDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-semibold">
                          ${(idea.fundingRequired / 1000).toFixed(0)}K funding required
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        {idea.location}
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          By {idea.entrepreneur.user.name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of entrepreneurs and investors today
          </p>
          <Link to="/signup">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Create Free Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
