import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { investorAPI } from '../../services/api';
import type { Investor } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export const InvestorProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    investmentRange: '',
    focusAreas: [] as string[]
  });
  const [newFocusArea, setNewFocusArea] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const data = await investorAPI.getByUserId(user.id);
      if (data) {
        setInvestor(data);
        // Convert comma-separated string to array
        const focusAreasArray = typeof data.focusAreas === 'string'
          ? data.focusAreas.split(',').map(a => a.trim()).filter(Boolean)
          : Array.isArray(data.focusAreas) ? data.focusAreas : [];
        setFormData({
          companyName: data.companyName,
          investmentRange: data.investmentRange,
          focusAreas: focusAreasArray
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFocusArea = () => {
    if (newFocusArea.trim() && !formData.focusAreas.includes(newFocusArea.trim())) {
      setFormData({
        ...formData,
        focusAreas: [...formData.focusAreas, newFocusArea.trim()]
      });
      setNewFocusArea('');
    }
  };

  const handleRemoveFocusArea = (area: string) => {
    setFormData({
      ...formData,
      focusAreas: formData.focusAreas.filter(a => a !== area)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.investmentRange || formData.focusAreas.length === 0) {
      toast.error('Please fill in all fields and add at least one focus area');
      return;
    }

    setSaving(true);
    try {
      // Convert array to comma-separated string for backend
      const submitData = {
        ...formData,
        focusAreas: formData.focusAreas.join(',')
      };

      if (investor) {
        await investorAPI.update(investor.id, submitData);
        toast.success('Profile updated successfully');
      } else {
        if (!user) return;
        await investorAPI.create({
          ...submitData,
          userId: user.id,
        });
        toast.success('Profile created successfully');
      }
      navigate('/investor/dashboard');
    } catch (error) {
      toast.error('Failed to save profile');
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {investor ? 'Edit Profile' : 'Create Your Profile'}
            </CardTitle>
            <CardDescription>
              {investor
                ? 'Update your investor information'
                : 'Tell us about your investment interests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">
                  Name is set from your account and cannot be changed here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., Acme Ventures"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentRange">Investment Range</Label>
                <Input
                  id="investmentRange"
                  placeholder="e.g., 10,000rs - 3,00,000rs"
                  value={formData.investmentRange}
                  onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusAreas">Focus Areas</Label>
                <div className="flex gap-2">
                  <Input
                    id="focusAreas"
                    placeholder="e.g., Technology, Healthcare"
                    value={newFocusArea}
                    onChange={(e) => setNewFocusArea(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFocusArea();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddFocusArea}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {formData.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.focusAreas.map(area => (
                      <Badge key={area} variant="secondary" className="text-sm">
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveFocusArea(area)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : investor ? 'Update Profile' : 'Create Profile'}
                </Button>
                {investor && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/investor/dashboard')}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};