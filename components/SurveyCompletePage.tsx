'use client';

import CheckCircleIcon from '@/components/icons/CheckCircleIcon';

interface SurveyCompletePageProps {
  onEditSurvey: () => void;
  onStartOver: () => void;
}

export default function SurveyCompletePage({ onEditSurvey, onStartOver }: SurveyCompletePageProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 pb-10" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="page-frame w-full max-w-md">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon size={72} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            감사합니다!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            소중한 의견 감사드립니다.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onEditSurvey}
              className="w-full font-semibold py-3.5 px-6 rounded-xl border-2 transition-opacity hover:opacity-90"
              style={{
                borderColor: 'var(--secondary)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--secondary)',
              }}
            >
              설문 수정하기
            </button>
            <button
              type="button"
              onClick={onStartOver}
              className="w-full font-semibold py-3.5 px-6 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              처음으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
