# Sigma Smart ERP

Complete ERP solution for Romanian businesses with Google Workspace integration.

## 🚀 Features

- **Complete ERP Modules**: 12 integrated business modules
- **Google Workspace Integration**: Native integration with Google Sheets and OAuth
- **Real-time Dashboard**: KPI cards, charts, and business analytics
- **Role-based Access Control**: User, Manager, and Admin roles
- **Responsive Design**: Mobile-first approach with dark/light themes
- **Serverless Architecture**: React frontend + Google Apps Script backend

## 📋 Modules

### Financial Management
- **Facturi** - Invoice management and tracking
- **TVA** - VAT calculations and tax compliance

### Operations Management
- **Depozit** - Inventory management (entries/exits/stock)
- **Comenzi** - Order management and tracking
- **Lucrări** - Project management and client work
- **Manoperă** - Labor tracking and cost calculation

### Human Resources
- **Angajați** - Employee database and management
- **Contracte** - Contract management and salary administration
- **Pontaj** - Time tracking and attendance

### Master Data
- **Clienți** - Client relationship management
- **Furnizori** - Supplier management
- **Centre Cost** - Cost center and budget tracking

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Recharts** - Interactive charts and data visualization
- **React Query** - Server state management

### Backend
- **Google Apps Script** - Serverless backend API
- **Google Sheets API** - Database layer with 12 spreadsheets
- **Google OAuth 2.0** - Authentication and authorization

### Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **Google Apps Script** - Backend hosting (serverless)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── common/            # Reusable components (KPICard, DataTable)
│   ├── layout/            # Layout components (Header, Sidebar)
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts (Auth, Theme)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (API client, auth, utils)
├── pages/                 # Page components
└── types/                 # TypeScript type definitions

google-apps-script/
├── Code.gs               # Main API entry point
├── Auth.gs               # Authentication functions
├── SheetsService.gs      # Google Sheets integration
└── Modules.gs            # Module-specific handlers
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Google account with access to Google Sheets
- Vercel account for deployment

### 1. Frontend Setup

```bash
# Clone and install dependencies
git clone <your-repo>
cd sigma-smart-erp
pnpm install

# Start development server
pnpm run dev
```

### 2. Google Apps Script Setup

