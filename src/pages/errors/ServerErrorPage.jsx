import React from 'react';
import { RefreshCw, Home } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

const ServerErrorPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shadow-xl">
          <span className="text-4xl font-black">500</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Internal Server Error</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Something went wrong on our end. Our technical team has been notified and is investigating.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => window.location.reload()}>
            Retry Page
          </Button>
          <Link to="/">
            <Button variant="outline" leftIcon={<Home className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
