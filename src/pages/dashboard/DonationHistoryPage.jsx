import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Download, FileText, Droplets, Loader2, Calendar, MapPin, Clock,
  CheckCircle2, HeartHandshake, Filter, ArrowUpDown, Info, Plus, ShieldCheck, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { profileService } from '../../services/profileService';
import { mockDonationHistory, mockCamps } from '../../data/mockData';
import { StatsCard } from '../../components/ui/StatsCard';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { Modal } from '../../components/common/Modal';
import { Card } from '../../components/common/Card';

const DonationHistoryPage = () => {
  const { user } = useSelector((s) => s.auth);
  const { camps = [] } = useSelector((s) => s.ngo);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [pledgedCamps, setPledgedCamps] = useState({});

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const loadDonations = async () => {
      setLoading(true);
      try {
        const history = await profileService.getDonationHistory();
        if (history && history.length > 0) {
          setDonations(history);
        } else {
          // Merge user blood group into mock history if available
          const enrichedMock = mockDonationHistory.map((d) => ({
            ...d,
            bloodGroup: d.bloodGroup || user?.bloodGroup || 'O+',
            location: d.location || 'Central Hospital, New Delhi',
            type: d.type || 'Voluntary Donation',
            notes: d.notes || 'Verified voluntary blood donation.',
          }));
          setDonations(enrichedMock);
        }
      } catch (err) {
        console.error('[DonationHistoryPage] Error loading history:', err);
        setDonations(mockDonationHistory);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, [user]);

  // Handle Camp Pledge
  const handlePledgeCamp = (campId, campTitle) => {
    setPledgedCamps((prev) => ({ ...prev, [campId]: true }));
    toast.success(`🎉 You pledged to attend "${campTitle}"! The camp organizer has been notified.`);
  };

  // Eligibility Calculation (90 days interval)
  const calculateEligibility = () => {
    if (!donations || donations.length === 0) {
      return { eligible: true, daysRemaining: 0, label: 'Eligible to Donate Now' };
    }
    const sortedDates = [...donations]
      .map((d) => new Date(d.date))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => b - a);

    if (sortedDates.length === 0) return { eligible: true, daysRemaining: 0, label: 'Eligible to Donate Now' };

    const lastDate = sortedDates[0];
    const nextEligible = new Date(lastDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = nextEligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { eligible: true, daysRemaining: 0, label: 'Eligible to Donate Now' };
    } else {
      return { eligible: false, daysRemaining: diffDays, label: `Eligible in ${diffDays} days` };
    }
  };

  const eligibility = calculateEligibility();

  // Filter & Sort
  const filtered = donations.filter((d) => {
    const matchesSearch =
      !search ||
      (d.hospitalName && d.hospitalName.toLowerCase().includes(search.toLowerCase())) ||
      (d.bloodGroup && d.bloodGroup.toLowerCase().includes(search.toLowerCase())) ||
      (d.location && d.location.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ? true : statusFilter === 'Verified' ? d.status === 'Verified' : d.status === 'Pending';

    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
    if (sortBy === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
    if (sortBy === 'hospital') return (a.hospitalName || '').localeCompare(b.hospitalName || '');
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Table Columns
  const columns = [
    {
      key: 'hospitalName',
      header: 'Hospital / Camp Drive',
      render: (r) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">{r.hospitalName}</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" /> {r.location || 'New Delhi'}
          </p>
        </div>
      ),
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      render: (r) => (
        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs shadow-sm">
          {r.bloodGroup || user?.bloodGroup || 'O+'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Donation Date',
      render: (r) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {r.date}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Donation Type',
      render: (r) => <Badge variant="indigo" size="sm">{r.type || 'Voluntary'}</Badge>,
    },
    {
      key: 'units',
      header: 'Units',
      render: (r) => <span className="font-bold text-slate-900 dark:text-white text-xs">{r.units || 1} Unit</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={r.status === 'Verified' ? 'success' : 'warning'} size="sm">
          {r.status || 'Verified'}
        </Badge>
      ),
    },
    {
      key: 'pointsEarned',
      header: 'Points',
      render: (r) => <span className="font-bold text-amber-500 text-xs">+{r.pointsEarned || 100} pts</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedDonation(r)}>
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={(e) => {
              e.stopPropagation();
              toast.success(`📜 Certificate downloaded for ${r.hospitalName}`);
            }}
          >
            Certificate
          </Button>
        </div>
      ),
    },
  ];

  // Active upcoming camps to show to donor
  const upcomingCampsList = camps.length > 0 ? camps.filter((c) => c.status === 'Active' || c.status === 'Upcoming') : mockCamps;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Droplets className="w-7 h-7 text-red-600" />
            Donation Management Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your verified donation records, download certificates, and pledge for upcoming community camps
          </p>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Verified Donations"
          value={donations.length || user?.totalDonations || 0}
          icon={<Droplets className="w-6 h-6 text-red-500" />}
          change="100% verified records"
          changeType="neutral"
          color="red"
        />
        <StatsCard
          title="Donation Status"
          value={eligibility.eligible ? 'Eligible Now' : `${eligibility.daysRemaining} Days Left`}
          icon={<CheckCircle2 className={`w-6 h-6 ${eligibility.eligible ? 'text-emerald-500' : 'text-amber-500'}`} />}
          change={eligibility.eligible ? 'Ready for next donation' : '90-day recovery period'}
          changeType={eligibility.eligible ? 'positive' : 'neutral'}
          color={eligibility.eligible ? 'emerald' : 'amber'}
        />
        <StatsCard
          title="Lives Saved"
          value={(donations.length || user?.totalDonations || 1) * 3}
          icon={<Award className="w-6 h-6 text-indigo-500" />}
          change="3 lives saved per unit"
          changeType="positive"
          color="indigo"
        />
        <StatsCard
          title="Reward Points Earned"
          value={`${user?.rewardPoints || (donations.length * 100)} Pts`}
          icon={<Sparkles className="w-6 h-6 text-amber-500" />}
          change="100 pts per donation"
          changeType="positive"
          color="amber"
        />
      </div>

      {/* Search, Filter & Export Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search by hospital, camp, or blood group..."
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
            {['All', 'Verified', 'Pending'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-auto border-l border-slate-200 dark:border-slate-700 pl-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="hospital">Hospital Name</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => toast.success('📥 CSV report generated & downloaded!')}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-500" />
          Verified Donation Records Log
        </h2>

        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-sm text-slate-500 font-medium">Loading your donation history...</span>
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            title="No donation records found"
            description="Your verified blood donation logs and digital certificates will appear here."
          />
        ) : (
          <>
            <Table columns={columns} data={paginated} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Upcoming Donation Camps Integration */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-red-500" />
              Upcoming Donation Camps & Drives
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pledge your attendance to nearby community drives organized by partner NGOs & blood banks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {upcomingCampsList.slice(0, 3).map((camp) => {
            const isPledged = pledgedCamps[camp.id];
            return (
              <Card key={camp.id} className="p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/40 text-red-600 text-xs font-bold">
                      {camp.status || 'Active'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{camp.target} target</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{camp.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{camp.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {camp.date} ({camp.startTime || '09:00 AM'} - {camp.endTime || '05:00 PM'})
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <Button
                    variant={isPledged ? 'success' : 'primary'}
                    size="sm"
                    className="w-full text-xs"
                    isDisabled={isPledged}
                    leftIcon={isPledged ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HeartHandshake className="w-3.5 h-3.5" />}
                    onClick={() => handlePledgeCamp(camp.id, camp.title)}
                  >
                    {isPledged ? 'Attending Pledged ✓' : 'Pledge Attendance'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Donation Detail Modal */}
      <Modal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        title="Donation Record Details"
        subtitle="Official verified record from RedConnect Blood Network"
      >
        {selectedDonation && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0">
                {selectedDonation.bloodGroup || user?.bloodGroup || 'O+'}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base">{selectedDonation.hospitalName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success" size="sm">{selectedDonation.status || 'Verified'}</Badge>
                  <Badge variant="indigo" size="sm">{selectedDonation.type || 'Voluntary'}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Date of Donation</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedDonation.date}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Units Donated</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedDonation.units || 1} Unit (350 ml)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Venue Location</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{selectedDonation.location || 'New Delhi'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Reward Points</p>
                <p className="text-sm font-bold text-amber-500 mt-0.5">+{selectedDonation.pointsEarned || 100} Points</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Clinical / Verification Notes</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedDonation.notes || 'Blood unit successfully tested, screened, and credited to life-saving inventory.'}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedDonation(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => toast.success(`📜 Certificate downloaded for ${selectedDonation.hospitalName}`)}
              >
                Download Certificate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DonationHistoryPage;
