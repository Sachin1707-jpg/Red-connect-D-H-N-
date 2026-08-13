import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-primary shadow-xl">
          <Heart className="w-12 h-12 fill-primary/20 animate-heart-pulse" />
        </div>
        <div>
          <h1 className="text-6xl font-black text-slate-900 dark:text-white">404</h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The blood donation page or request destination you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/requests">
            <Button variant="outline">
              View Emergency Requests
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
