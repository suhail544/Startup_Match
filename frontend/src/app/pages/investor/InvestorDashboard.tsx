import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ideasAPI, savedIdeasAPI, interestAPI, investorAPI } from '../../services/api';
import type { Idea, Investor, SavedIdea, Interest } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MapPin, DollarSign, Bookmark, MessageSquare } from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [interestCount, setInterestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const investorData = await investorAPI.getByUserId(user.id);
      setInvestor(investorData);

      if (investorData) {
        const [savedIdeas, interests] = await Promise.all([
          savedIdeasAPI.getByInvestor(investorData.id),
          interestAPI.getByInvestor(investorData.id)
        ]);
        setSavedCount(savedIdeas.length);
        setInterestCount(interests.length);
      }

      const ideasData = await ideasAPI.getAll();
      setIdeas(ideasData.slice(0, 6)); // Show top 6 ideas
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name}!</CardTitle>
              <CardDescription>
                Let's get started by creating your investor profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/investor/profile">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Create Profile
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Saved Ideas</CardDescription>
              <CardTitle className="text-3xl">{savedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/investor/saved" className="text-sm text-blue-600 hover:underline">
                View saved ideas →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Expressed Interests</CardDescription>
              <CardTitle className="text-3xl">{interestCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/investor/interests" className="text-sm text-blue-600 hover:underline">
                View interests →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Available Ideas</CardDescription>
              <CardTitle className="text-3xl">{ideas.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/" className="text-sm text-blue-600 hover:underline">
                Browse all ideas →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Ideas */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Featured Ideas</CardTitle>
                <CardDescription>Explore the latest startup ideas</CardDescription>
              </div>
              <Link to="/">
                <button className="text-sm text-blue-600 hover:underline">
                  View all
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {ideas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No ideas available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map(idea => (
                  <Link key={idea.id} to={`/ideas/${idea.id}`}>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex gap-2 mb-3">
                        <Badge variant="secondary">{idea.category}</Badge>
                        <Badge variant={idea.status === 'PUBLISHED' ? 'default' : 'outline'}>
                          {idea.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{idea.businessName}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {idea.shortDescription}
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          ₹{(idea.fundingRequired / 1000).toFixed(0)}K
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          {idea.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};