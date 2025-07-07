# Sigma Smart ERP - Deployment Guide

## Quick Deployment Checklist

### 1. Google Apps Script Setup (5 minutes)

1. **Create Apps Script Project**
   ```
   1. Go to script.google.com
   2. New Project → Name it "Sigma Smart ERP API"
   3. Create 4 files and copy content from google-apps-script/ folder:
      - Config.gs (configuration & Google Sheets IDs)
      - Auth.gs (authentication & authorization)
      - Modules.gs (ERP module handlers)
      - SheetsService.gs (Google Sheets integration)
   4. Deploy as Web App (Execute as: Me, Access: Anyone)
   5. Copy the Web App URL
   ```

2. **Update Configuration**
   ```javascript
   // In Config.gs, update CORS origin with your actual Vercel URL:
   const CONFIG = {
     CORS_ORIGIN: 'https://your-vercel-app.vercel.app', // Your actual Vercel URL
   };
   
   // SHEET_IDS are already configured with your existing Google Sheets:
   // ✅ facturi: '1tuXSfn1oBygYGBE6K-_xxRey4fT6tjCuU6qsoYrrv1A' (Sistem_facturi)
   // ✅ tva: '1milALf9FugbSc7q5f1ljoET8eNSlL0I8AUPagSt4Zyg' (Sistem_TVA)
   // ✅ depozit: '1V4S9O2rl1hGedFVREYkSwR7Q2lOMg7EJrwjxNis0eSQ' (Sistem_depozit)
   // ✅ And all other 8 modules are configured with real Sheet IDs
   
   // Update admin/manager emails:
   const ADMIN_EMAILS = ['your-admin@company.com'];
   const MANAGER_EMAILS = ['your-manager@company.com'];
   ```

### 2. Google OAuth Setup (3 minutes)

1. **Create OAuth Client**
   ```
   1. Go to console.cloud.google.com
   2. Create new project or select existing
   3. Enable Google Sheets API
   4. Credentials → Create OAuth 2.0 Client ID
   5. Web application → Add your domain
   6. Copy Client ID
   ```

### 3. Vercel Deployment (2 minutes)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   
   # Add environment variables in Vercel dashboard:
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   NEXT_PUBLIC_APPS_SCRIPT_URL=your-apps-script-url
   ```

## Environment Variables

```bash
# .env.local (for local development)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_APP_ENV=development

# Production (set in Vercel dashboard)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id  
NEXT_PUBLIC_APPS_SCRIPT_URL=your-production-apps-script-url
NEXT_PUBLIC_APP_ENV=production
```

## API Endpoints Testing

```bash
# Test authentication
curl -X POST https://your-api-url/api/auth/google \
     -H "Content-Type: application/json" \
     -d '{"credential":"your-google-jwt-token"}'

# Test dashboard KPIs  
curl -H "Authorization: Bearer your-token" \
     https://your-api-url/api/dashboard/kpi

# Test module data
curl -H "Authorization: Bearer your-token" \
     https://your-api-url/api/facturi?limit=5
```

## User Role Configuration

Update admin emails in `Auth.gs`:

```javascript
// Line 45-50 in Auth.gs
const adminEmails = [
  'admin@yourcompany.com',
  'manager@yourcompany.com'
];

const managerEmails = [
  'supervisor@yourcompany.com',
  'team-lead@yourcompany.com'  
];
```

## Production Checklist

- [ ] Google Apps Script deployed as Web App
- [ ] OAuth credentials configured with production domain
- [ ] Environment variables set in Vercel
- [ ] Admin emails configured in Auth.gs
- [ ] CORS origin updated to production domain
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Google Sheets permissions verified

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Update CORS_ORIGIN in Code.gs
   - Redeploy Apps Script

2. **OAuth Error**
   - Check client ID matches
   - Verify authorized origins include your domain

3. **Sheets Permission Error**
   - Verify sheet IDs are correct
   - Check sheet sharing permissions
   - Ensure Apps Script has access

### Support

- Check browser console for errors
- Test API endpoints with curl
- Verify Google Cloud Console settings
- Review Apps Script execution logs

Total deployment time: **~10 minutes**