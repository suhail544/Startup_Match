import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { savedIdeasAPI, investorAPI } from '../../services/api';
import type { SavedIdea } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, DollarSign, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const SavedIdeas: React.FC = () => {
  const { user } = useAuth();
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedIdeas();
    }
  }, [user]);

  const loadSavedIdeas = async () => {
    if (!user) return;

    try {
      const investor = await investorAPI.getByUserId(user.id);
      if (investor) {
        const data = await savedIdeasAPI.getByInvestor(investor.id);
        setSavedIdeas(data);
      }
    } catch (error) {
      console.error('Failed to load saved ideas:', error);
      toast.error('Failed to load saved ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id: string) => {
    try {
      await savedIdeasAPI.unsave(id);
      setSavedIdeas(savedIdeas.filter(si => si.id !== id));
      toast.success('Idea removed from saved list');
    } catch (error) {
      toast.error('Failed to remove idea');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Ideas</h1>
          <p className="text-gray-600 mt-2">Ideas you've bookmarked for later review</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Saved Ideas ({savedIdeas.length})</CardTitle>
            <CardDescription>
              Click on any idea to view more details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedIdeas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't saved any ideas yet</p>
                <Link to="/">
                  <Button>Browse Ideas</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedIdeas.map(savedIdea => (
                  <div
                    key={savedIdea.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <Link to={`/ideas/${savedIdea.idea.id}`} className="flex-1">
                        <div className="flex gap-2 mb-3">
                          <Badge variant="secondary">{savedIdea.idea.category}</Badge>
                          <Badge variant={savedIdea.idea.status === 'PUBLISHED' ? 'default' : 'outline'}>
                            {savedIdea.idea.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {savedIdea.idea.businessName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {savedIdea.idea.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            ${(savedIdea.idea.fundingRequired / 1000).toFixed(0)}K
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                            {savedIdea.idea.location}
                          </div>
                          <div className="text-gray-500">
                            By {savedIdea.idea.entrepreneur?.user?.name || 'Unknown'}
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnsave(savedIdea.id)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};