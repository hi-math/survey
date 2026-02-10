"use client";

interface SurveyClipboardIconProps {
  className?: string;
  size?: number;
}

/** 스크린샷의 클립보드+체크리스트 느낌 아이콘 */
export default function SurveyClipboardIcon({ className = "", size = 48 }: SurveyClipboardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 클립보드 본체 - 오렌지 */}
      {/* 클립보드 본체 */}
      <path
        d="M34 8h-4V6a2 2 0 00-4 0v2h-4a2 2 0 00-2 2v32a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2z"
        fill="var(--primary)"
      />
      <rect x="22" y="4" width="4" height="6" rx="1" fill="var(--primary)" opacity={0.85} />
      {/* 체크리스트 줄 */}
      <path d="M14 22h20v2H14v-2z" fill="var(--secondary)" opacity={0.9} />
      <path d="M14 28h16v2H14v-2z" fill="var(--secondary)" opacity={0.9} />
      <path d="M14 34h12v2H14v-2z" fill="var(--secondary)" opacity={0.9} />
      {/* 체크 마크 */}
      <path
        d="M12 22l2 2 4-4"
        stroke="var(--secondary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
