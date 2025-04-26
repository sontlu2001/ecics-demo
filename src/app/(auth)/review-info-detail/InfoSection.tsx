import React from 'react';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

type InfoSectionProps = {
  title: string;
  data: { label: string; value: string }[];
  boxClass?: string;
};

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  data,
  boxClass = '',
}) => {
  const { isMobile } = useDeviceDetection();
  const renderGrid = () => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk = data.slice(i, i + 2);
      chunks.push(
        <div key={i} className='mt-2 grid grid-cols-2 gap-4'>
          {chunk.map((item, idx) => (
            <div key={idx}>
              <div className='text-sm font-bold'>{item.label}</div>
              <div className='text-sm'>{item.value}</div>
            </div>
          ))}
        </div>,
      );
    }
    return chunks;
  };

  return (
    <div
      className={`${isMobile ? '' : 'rounded-md border border-gray-300 bg-white p-4'} mt-4 ${boxClass}`}
    >
      <div className='text-base font-bold underline underline-offset-4'>
        {title}
      </div>
      {renderGrid()}
    </div>
  );
};

export default InfoSection;
