import { HiOutlineX } from 'react-icons/hi'

type tagProps = {
  text: string,
  className?: string,
  onClick? : (arg0: string) => void,
  onDelete? : (arg0: string) => void
}

export default function Tag(props: tagProps) {
  return (
    <div className={`mx-1 mb-1 ${props.className}`}>
      <div className="bg-gray-200 px-1 border border-gray-400 text-xs rounded-full flex flex-row items-center hover:drop-shadow-md cursor-default">
        <p className='pl-0.5 mr-1' onClick={() => props.onClick?.(props.text)}>{props.text}</p>
        <HiOutlineX className='hover:bg-gray-300 rounded-full p-px' onClick={() => props.onDelete?.(props.text)} />
      </div>
    </div>
  );
}