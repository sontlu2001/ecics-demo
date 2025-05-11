const PremiumDown = () => {
  return (
    <div className='flex flex-col gap-4 px-6'>
      <div className='flex flex-col gap-4 rounded-md border border-gray-300 px-8 py-2 shadow-md'>
        <p className='text-center text-2xl font-bold leading-[36px] text-[#171A1F]'>
          Premium breakdown
        </p>
        <div className='flex flex-col border-b border-[#E4E4E4] pb-2'>
          <div className='flex flex-row justify-between font-normal leading-[30px] text-[#171A1F]'>
            <p>Comprehensive Plan</p>
            <p>SGD 3500</p>
          </div>
          <div className='flex flex-row justify-between font-semibold leading-[30px] text-[#00ADEF]'>
            <p>CAR15 Coupon Discount</p>
            <p>-SGD 1000</p>
          </div>
        </div>

        <div className='flex flex-col border-b border-[#E4E4E4] pb-2'>
          <div className='flex flex-row justify-between font-normal leading-[30px] text-[#171A1F]'>
            <p>Discounted Premium</p>
            <p>SGD 2500</p>
          </div>
        </div>

        <div className='flex flex-col border-b border-[#E4E4E4] pb-2'>
          <p className='text-xl font-bold'>Add-on</p>
          <div className='flex flex-row justify-between font-normal leading-[30px] text-[#171A1F]'>
            <p>Additional Named Driver</p>
            <p>SGD 200</p>
          </div>
        </div>

        <div className='flex flex-col border-b border-[#E4E4E4] pb-2'>
          <div className='flex flex-row justify-between font-normal leading-[30px] text-[#171A1F]'>
            <p>Net Premium</p>
            <p>SGD 2700</p>
          </div>
          <div className='flex flex-row justify-between font-semibold leading-[30px] text-[#00ADEF]'>
            <p>9% GST</p>
            <p>SGD 185</p>
          </div>
        </div>

        <div className='flex flex-col border-b border-[#E4E4E4] pb-2'>
          <div className='flex flex-row justify-between font-bold leading-[30px] text-[#171A1F]'>
            <p>Total (including GST)</p>
            <p>SGD 2985</p>
          </div>
        </div>
        <button className='mb-4 w-full rounded-[10px] bg-[#00ADEF] py-4 text-[20px] font-bold leading-[21px] text-white'>
          Pay
        </button>
      </div>
    </div>
  );
};

export default PremiumDown;
