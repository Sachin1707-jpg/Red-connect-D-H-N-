import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus, Edit3, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateInventoryUnit } from '../../redux/hospitalSlice';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

const HospitalInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((s) => s.hospital.inventory);

  const handleUpdate = (group, delta) => {
    const current = inventory[group] || 0;
    const next = Math.max(0, current + delta);
    dispatch(updateInventoryUnit({ group, units: next }));
    toast.success(`Updated ${group} stock to ${next} units`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="w-7 h-7 text-primary" />
          Blood Bank Stock Inventory Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time stock matrix for all 8 blood groups with threshold alerts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(inventory).map(([group, count]) => {
          const isLow = count <= 5;
          return (
            <motion.div key={group} whileHover={{ y: -2 }}>
              <Card className={`relative overflow-hidden ${isLow ? 'border-red-400 dark:border-red-800' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                    {group}
                  </div>
                  <Badge variant={isLow ? 'danger' : 'success'} pulse={isLow}>
                    {isLow ? 'CRITICAL LOW' : 'STOCK NORMAL'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Available Stock</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white mt-1">{count} <span className="text-sm font-medium text-slate-400">units</span></p>

                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleUpdate(group, -1)}>
                    <Minus className="w-4 h-4" /> Remove Unit
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleUpdate(group, 1)}>
                    <Plus className="w-4 h-4" /> Add Unit
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalInventory;
