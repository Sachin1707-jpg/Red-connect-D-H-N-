import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Droplets, Shield, Award, Calendar, ArrowLeft, ShieldOff, Trash2, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = {
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1-555-0147',
    role: 'donor',
    status: 'Active',
    bloodGroup: 'O-',
    age: 28,
    address: 'Metropolis Central Sector 4',
    totalDonations: 8,
    livesSaved: 24,
    points: 850,
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
        Back to Users List
      </Button>

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="xl" bloodGroup={user.bloodGroup} />
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h1>
              <p className="text-xs text-slate-500">{user.email} · {user.phone}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="blood" size="sm">{user.bloodGroup}</Badge>
                <Badge variant="info" size="sm" className="capitalize">{user.role}</Badge>
                <Badge variant={user.status === 'Active' ? 'success' : 'danger'} size="sm">{user.status}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="warning" size="sm" leftIcon={<ShieldOff className="w-3.5 h-3.5" />} onClick={() => toast.success('User suspended (demo)')}>
              Suspend
            </Button>
            <Button variant="outline" size="sm" leftIcon={<Key className="w-3.5 h-3.5" />} onClick={() => toast.success('Password reset email sent!')}>
              Reset Pass
            </Button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Personal & Contact Info</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Full Name</span><span className="font-bold text-slate-900 dark:text-white">{user.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-bold text-slate-900 dark:text-white">{user.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-bold text-slate-900 dark:text-white">{user.phone}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-bold text-slate-900 dark:text-white">{user.address}</span></div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Donation Activity</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Total Donations</span><span className="font-bold text-slate-900 dark:text-white">{user.totalDonations}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Lives Saved</span><span className="font-bold text-emerald-500 font-bold">{user.livesSaved}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Reward Points</span><span className="font-bold text-amber-500">{user.points} pts</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailsPage;
