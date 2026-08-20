# StartupMatch

A full-stack web application that connects entrepreneurs with investors. Entrepreneurs can showcase their startup ideas, while investors can discover opportunities and express interest in funding innovations.

**Live Demo:** http://localhost:5173 (after running dev servers)

---

## Features

### For Entrepreneurs

- **Secure Authentication:** Sign up and log in with email/password
- **Profile Management:** Create and edit your entrepreneur profile with bio and location
- **Idea Management:** Create, edit, and publish startup ideas with detailed descriptions
- **Idea Tracking:** View all your ideas and their status (Draft, Published, Funded)
- **Dashboard:** Overview of total ideas, published ideas, and drafts

### For Investors

- **Secure Authentication:** Sign up and log in with email/password
- **Profile Management:** Create investor profile with company name, investment range, and focus areas
- **Idea Discovery:** Browse all published startup ideas
- **Save Ideas:** Bookmark ideas for later review
- **Express Interest:** Send interest messages to entrepreneurs with custom notes
- **Track Interests:** Monitor expressed interests and their status (Pending, Accepted, Rejected)
- **Dashboard:** Quick stats on saved ideas, expressed interests, and available opportunities

### General Features

- **Role-Based Access Control:** Protected routes for entrepreneur and investor features
- **Responsive Design:** Mobile-friendly UI with Tailwind CSS
- **Real-Time Notifications:** Toast notifications for actions and errors
- **Token-Based Authentication:** Secure JWT-based authorization

---

## Tech Stack

### Backend

- **Framework:** Node.js + Express (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **Logging:** Morgan
- **CORS:** Enabled for development

### Frontend

- **Framework:** React 18.3.1 (TypeScript)
- **Build Tool:** Vite
- **Routing:** React Router v7
- **UI Components:** Radix UI + shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)
- **HTTP Client:** Fetch API with custom wrapper

---

## Project Structure

```
EN-IN Prisma/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic for routes
│   │   │   ├── auth.controller.ts
│   │   │   ├── entrepreneur/
│   │   │   ├── investor/
│   │   ├── routes/             # API route definitions
│   │   ├── middlewares/        # Auth & error handling
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # JWT, error handling, utilities
│   │   └── server.ts           # Express app initialization
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── scripts/
│   │   └── smoke.ps1           # End-to-end smoke test
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/     # Reusable React components
    │   │   ├── context/        # Auth context provider
    │   │   ├── layouts/        # Page layouts
    │   │   ├── pages/          # Route pages
    │   │   ├── services/       # API client
    │   │   ├── types/          # TypeScript interfaces
    │   │   ├── App.tsx
    │   │   └── routes.tsx      # Route definitions
    │   ├── main.tsx
    │   └── styles/             # Global styles
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** database (running locally or remote)
- **Git**

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/startup_match
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174
   ```

4. **Set up the database:**

   ```bash
   npx prisma migrate dev
   ```

   This creates the database schema and runs all migrations.

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   Frontend runs at `http://localhost:5173` (or next available port)

---

## Running Both Servers

### Option 1: Separate Terminals

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Option 2: Parallel (from root if using npm workspaces)

```bash
npm run dev
```

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Routes

- **POST** `/auth/signup` - Register a new user
- **POST** `/auth/login` - Log in user

### Entrepreneur Routes

- **GET** `/entrepreneur` - Get all entrepreneur profiles
- **POST** `/entrepreneur` - Create entrepreneur profile (auth required)
- **GET** `/entrepreneur/me` - Get current user's profile (auth required)
- **GET** `/entrepreneur/user/:userId` - Get profile by user ID
- **GET** `/entrepreneur/:id` - Get profile by ID
- **PUT** `/entrepreneur/:id` - Update profile (auth required)
- **DELETE** `/entrepreneur/:id` - Delete profile (auth required)

### Investor Routes

- **GET** `/investor` - Get all investor profiles
- **POST** `/investor` - Create investor profile (auth required)
- **GET** `/investor/me` - Get current user's profile (auth required)
- **GET** `/investor/user/:userId` - Get profile by user ID
- **GET** `/investor/:id` - Get profile by ID
- **PUT** `/investor/:id` - Update profile (auth required)
- **DELETE** `/investor/:id` - Delete profile (auth required)

### Idea Routes

- **GET** `/idea` - Get all ideas (paginated)
- **POST** `/idea` - Create idea (auth required, entrepreneur only)
- **GET** `/idea/:id` - Get idea by ID
- **PATCH** `/idea/:id` - Update idea (auth required)
- **DELETE** `/idea/:id` - Delete idea (auth required)

### Saved Ideas Routes

- **GET** `/save-idea` - Get saved ideas for authenticated investor (auth required)
- **POST** `/save-idea` - Save an idea (auth required, investor only)
- **DELETE** `/save-idea/:id` - Unsave an idea (auth required)

### Interest Routes

- **GET** `/interest` - Get interests for authenticated investor (auth required)
- **POST** `/interest` - Express interest in an idea (auth required, investor only)
- **PATCH** `/interest/:id` - Update interest status (auth required)
- **GET** `/interest?ideaId=...` - Get interests for a specific idea

---

## Database Schema

### User Table

- `id` (UUID, PK)
- `name` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `role` (ENTREPRENEUR | INVESTOR)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### EntrepreneurProfile Table

- `id` (UUID, PK)
- `userId` (UUID, FK)
- `bio` (String, optional)
- `location` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### InvestorProfile Table

