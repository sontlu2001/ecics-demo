'use client';

import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';

import AddOnRowDetail from './AddOnRowDetail';

const mapIconToTypeAddOn = [
  {
    type: 'key',
    icon: <KeyIcon className='text-brand-blue' />,
    isRecommended: true,
    title: 'Key Replacement Cover',
  },
  {
    type: 'repair',
    icon: <RepairIcon className='text-brand-blue' />,
    title: 'Repair at Any Workshop',
  },
  {
    type: 'roadside',
    icon: <RoadSideIcon className='text-brand-blue' />,
    title: '24/7 Road side assistance',
  },
  {
    type: 'enhanced-accident',
    icon: <EnhancedAccidentIcon className='text-brand-blue' />,
    title: 'Enhanced Accident Coverage',
  },
  {
    type: 'personal-accident',
    icon: <PersonalAccidentIcon className='text-brand-blue' />,
    title: 'Personal Accident +',
  },
  {
    type: 'new-old-replacement',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
];

function AddOnPage() {
  return (
    <div className='px-4'>
      <div className='text-xl font-bold'>Select Add On</div>
      <div className='mt-4 flex flex-col gap-4'>
        {mapIconToTypeAddOn.map((item) => (
          <AddOnRowDetail
            key={item.type}
            title={item.title}
            icon={item.icon}
            isRecommended={item.isRecommended}
          />
        ))}
      </div>
    </div>
  );
}

export default AddOnPage;
