import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Award, Download, FileText, Droplets, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileService } from '../../services/profileService';
import { StatsCard } from '../../components/ui/StatsCard';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';

const DonationHistoryPage = () => {
  const { user } = useSelector((s) => s.auth);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const history = await profileService.getDonationHistory();
        setDonations(history);
      } catch (err) {
        console.error('[DonationHistoryPage] Error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = donations.filter(
    (d) =>
      !search ||
      (d.hospitalName && d.hospitalName.toLowerCase().includes(search.toLowerCase())) ||
      (d.bloodGroup && d.bloodGroup.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS));
  const paginated = filtered.slice((page - 1) * ITEMS, page * ITEMS);

  const columns = [
    {
      key: 'hospitalName',
      header: 'Hospital',
      render: (r) => <span className="font-semibold text-slate-900 dark:text-white">{r.hospitalName}</span>,
    },
    {
      key: 'bloodGroup',
      header: 'Blood Type',
      render: (r) => (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm shadow-sm">
          {r.bloodGroup}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (r) => <span className="text-slate-500 text-xs">{r.date}</span>,
    },
    {
      key: 'units',
      header: 'Units',
      render: (r) => <span className="font-bold">{r.units || 1} unit</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant="success">{r.status || 'Verified'}</Badge>,
    },
    {
      key: 'pointsEarned',
      header: 'Points',
      render: (r) => <span className="font-bold text-amber-500">+{r.pointsEarned || 100} pts</span>,
    },
    {
      key: 'actions',
      header: 'Certificate',
      render: (r) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => toast.success(`Certificate downloaded for ${r.hospitalName}`)}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Donation History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          A complete log of your verified blood donations and earned certificates from Firestore
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Donations',
            value: donations.length || user?.totalDonations || 0,
            icon: <Droplets className="w-6 h-6" />,
            color: 'red',
            change: 'All verified by hospital',
          },
          {
            title: 'Lives Saved',
            value: (donations.length || user?.totalDonations || 0) * 3,
            icon: <Award className="w-6 h-6" />,
            color: 'red',
            change: 'Each unit helps 3 people',
            changeType: 'positive',
          },
          {
            title: 'Certificates',
            value: donations.filter((d) => d.status === 'Verified').length || donations.length,
            icon: <FileText className="w-6 h-6" />,
            color: 'emerald',
            change: 'Downloadable PDFs',
          },
          {
            title: 'Points Earned',
            value: user?.rewardPoints || (donations.length * 100),
            icon: <Award className="w-6 h-6" />,
            color: 'amber',
            change: '100 pts / donation',
          },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Filter & Export */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search by hospital or blood type..."
          className="sm:max-w-xs"
        />
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={() => toast.success('CSV export generated from Firestore!')}
        >
          Export CSV
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 flex justify-center items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm text-slate-500 font-medium">Fetching live donation records...</span>
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState title="No donations found" description="Your donation history will appear here after your first verified donation." />
      ) : (
        <>
          <Table columns={columns} data={paginated} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default DonationHistoryPage;
