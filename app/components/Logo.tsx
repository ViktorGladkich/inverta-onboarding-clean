import Image from 'next/image';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-inverta-white.png"
      alt="INVERTA"
      width={200}
      height={60}
      priority
      className={`h-25 w-auto object-contain ${className}`}
    />
  );
}