- `id` (UUID, PK)
- `userId` (UUID, FK)
- `companyName` (String)
- `investmentRange` (String)
- `focusAreas` (String, comma-separated)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Idea Table

- `id` (UUID, PK)
- `businessName` (String)
- `shortDescription` (String)
- `fullDescription` (String, optional)
- `problemStatement` (String, optional)
- `solution` (String, optional)
- `targetMarket` (String, optional)
- `businessModel` (String, optional)
- `fundingRequired` (Int)
- `category` (String)
- `location` (String)
- `status` (ACTIVE | CLOSED)
- `entrepreneurId` (UUID, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### SavedIdea Table

- `id` (UUID, PK)
- `ideaId` (UUID, FK)
- `investorId` (UUID, FK)
- `createdAt` (DateTime)

### Interest Table

- `id` (UUID, PK)
- `ideaId` (UUID, FK)
- `investorId` (UUID, FK)
- `message` (String)
- `status` (PENDING | ACCEPTED | REJECTED)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## Key Implementation Details

### Authentication Flow

1. User signs up with email/password
2. Backend hashes password with bcrypt (12 rounds)
3. JWT token issued on signup/login (expires in 1 hour, configurable)
4. Frontend stores token in localStorage
5. Token attached to all subsequent requests via `Authorization: Bearer <token>` header
6. Protected routes validate token via `protect` middleware

### Role-Based Access Control

- `ProtectedRoute` component checks user role before rendering
- Routes redirect to `/` if user role doesn't match allowed role
- Unauthenticated users redirected to `/login`

### Status Mapping

Backend stores idea status as `ACTIVE` or `CLOSED`, while frontend displays as `PUBLISHED` or `FUNDED` for better UX. Status mapping handled in API client.

### Data Type Conversions

- `focusAreas`: Backend stores as comma-separated string; frontend converts to array for UI
- Arrays are joined back to strings on submission

---

## Common Issues & Troubleshooting

### Issue: "Token expired" messages appearing frequently

**Solution:** Update `EXPIRES_IN` in `backend/src/utils/jwt.ts` to a longer duration (e.g., `7d`)

### Issue: CORS errors when frontend calls backend

**Solution:** Ensure `FRONTEND_ORIGINS` in backend `.env` includes your frontend URL (default: `http://localhost:5173,http://localhost:5174`)

### Issue: Frontend shows wrong dashboard after login

**Solution:**

1. Check localStorage `user` object has `role` field
2. Clear localStorage and re-login to ensure fresh token/user data
3. Verify AuthContext properly stores and returns user data

### Issue: Blank pages or 404 errors

**Solution:**

1. Ensure backend server is running (`npm run dev` in `/backend`)
2. Verify frontend `.env` has correct `VITE_API_URL`
3. Check browser console for API errors

### Issue: focusAreas.map is not a function

**Solution:** Backend returns focusAreas as string; frontend components must split by comma or handle optional chaining

---

## Future Enhancements

- [ ] **Refresh Token Flow:** Implement refresh tokens for extended sessions without re-login
- [ ] **Email Notifications:** Send notifications on interest expression and status updates
- [ ] **Search & Filter:** Advanced idea search and investor filtering
- [ ] **Messaging System:** Direct messaging between entrepreneurs and investors
- [ ] **Ratings & Reviews:** Investor/entrepreneur ratings and reviews
- [ ] **Admin Dashboard:** Moderation and oversight tools
- [ ] **Payment Integration:** Stripe integration for subscription/premium features
- [ ] **Analytics:** Usage metrics and insights for both user types
- [ ] **Multi-Language Support:** Internationalization (i18n)
- [ ] **Mobile App:** React Native mobile application

---

## Testing

### Run Smoke Test (Backend)

```bash
cd backend
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/smoke.ps1
```

This script:

1. Registers an entrepreneur
2. Creates entrepreneur profile
3. Creates a startup idea
4. Registers an investor
5. Creates investor profile
6. Saves the idea
7. Expresses interest
8. Verifies endpoints work

### Manual Testing

1. Open http://localhost:5173
2. Sign up as Entrepreneur or Investor
3. Create profile
4. Test role-specific features (dashboards, CRUD operations)
5. Check console for API errors or warnings

---

## Development Commands

### Backend

```bash
npm run dev          # Start with nodemon (auto-reload)
npm run build        # Build TypeScript
npm run start        # Start built app
npm run lint         # Run ESLint (if configured)
npx prisma studio   # Open Prisma database UI
```

### Frontend

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

---

## Deployment

### Backend (Node.js)

1. Set production environment variables (DATABASE_URL, JWT_SECRET, etc.)
2. Build: `npm run build`
3. Deploy to Heroku, Vercel, Railway, or own server
4. Run migrations: `npx prisma migrate deploy`

### Frontend (React/Vite)

1. Build: `npm run build`
2. Deploy `dist/` folder to Vercel, Netlify, or S3 + CloudFront
3. Set `VITE_API_URL` to production backend URL

---

## License

This project is open source and available under the MIT License.

---

## Contributors

- **Shafe** - Full-stack development

---

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

---

## Changelog

### v1.0.0 (Current)

- Initial release
- Full authentication and authorization system
- Entrepreneur profile and idea management
- Investor profile and discovery features
- Saved ideas and interest tracking
- Role-based dashboards
- Responsive web UI

---

**Last Updated:** February 16, 2026  
**Status:** Active Development
