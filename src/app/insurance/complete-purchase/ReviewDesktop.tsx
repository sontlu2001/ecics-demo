import EditIcon from '@/components/icons/EditIcon';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: { title: string; value: any }[];
  isExpanded: boolean;
  onToggle: () => void;
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
}

const ReviewDesktop = (props: Props) => {
  const {
    title,
    description,
    icon,
    data,
    isExpanded,
    onToggle,
    setShowModal,
    editRoute,
  } = props;
  console.log(data, 'chinh13255');
  const router = useRouterWithQuery();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editRoute) {
      router.push(editRoute);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className='mt-6 flex w-full flex-col justify-center gap-4 rounded-2xl border px-6 py-4 shadow-sm'>
      <div className='flex w-full flex-row items-center justify-between'>
        <p className='text-xl font-bold leading-[30px] text-[#0095CE]'>
          {title}
        </p>
        <div
          onClick={handleEditClick}
          className='flex cursor-pointer flex-row items-center gap-2 rounded-[53px] border-[0.5px] border-[#00ADEF] bg-[#00ADEF] px-6 py-3 text-[14px] font-bold leading-4 text-white'
        >
          <EditIcon className='cursor-pointer text-white' size={18} />
          Edit
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {data.map((item, index) => (
          <div key={index} className='flex flex-col gap-2'>
            <p className='text-sm font-semibold leading-6 text-[#000000]'>
              {item.title}
            </p>
            <p className='max-w-[200px] rounded-xl bg-[#0000000D] p-2 text-center text-base font-normal leading-[26px] text-[#535353]'>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ReviewDesktop;
