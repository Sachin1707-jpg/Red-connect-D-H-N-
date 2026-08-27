import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Award, Star, Trophy, Lock, Gift, Crown, Zap, Shield, Droplet, CheckCircle2,
  Copy, Sparkles, ExternalLink, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/common/Avatar';
import {
  fetchRewards, fetchBadges, fetchLeaderboard, fetchUserPoints,
  redeemVoucher, clearRedeemedCode
} from '../../redux/rewardSlice';
import { updateUserLocal } from '../../redux/authSlice';
import { mockBadges, mockVouchers, mockLeaderboard } from '../../data/mockData';

const ICON_MAP = { Droplet: Droplet, Zap: Zap, Award: Award, Shield: Shield, Crown: Crown, Star: Star };

const RewardsPage = () => {
  const dispatch = useDispatch();
  const { vouchers = [], badges = [], leaderboard = [], pointsBalance, redeemedCode } = useSelector((s) => s.rewards);
  const { user } = useSelector((s) => s.auth);

  const [redeeming, setRedeeming] = useState(null);
  const [activeVoucherModal, setActiveVoucherModal] = useState(null);

  useEffect(() => {
    dispatch(fetchRewards());
    dispatch(fetchBadges());
    dispatch(fetchLeaderboard());
    dispatch(fetchUserPoints());
  }, [dispatch]);

  // Combined points balance from profile or Redux
  const effectivePoints = user?.rewardPoints !== undefined ? user.rewardPoints : (pointsBalance || 500);

  const activeVouchers = vouchers && vouchers.length > 0 ? vouchers : mockVouchers;
  const activeBadges = badges && badges.length > 0 ? badges : mockBadges;
  const activeLeaderboard = leaderboard && leaderboard.length > 0 ? leaderboard : mockLeaderboard;

  // Level progress
  const maxPoints = 1000;
  const progress = Math.min((effectivePoints / maxPoints) * 100, 100);
  const level = Math.floor(effectivePoints / 200) + 1;

  const handleRedeem = async (voucher) => {
    if (effectivePoints < voucher.pointsCost) {
      toast.error(`Insufficient points. You need ${voucher.pointsCost - effectivePoints} more points to redeem.`);
      return;
    }

    setRedeeming(voucher.id);
    try {
      const res = await dispatch(redeemVoucher({ id: voucher.id, pointsCost: voucher.pointsCost })).unwrap();
      
      // Deduct points from local user state as well
      const newBalance = Math.max(0, effectivePoints - voucher.pointsCost);
      dispatch(updateUserLocal({ rewardPoints: newBalance }));

      setActiveVoucherModal({
        title: voucher.title,
        partner: voucher.partner,
        code: res?.reward?.code || voucher.code || 'RC-APL-2026',
        description: voucher.description,
      });

      toast.success(`🎁 Voucher redeemed! You earned ${voucher.title}`);
    } catch (err) {
      toast.error(err.message || 'Redeem failed. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Voucher code copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-500" />
          Rewards & Achievements Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Earn points by pledging blood donations and attending camps. Redeem points for free health check-ups and wellness discounts.
        </p>
      </div>

      {/* Points Overview Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-amber-400" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Level {level} Lifesaver Status
            </div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Your Rewards Balance</p>
            <p className="text-5xl font-black mt-1 text-amber-400">{effectivePoints.toLocaleString()} <span className="text-xl text-slate-300 font-normal">Pts</span></p>
            <p className="text-slate-400 text-xs mt-1">Available for instant voucher redemption</p>
          </div>

          <div className="w-full md:w-72">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-300 font-semibold">Tier Progress</span>
              <span className="text-amber-400 font-bold">{effectivePoints}/{maxPoints} pts</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Next Rank: Master Donor</span>
              <span className="text-amber-300 font-semibold">{Math.max(0, maxPoints - effectivePoints)} pts needed</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Achievement Badges ({activeBadges.filter(b => b.unlocked).length}/{activeBadges.length} Unlocked)
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeBadges.map((badge, i) => {
            const IconComponent = ICON_MAP[badge.icon] || Award;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`text-center relative p-4 h-full flex flex-col justify-between ${!badge.unlocked ? 'opacity-60 bg-slate-50 dark:bg-slate-800/50' : 'border-amber-200 dark:border-amber-900/40'}`}>
                  {!badge.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2 shadow-sm ${
                        badge.unlocked
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-300 shadow-amber-400/30'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 ${badge.unlocked ? 'text-amber-950' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{badge.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{badge.description}</p>
                  </div>
                  {badge.unlocked && badge.date && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {badge.date}
                    </p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vouchers & Rewards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-600" />
          Redeem Health & Wellness Vouchers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeVouchers.map((v, i) => {
            const canAfford = effectivePoints >= v.pointsCost;
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="flex flex-col justify-between h-full p-5 hover:shadow-md transition-all border border-slate-200 dark:border-slate-700">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 shrink-0">
                        <Gift className="w-6 h-6" />
                      </div>
                      <Badge variant="warning" size="sm" className="font-bold">
                        ⭐ {v.pointsCost} Pts
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{v.title}</h3>
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">{v.partner}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{v.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-3">
                    <Button
                      variant={canAfford ? 'primary' : 'outline'}
                      size="sm"
                      className="w-full text-xs"
                      isLoading={redeeming === v.id}
                      isDisabled={!canAfford}
                      onClick={() => handleRedeem(v)}
                    >
                      {canAfford ? 'Redeem Voucher' : `Need ${v.pointsCost - effectivePoints} more pts`}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Community Leaderboard */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          Community Lifesaver Leaderboard — Top Donors
        </h2>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {activeLeaderboard.map((donor, i) => {
            const isCurrentUser = user && (donor.name === user.name || donor.id === user.id);
            return (
              <div
                key={donor.rank || i}
                className={`flex items-center gap-4 p-4 ${
                  i < activeLeaderboard.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/60' : ''
                } ${isCurrentUser ? 'bg-red-50 dark:bg-red-950/20 font-semibold' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    donor.rank === 1
                      ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30'
                      : donor.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : donor.rank === 3
                      ? 'bg-amber-700/60 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {donor.rank <= 3 ? ['🥇', '🥈', '🥉'][donor.rank - 1] : `#${donor.rank}`}
                </div>

                <Avatar src={donor.avatar} name={donor.name} size="md" bloodGroup={donor.bloodGroup} />

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isCurrentUser ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                    {donor.name} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {donor.donations} verified donations · {donor.livesSaved} lives saved
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-amber-500">{donor.points.toLocaleString()} Pts</p>
                  <Badge variant="indigo" size="sm" className="mt-0.5">
                    {donor.bloodGroup || 'O+'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voucher Code Reveal Modal */}
      <Modal
        isOpen={!!activeVoucherModal}
        onClose={() => setActiveVoucherModal(null)}
        title="Voucher Redeemed Successfully! 🎉"
        subtitle={activeVoucherModal?.partner}
      >
        {activeVoucherModal && (
          <div className="space-y-4 text-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 text-amber-950 space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-amber-950/10 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6 text-amber-950" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Digital Claim Code</p>
                <h3 className="text-lg font-black text-amber-950">{activeVoucherModal.title}</h3>
              </div>

              <div className="p-4 rounded-xl bg-white/80 backdrop-blur-md border border-amber-500/30 flex items-center justify-between gap-3">
                <span className="font-mono text-lg font-black tracking-widest text-slate-900">{activeVoucherModal.code}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(activeVoucherModal.code)}>
                  <Copy className="w-4 h-4 text-slate-700" /> Copy
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-left">
              {activeVoucherModal.description} Present this claim code at partner desk or apply during online checkout.
            </p>

            <Button
              variant="primary"
              className="w-full"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setActiveVoucherModal(null)}
            >
              Done, Close Voucher
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RewardsPage;
