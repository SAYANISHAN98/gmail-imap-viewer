import React from 'react';
import { Mail, Shield } from 'lucide-react';

function Login() {
  const handleGoogleLogin = () => {
    // The backend URL for starting OAuth flow
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Gmail IMAP Viewer
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Securely view your emails using IMAP integration
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Shield className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              Sign in with Google
            </button>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            By signing in, you agree to allow us read-only access to your emails via IMAP.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
