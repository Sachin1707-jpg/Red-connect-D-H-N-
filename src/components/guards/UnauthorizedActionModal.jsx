import React from 'react';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const UnauthorizedActionModal = ({ isOpen, onClose, requiredRole = 'Admin' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted" subtitle="Permission required for this action">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <p className="font-bold text-slate-900 dark:text-white text-base">Unauthorized Action</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Your current account role does not have permission to execute this feature. Higher level privileges ({requiredRole}) are required.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <Button variant="ghost" onClick={onClose} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="primary" onClick={onClose}>
            Request Permission
          </Button>
        </div>
      </div>
    </Modal>
  );
};
