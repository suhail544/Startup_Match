import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { IdeaDetailsPage } from './pages/IdeaDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { EntrepreneurDashboard } from './pages/entrepreneur/EntrepreneurDashboard';
import { EntrepreneurProfile } from './pages/entrepreneur/EntrepreneurProfile';
import { CreateIdea } from './pages/entrepreneur/CreateIdea';
import { EditIdea } from './pages/entrepreneur/EditIdea';
import { InvestorDashboard } from './pages/investor/InvestorDashboard';
import { InvestorProfile } from './pages/investor/InvestorProfile';
import { SavedIdeas } from './pages/investor/SavedIdeas';
import { Interests } from './pages/investor/Interests';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'ideas/:id', Component: IdeaDetailsPage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },
      
      // Entrepreneur routes
      {
        path: 'entrepreneur',
        element: <ProtectedRoute allowedRole="ENTREPRENEUR" />,
        children: [
          { path: 'dashboard', Component: EntrepreneurDashboard },
          { path: 'profile', Component: EntrepreneurProfile },
          { path: 'ideas/new', Component: CreateIdea },
          { path: 'ideas/:id/edit', Component: EditIdea },
        ],
      },
      
      // Investor routes
      {
        path: 'investor',
        element: <ProtectedRoute allowedRole="INVESTOR" />,
        children: [
          { path: 'dashboard', Component: InvestorDashboard },
          { path: 'profile', Component: InvestorProfile },
          { path: 'saved', Component: SavedIdeas },
          { path: 'interests', Component: Interests },
        ],
      },
      
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
