type Props = {
  title: string;
  data: { label: string; value: string }[];
  extraTitle?: string;
};
const InfoCard = (props: Props) => {
  const { title, data, extraTitle } = props;
  return (
    <div className='w-full rounded-[10px] border border-[#EDEDED] shadow-[0px_4px_20px_0px_#00000014]'>
      <p className='rounded-t-[10px] border border-[#00ADEF] bg-[#F4FBFD] px-4 py-3 text-base font-semibold'>
        {title}
      </p>
      <div className='flex flex-col gap-2 px-4 py-3'>
        {extraTitle && <p className='text-sm font-semibold'>{extraTitle}</p>}
        {data.map((item: any, index: any) => (
          <div key={index} className='flex flex-row justify-between'>
            <p>{item.label}</p>
            <p className={item.label === 'Address' ? 'text-right' : ''}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
