import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, Share2, Filter, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

const reports = [
  { id: '1', title: 'Monthly Blood Supply & Fulfillment Report', category: 'Executive Summary', date: '2026-07-01', size: '2.4 MB', format: 'PDF' },
  { id: '2', title: 'Hospital Inventory Stock Audit Log', category: 'Hospital Stock', date: '2026-07-15', size: '1.8 MB', format: 'XLSX' },
  { id: '3', title: 'Voluntary Donor Demographics & Turnout Analysis', category: 'Analytics', date: '2026-06-30', size: '3.1 MB', format: 'PDF' },
];

const ReportCenterPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('ALL');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Report Center & Document Downloads
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate executive analytics summaries, inventory audit sheets, and compliance reports</p>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card hoverable className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-primary shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info" size="sm">{r.category}</Badge>
                    <Badge variant="default" size="sm">{r.format}</Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Generated on {r.date} · {r.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => toast.success('Print dialog opened (demo)')}>
                  Print
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Share2 className="w-4 h-4" />} onClick={() => toast.success('Share link copied to clipboard!')}>
                  Share
                </Button>
                <Button variant="primary" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={() => toast.success(`Downloading ${r.title}...`)}>
                  Download
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReportCenterPage;
