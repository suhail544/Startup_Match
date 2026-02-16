import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ideasAPI, entrepreneurAPI } from '../../services/api';
import type { Idea, Entrepreneur } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const entrepreneurData = await entrepreneurAPI.getByUserId(user.id);
      setEntrepreneur(entrepreneurData);

      if (entrepreneurData) {
        const ideasData = await ideasAPI.getByEntrepreneur(entrepreneurData.id);
        setIdeas(ideasData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this idea?')) return;

    try {
      await ideasAPI.delete(id);
      setIdeas(ideas.filter(idea => idea.id !== id));
      toast.success('Idea deleted successfully');
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entrepreneur) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name}!</CardTitle>
              <CardDescription>
                Let's get started by creating your entrepreneur profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/entrepreneur/profile">
                <Button>Create Profile</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Ideas</CardDescription>
              <CardTitle className="text-3xl">{ideas.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl">
                {ideas.filter(i => i.status === 'PUBLISHED').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl">
                {ideas.filter(i => i.status === 'DRAFT').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Ideas List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Ideas</CardTitle>
                <CardDescription>Manage your startup ideas</CardDescription>
              </div>
              <Link to="/entrepreneur/ideas/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Idea
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {ideas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't created any ideas yet</p>
                <Link to="/entrepreneur/ideas/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Idea
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map(idea => (
                  <div
                    key={idea.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{idea.businessName}</h3>
                          <Badge
                            variant={idea.status === 'PUBLISHED' ? 'default' : 'secondary'}
                          >
                            {idea.status}
                          </Badge>
                          <Badge variant="outline">{idea.category}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{idea.shortDescription}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            ${(idea.fundingRequired / 1000).toFixed(0)}K
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                            {idea.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link to={`/entrepreneur/ideas/${idea.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(idea.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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