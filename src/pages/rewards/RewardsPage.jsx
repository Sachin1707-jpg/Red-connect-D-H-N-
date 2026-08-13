import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Lock, Gift, Crown, Zap, Shield, Droplet } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { fetchRewards, fetchBadges, fetchLeaderboard, redeemVoucher } from '../../redux/rewardSlice';
import { Avatar } from '../../components/common/Avatar';

const ICON_MAP = { Droplet: Droplet, Zap: Zap, Award: Award, Shield: Shield, Crown: Crown, Star: Star };

const RewardsPage = () => {
  const dispatch = useDispatch();
  const { vouchers, badges, leaderboard, pointsBalance } = useSelector((s) => s.rewards);
  const { user } = useSelector((s) => s.auth);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    dispatch(fetchRewards());
    dispatch(fetchBadges());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleRedeem = async (voucher) => {
    if (pointsBalance < voucher.pointsCost) {
      toast.error(`Insufficient points. You need ${voucher.pointsCost - pointsBalance} more points.`);
      return;
    }
    setRedeeming(voucher.id);
    const result = await dispatch(redeemVoucher(voucher.id));
    setRedeeming(null);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`🎁 Voucher redeemed! Code: ${voucher.code}`);
    }
  };

  // Level progress
  const maxPoints = 1000;
  const progress = Math.min((pointsBalance / maxPoints) * 100, 100);
  const level = Math.floor(pointsBalance / 200) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Rewards & Achievements</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Earn points by donating blood. Redeem for health rewards and recognition.</p>
      </div>

      {/* Points Overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wide">Your Rewards Balance</p>
            <p className="text-5xl font-black mt-1">{pointsBalance.toLocaleString()}</p>
            <p className="text-slate-400 text-sm">Points Available for Redemption</p>
          </div>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-semibold">Level {level} — Lifesaver</span>
              <span className="text-amber-400 font-bold">{pointsBalance}/{maxPoints} pts</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">{maxPoints - pointsBalance} points to Level {level + 1}</p>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievement Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, i) => {
            const Icon = ICON_MAP[badge.icon] || Award;
            return (
              <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Card className={`text-center relative ${!badge.unlocked ? 'opacity-50' : ''}`}>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl z-10">
                      <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg shadow-amber-400/30'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    <Icon className={`w-7 h-7 ${badge.unlocked ? 'text-amber-900' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{badge.title}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{badge.description}</p>
                  {badge.unlocked && badge.date && (
                    <p className="text-[10px] text-emerald-500 font-semibold mt-1">Earned {badge.date}</p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vouchers */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Redeem Health & Wellness Rewards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vouchers.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`flex items-start gap-4 ${!v.unlocked ? 'opacity-60' : ''}`}>
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-primary shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{v.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{v.partner}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{v.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="warning" size="sm">⭐ {v.pointsCost} pts</Badge>
                    {v.unlocked ? (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={redeeming === v.id}
                        isDisabled={pointsBalance < v.pointsCost}
                        onClick={() => handleRedeem(v)}
                      >
                        {pointsBalance >= v.pointsCost ? 'Redeem' : `Need ${v.pointsCost - pointsBalance} more`}
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" isDisabled leftIcon={<Lock className="w-3.5 h-3.5" />}>Locked</Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          Community Leaderboard — Top Donors
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {leaderboard.map((donor, i) => (
            <div key={donor.rank} className={`flex items-center gap-4 p-4 ${i < leaderboard.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/60' : ''} ${donor.name === user?.name ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                donor.rank === 1 ? 'bg-amber-400 text-amber-900' :
                donor.rank === 2 ? 'bg-slate-300 text-slate-700' :
                donor.rank === 3 ? 'bg-amber-700/60 text-amber-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {donor.rank <= 3 ? ['🥇', '🥈', '🥉'][donor.rank - 1] : donor.rank}
              </div>
              <Avatar src={donor.avatar} name={donor.name} size="md" bloodGroup={donor.bloodGroup} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${donor.name === user?.name ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                  {donor.name} {donor.name === user?.name && '(You)'}
                </p>
                <p className="text-xs text-slate-500">{donor.donations} donations · {donor.livesSaved} lives saved</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-amber-500">{donor.points.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
