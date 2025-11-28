import { HashLoader, MoonLoader, ClipLoader, ClockLoader, SyncLoader, BeatLoader } from 'react-spinners';

interface Loading {
  text?: string;
}

export const IsLoadingBranding = () => {
  return (
    <div className='flex flex-col items-center gap-5 my-5'>
      <HashLoader color={'#574D68'} loading={true} size={150} />
      <div className="flex flex-col items-center">
        <h1 className='text-[#574D68] font-bold text-xl'>Memuat Data Branding Website</h1>
        <p className='text-[#413751] font-light text-sm'>Jika loading lebih dari 10 detik, reload halaman</p>
      </div>
    </div>
  );
};

export const MoonLoading: React.FC<Loading> = ({ text }) => {
  return (
    <div className='flex flex-col items-center gap-5 my-5'>
      <MoonLoader color={'#00BC7D'} loading={true} size={100} />
      <div className="flex flex-col items-center">
        <h1 className='text-[#00BC7D] font-bold text-xl'>{text || "Loading..."}</h1>
      </div>
    </div>
  );
};

export const HashLoading: React.FC<Loading> = ({ text }) => {
  return (
    <div className='flex flex-col items-center gap-5 my-5'>
      <HashLoader color={'#2B7FFF'} loading={true} size={100} />
      <div className="flex flex-col items-center">
        <h1 className='text-[#2B7FFF] font-bold text-xl'>{text || "Loading..."}</h1>
      </div>
    </div>
  );
};
export const LoadingBeat = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <BeatLoader color="#1f2937" loading={loading} size={20} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};
export const LoadingClip = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <ClipLoader color="#1f2937" loading={loading} size={50} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

export const LoadingSync = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <SyncLoader color="#1f2937" loading={loading} size={10} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

export const LoadingClock = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <ClockLoader color="#1f2937" loading={loading} size={50} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};

interface LoadingButton {
  color?: string;
}
export const LoadingButton: React.FC<LoadingButton> = ({ color }) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      <ClipLoader loading={true} color="white" size={15} />
    </div>
  );
};