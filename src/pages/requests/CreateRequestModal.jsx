import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Droplets, Building2, User, Phone, Calendar, MapPin, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { createBloodRequest } from '../../redux/requestSlice';

const schema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  hospitalName: z.string().min(2, 'Hospital name is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  unitsRequired: z.coerce.number().min(1).max(20),
  priority: z.enum(['Emergency', 'High', 'Medium']),
  requiredDate: z.string().min(1, 'Required date is needed'),
  location: z.string().min(2, 'Location is required'),
  hospitalContact: z.string().min(7, 'Valid contact number required'),
  description: z.string().optional(),
});

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CreateRequestModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'High', unitsRequired: 1 }
  });

  const onSubmit = async (data) => {
    const result = await dispatch(createBloodRequest({ ...data, urgency: data.priority }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('🩸 Emergency blood request created and broadcast to nearby donors!');
      reset();
      onClose();
    } else {
      toast.error('Failed to create request. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Emergency Blood Request" subtitle="This will be broadcast to compatible donors immediately" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Patient Name / ID" placeholder="John Doe (ICU Bed 4)" leftIcon={<User className="w-4 h-4" />} error={errors.patientName?.message} required {...register('patientName')} />
          <Input label="Hospital Name" placeholder="City General Hospital" leftIcon={<Building2 className="w-4 h-4" />} error={errors.hospitalName?.message} required {...register('hospitalName')} />

          <Select label="Blood Group" options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))} leftIcon={<Droplets className="w-4 h-4" />} error={errors.bloodGroup?.message} required {...register('bloodGroup')} />
          <Input label="Units Required" type="number" placeholder="2" leftIcon={<Droplets className="w-4 h-4" />} error={errors.unitsRequired?.message} required {...register('unitsRequired')} />

          <Select label="Priority Level" options={[{ value: 'Emergency', label: '🚨 Emergency — Critical' }, { value: 'High', label: '🔴 High Urgency' }, { value: 'Medium', label: '🟡 Medium' }]} error={errors.priority?.message} required {...register('priority')} />
          <Input label="Required By Date" type="date" leftIcon={<Calendar className="w-4 h-4" />} error={errors.requiredDate?.message} required {...register('requiredDate')} />

          <Input label="Hospital Location" placeholder="Metropolis, Sector 4" leftIcon={<MapPin className="w-4 h-4" />} error={errors.location?.message} required {...register('location')} />
          <Input label="Hospital Contact" type="tel" placeholder="+1-555-0199" leftIcon={<Phone className="w-4 h-4" />} error={errors.hospitalContact?.message} required {...register('hospitalContact')} />
        </div>

        <Textarea label="Clinical Notes / Description" placeholder="Describe patient condition, surgery type, and any other relevant details for donors..." rows={3} {...register('description')} />

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Once submitted, this request will be broadcast to all compatible donors within a 25km radius. Ensure all contact details are accurate.</span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="emergency" leftIcon={<AlertTriangle className="w-4 h-4" />} isLoading={isSubmitting}>
            Dispatch Emergency Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRequestModal;
