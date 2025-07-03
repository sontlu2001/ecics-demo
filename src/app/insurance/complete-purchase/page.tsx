'use client';
import { useState } from 'react';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import ReviewSection from './ReviewSection';
import PersonIcon from '@/components/icons/PersonIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import ImportantNoticeModal from './review-your-detail/modal/ImportantNoticeModal';

export default function Page() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEditClick = (key: string) => {
    toggleSection(key);
  };

  const sharedData = [
    { title: 'Policy Start Date', value: '15/12/2024' },
    { title: 'Policy End Date', value: '15/12/2025' },
    { title: 'No Claim Discount', value: '50%' },
    { title: 'Number of claims in last 3 years', value: '0' },
    { title: 'Vehicle financed by', value: 'DBS Bank' },
  ];

  const sections = [
    {
      key: 'basic',
      title: 'Basic Details',
      description: 'Policy Period NCD No. of claims',
      icon: <BasicDetailsIcon className='text-white' />,
    },
    {
      key: 'vehicle',
      title: 'Vehicle Details',
      description: 'BMW i5 2.2 ST1234B',
      icon: <NewOldReplacementIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Plan',
      description: 'Comprehensive Plan',
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'addons',
      title: 'Add Ons Selected',
      description: 'Additional Named Driver',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
    {
      key: 'owner',
      title: 'Vehicle Owner',
      description: 'BMW i5 2.2 ST1234B',
      icon: <PersonIcon className='text-white' />,
    },
  ];

  return (
    <div>
      <h1 className='mb-4 text-xl font-bold'>Review your details</h1>
      {sections.map((section) => (
        <ReviewSection
          key={section.key}
          title={section.title}
          description={section.description}
          icon={section.icon}
          data={sharedData}
          isExpanded={!!expandedSections[section.key]}
          onToggle={() => handleEditClick(section.key)}
          setShowModal={setShowModal}
        />
      ))}

      {showModal && (
        <div className='fixed bottom-0 left-0 right-0 z-50 animate-slide-up rounded-t-2xl bg-white shadow-lg sm:mx-auto sm:max-w-md'>
          <ImportantNoticeModal onSave={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
