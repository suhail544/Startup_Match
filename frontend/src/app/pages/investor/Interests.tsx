import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { interestAPI, investorAPI } from '../../services/api';
import type { Interest } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Interests: React.FC = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInterests();
    }
  }, [user]);

  const loadInterests = async () => {
    if (!user) return;

    try {
      const investor = await investorAPI.getByUserId(user.id);
      if (investor) {
        const data = await interestAPI.getByInvestor(investor.id);
        setInterests(data);
      }
    } catch (error) {
      console.error('Failed to load interests:', error);
      toast.error('Failed to load interests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'ACCEPTED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const filterInterests = (status: string) => {
    return interests.filter(interest => interest.status === status);
  };

  const InterestList = ({ interests }: { interests: Interest[] }) => (
    <div className="space-y-4">
      {interests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No interests in this category</p>
        </div>
      ) : (
        interests.map(interest => (
          <div
            key={interest.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <Link to={`/ideas/${interest.idea.id}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{interest.idea.category}</Badge>
                    <Badge variant={interest.idea.status === 'PUBLISHED' ? 'default' : 'outline'}>
                      {interest.idea.status}
                    </Badge>
                    <div className={`flex items-center gap-1 ${getStatusColor(interest.status)}`}>
                      {getStatusIcon(interest.status)}
                      <span className="text-sm font-semibold">{interest.status}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {interest.idea.businessName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {interest.idea.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                      ₹{(interest.idea.fundingRequired / 1000).toFixed(0)}K
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-blue-600" />
                      {interest.idea.location}
                    </div>
                    <div className="text-gray-500">
                      By {interest.idea.entrepreneur?.user?.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your Message:</p>
                    <p className="text-sm text-gray-600">{interest.message}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );

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
          <h1 className="text-3xl font-bold text-gray-900">My Interests</h1>
          <p className="text-gray-600 mt-2">Track your investment interests and their status</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Investment Interests ({interests.length})</CardTitle>
            <CardDescription>
              View all ideas you've expressed interest in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {interests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't expressed interest in any ideas yet</p>
                <Link to="/">
                  <Button>Browse Ideas</Button>
                </Link>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All ({interests.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({filterInterests('PENDING').length})
                  </TabsTrigger>
                  <TabsTrigger value="accepted">
                    Accepted ({filterInterests('ACCEPTED').length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({filterInterests('REJECTED').length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <InterestList interests={interests} />
                </TabsContent>
                <TabsContent value="pending" className="mt-6">
                  <InterestList interests={filterInterests('PENDING')} />
                </TabsContent>
                <TabsContent value="accepted" className="mt-6">
                  <InterestList interests={filterInterests('ACCEPTED')} />
                </TabsContent>
                <TabsContent value="rejected" className="mt-6">
                  <InterestList interests={filterInterests('REJECTED')} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};