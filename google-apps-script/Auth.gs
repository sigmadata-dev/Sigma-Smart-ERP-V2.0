/**
 * Authentication and authorization functions
 */

/**
 * Authenticate user with Google OAuth credential
 */
function authenticateWithGoogle(credential) {
  try {
    // Decode JWT token (simplified - in production use proper JWT library)
    const payload = parseJWT(credential);
    
    if (!payload || !payload.email) {
      return { data: { error: 'Invalid credential' }, status: 401 };
    }
    
    // Create user object
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: determineUserRole(payload.email)
    };
    
    // Generate session token
    const sessionToken = generateSessionToken(user);
    
    // Store session in cache
    CacheService.getScriptCache().put(
      `session_${sessionToken}`, 
      JSON.stringify(user), 
      CONFIG.CACHE_DURATION
    );
    
    return {
      data: {
        token: sessionToken,
        user: user
      },
      status: 200
    };
    
  } catch (error) {
    console.error('Authentication error:', error);
    return { data: { error: 'Authentication failed' }, status: 401 };
  }
}

/**
 * Validate session token
 */
function validateToken(token) {
  if (!token) return null;
  
  try {
    const cached = CacheService.getScriptCache().get(`session_${token}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/**
 * Determine user role based on email
 */
function determineUserRole(email) {
  // Admin emails - replace with actual admin emails
  const adminEmails = [
    'admin@sigmaerp.com',
    'manager@sigmaerp.com'
  ];
  
  if (adminEmails.includes(email)) {
    return 'admin';
  }
  
  // Manager emails - replace with actual manager emails
  const managerEmails = [
    'manager@company.com',
    'supervisor@company.com'
  ];
  
  if (managerEmails.includes(email)) {
    return 'manager';
  }
  
  return 'user';
}

/**
 * Check if user has permission for operation
 */
function checkPermission(user, module, operation) {
  if (!user) return false;
  
  const permissions = {
    admin: {
      all: ['read', 'write', 'delete']
    },
    manager: {
      facturi: ['read', 'write'],
      tva: ['read', 'write'],
      comenzi: ['read', 'write'],
      lucrari: ['read', 'write'],
      clienti: ['read', 'write'],
      furnizori: ['read', 'write'],
      angajati: ['read'],
      pontaj: ['read', 'write'],
      depozit: ['read', 'write'],
      manopera: ['read', 'write'],
      contracte: ['read'],
      centre_cost: ['read']
    },
    user: {
      pontaj: ['read', 'write'],
      profile: ['read', 'write']
    }
  };
  
  const userPermissions = permissions[user.role];
  if (!userPermissions) return false;
  
  // Admin has access to everything
  if (user.role === 'admin') return true;
  
  // Check module-specific permissions
  const modulePermissions = userPermissions[module];
  if (!modulePermissions) return false;
  
  return modulePermissions.includes(operation);
}

/**
 * Simple JWT parser (for demo - use proper library in production)
 */
function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = Utilities.base64DecodeWebSafe(payload);
    const json = Utilities.newBlob(decoded).getDataAsString();
    
    return JSON.parse(json);
  } catch (error) {
    console.error('JWT parsing error:', error);
    return null;
  }
}

/**
 * Generate session token
 */
function generateSessionToken(user) {
  const timestamp = Date.now();
  const random = Math.random();
  const data = `${user.id}_${timestamp}_${random}`;
  
  return Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data)
  ).substring(0, 32);
}