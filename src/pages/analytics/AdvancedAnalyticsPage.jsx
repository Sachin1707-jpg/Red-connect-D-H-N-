import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Droplets, Users, Building2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/common/Button';
import { BloodDistributionWidget } from '../../components/widgets/BloodDistributionWidget';
import { DonationTrendWidget } from '../../components/widgets/DonationTrendWidget';

const AdvancedAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7d');

  const handleExportCSV = () => {
    toast.success('📊 Exporting analytics data to CSV file...');
  };

  const handleExportPDF = () => {
    toast.success('📄 Generating executive PDF summary report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Executive Performance & Blood Supply Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cross-platform statistics, procurement efficiency, and donor trends</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Full Year</option>
          </select>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" leftIcon={<FileText className="w-4 h-4" />} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytics High Level Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Donations Logged', value: 1420, icon: <Droplets className="w-6 h-6" />, color: 'red', change: '↑ 14% vs previous period', changeType: 'positive' },
          { title: 'Avg Emergency Response Time', value: '14.2 min', icon: <TrendingUp className="w-6 h-6" />, color: 'emerald', change: '↓ 3 mins faster', changeType: 'positive' },
          { title: 'Donor Conversion Rate', value: '78.4%', icon: <Users className="w-6 h-6" />, color: 'amber', change: 'Pledged to completed', changeType: 'neutral' },
          { title: 'Participating Hospitals', value: 385, icon: <Building2 className="w-6 h-6" />, color: 'indigo', change: '↑ 12 new this month', changeType: 'positive' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Visual Analytics Widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DonationTrendWidget />
        <BloodDistributionWidget />
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPage;
