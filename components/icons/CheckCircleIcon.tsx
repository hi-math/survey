"use client";

interface CheckCircleIconProps {
  className?: string;
  size?: number;
}

export default function CheckCircleIcon({ className = "", size = 64 }: CheckCircleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="30" fill="var(--primary)" opacity={0.2} />
      <circle cx="32" cy="32" r="24" fill="var(--primary)" />
      <path
        d="M20 32l8 8 16-16"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
