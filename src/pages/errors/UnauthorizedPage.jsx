import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shadow-xl">
          <Lock className="w-12 h-12" />
        </div>
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white">401</h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Authentication Required</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            You must be logged in to access this page. Please sign in to your RedConnect account.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Link to="/login">
            <Button variant="primary" leftIcon={<LogIn className="w-4 h-4" />}>
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
