// Google OAuth configuration for client-side authentication

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

// Demo Google Client ID - Replace with your actual client ID
//const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '1087967398726-8nqfnj7u3l0m37p41r6nv1v8i4ghjcqf.apps.googleusercontent.com';

const GOOGLE_CLIENT_ID: string = '61265558858-emur0thvro3ogvv66nbisu700a5uit51.apps.googleusercontent.com';

export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }

    // Check if Google script is loaded
    if (!window.google) {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          setupGoogleAuth();
          resolve();
        } else {
          reject(new Error('Google Sign-In failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
      document.head.appendChild(script);
    } else {
      setupGoogleAuth();
      resolve();
    }
  });
};

const setupGoogleAuth = () => {
  if (window.google) {
    console.log('Setting up Google Auth with client ID:', GOOGLE_CLIENT_ID);
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: window.handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    console.log('Google Auth initialized successfully');
  } else {
    console.error('Google object not available');
  }
};

export const signInWithGoogle = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.google) {
      reject(new Error('Google Sign-In not available'));
      return;
    }

    // Set up the callback function
    window.handleGoogleSignIn = (response: any) => {
      try {
        if (!response.credential) {
          reject(new Error('No credential received'));
          return;
        }

        // Decode JWT token (basic decoding - in production use a proper JWT library)
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const user: User = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          role: 'user' as const
        };

        // Store auth token
        setAuthToken(response.credential);
        resolve(user);
      } catch (error) {
        reject(new Error('Failed to process Google Sign-In response'));
      }
    };

    // Trigger the sign-in prompt with better error handling
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error('Google Sign-In not displayed:', notification.getNotDisplayedReason());
          reject(new Error(`Google Sign-In not displayed: ${notification.getNotDisplayedReason()}`));
        } else if (notification.isSkippedMoment()) {
          console.error('Google Sign-In skipped:', notification.getSkippedReason());
          reject(new Error(`Google Sign-In skipped: ${notification.getSkippedReason()}`));
        } else if (notification.isDismissedMoment()) {
          console.error('Google Sign-In dismissed:', notification.getDismissedReason());
          reject(new Error(`Google Sign-In dismissed: ${notification.getDismissedReason()}`));
        }
      });
    } catch (error) {
      reject(new Error(`Failed to trigger Google Sign-In: ${error}`));
    }
  });
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

export const renderGoogleSignInButton = (elementId: string) => {
  if (typeof window === 'undefined' || !window.google) {
    console.error('Google not available');
    return;
  }

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
    }
  );
};