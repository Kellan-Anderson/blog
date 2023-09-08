import { AiOutlineLoading } from 'react-icons/ai'

export default function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <AiOutlineLoading size={72} color='blue' className='animate-spin h-96' />
    </div>
  );
}