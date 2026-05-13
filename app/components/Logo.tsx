import Image from 'next/image';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-inverta-white.png"
      alt="INVERTA"
      width={140}
      height={42}
      priority
      className={`h-7 w-auto object-contain ${className}`}
    />
  );
}