1. **Create New Apps Script Project**
   - Go to [script.google.com](https://script.google.com)
   - Create new project: "Sigma Smart ERP API"

2. **Copy Backend Code**
   ```bash
   # Copy all files from google-apps-script/ folder to your Apps Script project
   - Code.gs (main entry point)
   - Auth.gs (authentication)
   - SheetsService.gs (sheets integration)
   - Modules.gs (business logic)
   ```

3. **Deploy as Web App**
   - Click "Deploy" → "New Deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone with the link"
   - Copy the Web App URL

4. **Update Configuration**
   ```javascript
   // In Code.gs, update CORS_ORIGIN
   const CONFIG = {
     CORS_ORIGIN: 'https://your-app.vercel.app', // Your Vercel domain
     // ... other config
   };
   ```

### 3. Google OAuth Setup

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Sheets API and Google Drive API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Authorized origins: `https://your-app.vercel.app`
   - Copy Client ID

2. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - User type: "Internal" (for company use) or "External"
   - Add scopes: `auth/spreadsheets`, `auth/userinfo.email`, `auth/userinfo.profile`

### 4. Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_APPS_SCRIPT_URL=your-apps-script-web-app-url
NEXT_PUBLIC_APP_ENV=production
```

### 5. Google Sheets Setup

The system uses these Google Sheets (IDs already configured):

- **Facturi**: `1tuXSfn1oBygYGBE6K-_xxRey4fT6tjCuU6qsoYrrv1A`
- **TVA**: `1milALf9FugbSc7q5f1ljoET8eNSlL0I8AUPagSt4Zyg`
- **Depozit**: `1V4S9O2rl1hGedFVREYkSwR7Q2lOMg7EJrwjxNis0eSQ`
- **Comenzi**: `1DWaDV6ep8ZvjslK19ItQNYv0zUxpr2xzAV-6npkgBJI`
- **Lucrări**: `18wwm4PURy3iMCksv7zVzcX5Kw2z97jUpU_KMIiiSe9M`
- **Manoperă**: `1yMuIj8M66ZaW0mDy21IlJX8tb9x9v8coBIbWIRZFLU8`
- **Contracte**: `1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4`
- **Pontaj**: `1VUM97oen8jOF7BZuL-Nl-1M-98SmBSzPv8EIj_nYkCY`
- **Clienți**: `1x0_BxwtMVw1iGxXUzu5sdgqqriXkA1VPe105Rh0egJw`
- **Furnizori**: `1iyb-O8E8U8cMiEfNarkCdPvOt7BHRyQpVIEZCYYkeBE`
- **Centre Cost**: `1qlG5b9HDgFIwWx0RR7moixXEuqse-ryzobjdgMggtvE`
- **Angajați**: `1dhEAVUC3NJar4pNpdFoVt_BR3lhYnmilULa8U2XWXw4`

### 6. Deploy to Vercel

```bash
# Build and deploy
pnpm run build

# Deploy to Vercel
npx vercel --prod

# Or connect GitHub repository for automatic deployments
```

## 🔧 API Documentation

### Authentication

All API requests require authentication via Google OAuth token.

**Headers:**
```
Authorization: Bearer <google-oauth-token>
Content-Type: application/json
```

### Endpoints

#### Authentication
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google-oauth-credential"
}
```

#### Dashboard
```http
GET /api/dashboard/kpi
GET /api/dashboard/activities?limit=10
```

#### Modules (CRUD Operations)
```http
# Get data with pagination and filters
GET /api/facturi?page=1&limit=50&status=active

# Create new record
POST /api/facturi
{
  "Serie_factura": "INV-2024-001",
  "Data_factura": "2024-07-07",
  "Valoare_RON": 1500.00
}

# Update existing record
PUT /api/facturi
{
  "ID_factura": "FAC-240707001",
  "Status": "paid"
}

# Delete record (soft delete)
DELETE /api/facturi?id=FAC-240707001
```

### Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2024-07-07T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-07-07T10:30:00Z"
}
```

## 👥 User Roles & Permissions

### Admin
- Full access to all modules
- User management
- System configuration
- All CRUD operations

### Manager
- Access to business modules (facturi, comenzi, lucrări, etc.)
- Read/write permissions for operational data
- Limited HR access (read-only)

### User
- Personal data access (pontaj, profile)
- Read-only access to relevant business data

## 🔒 Security Features

- Google OAuth 2.0 authentication
- Role-based access control
- HTTPS everywhere
- Input validation and sanitization
- Audit logging for all operations
- Rate limiting via Google Apps Script

## 📊 Sample Data & Testing

The system includes mock data for development and testing:

```bash
# Test API endpoints
curl -H "Authorization: Bearer <token>" \
     https://your-api-url/api/dashboard/kpi

curl -H "Authorization: Bearer <token>" \
     https://your-api-url/api/facturi?limit=5
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # TypeScript type checking
```

### Code Quality

- ESLint + Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks with Husky
- Automated testing with Jest

## 🚀 Production Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import GitHub repository to Vercel
   - Configure environment variables
   - Enable automatic deployments

2. **Custom Domain**
   - Add custom domain in Vercel settings
   - Update CORS_ORIGIN in Apps Script
   - Update OAuth authorized origins

### Performance Optimization

- Next.js automatic code splitting
- Image optimization
- CDN distribution
- Browser caching
- API response caching

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions:
- Email: support@sigmasmarter.com
- Documentation: [docs.sigmasmarterp.com](https://docs.sigmasmarterp.com)
- Issues: GitHub Issues

---

**Sigma Smart ERP** - Complete business management solution for the modern age.