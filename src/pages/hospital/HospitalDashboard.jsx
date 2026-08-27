import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Building2, Droplets, Siren, Users, HeartHandshake, Plus, AlertCircle, Phone, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { BloodDistributionWidget } from '../../components/widgets/BloodDistributionWidget';
import { DonationTrendWidget } from '../../components/widgets/DonationTrendWidget';
import CreateRequestModal from '../requests/CreateRequestModal';
import { fetchRequests } from '../../redux/requestSlice';

const HospitalDashboard = () => {
  const dispatch = useDispatch();
  const { inventory, donorResponses, emergencyCases } = useSelector((s) => s.hospital);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const totalInventoryUnits = Object.values(inventory).reduce((a, b) => a + b, 0);

  const responseCols = [
    { key: 'donorName', header: 'Donor Name', render: (d) => <span className="font-bold text-slate-900 dark:text-white">{d.donorName}</span> },
    { key: 'bloodGroup', header: 'Blood Group', render: (d) => <span className="font-bold text-red-600">{d.bloodGroup}</span> },
    { key: 'distance', header: 'Distance', render: (d) => <span className="text-slate-500 text-xs">{d.distance}</span> },
    { key: 'status', header: 'Status', render: (d) => <Badge variant={d.status === 'Accepted' ? 'success' : 'warning'}>{d.status}</Badge> },
    { key: 'actions', header: 'Contact', render: (d) => (
      <a href={`tel:${d.phone}`} className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline">
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            Hospital Administration Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live inventory monitoring, emergency dispatch, and donor pledge management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="emergency" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
            New Blood Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Blood Inventory Units', value: totalInventoryUnits, icon: <Droplets className="w-6 h-6" />, color: 'red', change: '8 blood groups tracked', changeType: 'neutral' },
          { title: 'Pending Donor Pledges', value: donorResponses.filter(d => d.status === 'Pending').length, icon: <Users className="w-6 h-6" />, color: 'amber', change: 'Incoming donors', changeType: 'positive' },
          { title: 'Critical Emergency Cases', value: emergencyCases.length, icon: <Siren className="w-6 h-6" />, color: 'red', change: 'High urgency', changeType: 'negative' },
          { title: "Today's Verified Donations", value: 12, icon: <CheckCircle className="w-6 h-6" />, color: 'emerald', change: '↑ 4 since yesterday', changeType: 'positive' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Widgets Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BloodDistributionWidget stocks={inventory} />
        <DonationTrendWidget />
      </div>

      {/* Donor Responses Management */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <Users className="w-5 h-5 text-emerald-500" />
            Recent Donor Pledges & Responses
          </h2>
          <Button variant="ghost" size="sm">Manage All</Button>
        </div>
        <Table columns={responseCols} data={donorResponses} />
      </div>

      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default HospitalDashboard;
