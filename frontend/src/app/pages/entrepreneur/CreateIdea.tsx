import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ideasAPI, entrepreneurAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

const categories = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Food & Beverage',
  'Retail',
  'Real Estate',
  'Entertainment',
  'Transportation',
  'Other'
];

const statuses = ['DRAFT', 'PUBLISHED', 'FUNDED'];

export const CreateIdea: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entrepreneurId, setEntrepreneurId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    shortDescription: '',
    fullDescription: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
    businessModel: '',
    fundingRequired: '',
    category: '',
    location: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'FUNDED'
  });

  useEffect(() => {
    if (user) {
      loadEntrepreneur();
    }
  }, [user]);

  const loadEntrepreneur = async () => {
    if (!user) return;

    try {
      const entrepreneur = await entrepreneurAPI.getByUserId(user.id);
      if (!entrepreneur) {
        toast.error('Please create your profile first');
        navigate('/entrepreneur/profile');
        return;
      }
      setEntrepreneurId(entrepreneur.id);
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/entrepreneur/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.shortDescription || !formData.fundingRequired || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!entrepreneurId) {
      toast.error('Entrepreneur profile not found');
      return;
    }

    setSaving(true);
    try {
      await ideasAPI.create({
        ...formData,
        fundingRequired: parseFloat(formData.fundingRequired),
        entrepreneurId
      });
      toast.success('Idea created successfully');
      navigate('/entrepreneur/dashboard');
    } catch (error) {
      toast.error('Failed to create idea');
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Idea</CardTitle>
            <CardDescription>
              Share your startup idea with potential investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="A brief overview of your business idea (1-2 sentences)"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Detailed description of your business idea"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemStatement">Problem Statement</Label>
                <Textarea
                  id="problemStatement"
                  placeholder="What problem does your business solve?"
                  value={formData.problemStatement}
                  onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  placeholder="How does your business solve this problem?"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Textarea
                  id="targetMarket"
                  placeholder="Who are your target customers?"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessModel">Business Model</Label>
                <Textarea
                  id="businessModel"
                  placeholder="How will your business make money?"
                  value={formData.businessModel}
                  onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fundingRequired">Funding Required ($) *</Label>
                  <Input
                    id="fundingRequired"
                    type="number"
                    placeholder="e.g., 250000"
                    value={formData.fundingRequired}
                    onChange={(e) => setFormData({ ...formData, fundingRequired: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as 'DRAFT' | 'PUBLISHED' | 'FUNDED' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Idea'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/entrepreneur/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};