import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurAPI } from '../../services/api';
import type { Entrepreneur } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export const EntrepreneurProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entrepreneur, setEntrepreneur] = useState<Entrepreneur | null>(null);
  const [formData, setFormData] = useState({
    bio: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const data = await entrepreneurAPI.getByUserId(user.id);
      if (data) {
        setEntrepreneur(data);
        setFormData({
          bio: data.bio,
          location: data.location
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bio || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      if (entrepreneur) {
        await entrepreneurAPI.update(entrepreneur.id, formData);
        toast.success('Profile updated successfully');
      } else {
        if (!user) return;
        await entrepreneurAPI.create({
          userId: user.id,
          ...formData
        });
        toast.success('Profile created successfully');
      }
      navigate('/entrepreneur/dashboard');
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
              {entrepreneur ? 'Edit Profile' : 'Create Your Profile'}
            </CardTitle>
            <CardDescription>
              {entrepreneur
                ? 'Update your entrepreneur information'
                : 'Tell us about yourself to get started'}
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
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background and experience..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : entrepreneur ? 'Update Profile' : 'Create Profile'}
                </Button>
                {entrepreneur && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/entrepreneur/dashboard')}
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