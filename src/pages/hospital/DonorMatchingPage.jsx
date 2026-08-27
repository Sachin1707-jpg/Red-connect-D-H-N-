import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DonorMatchingSection } from './DonorMatchingSection';

const DonorMatchingPage = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-rose-500" />
            Donor Matching Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            AI-powered spatial &amp; blood group compatibility matching for active requests
          </p>
        </div>
      </div>

      {/* Matching Engine Section */}
      <DonorMatchingSection />
    </motion.div>
  );
};

export default DonorMatchingPage;
