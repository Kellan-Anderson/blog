export function Dot({ className } : { className?: string }) {
  return (
    <div className={`h-1 w-1 rounded-full bg-slate-500 ${className ?? ''}`}></div>
  );
}