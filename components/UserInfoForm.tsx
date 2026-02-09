'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserInfoFormProps {
  userId: string;
  onComplete: () => void;
}

export default function UserInfoForm({ userId, onComplete }: UserInfoFormProps) {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim()) {
      setError('학번과 이름을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Update user info in Firestore
      await updateDoc(doc(db, 'users', userId), {
        studentId: studentId.trim(),
        displayName: name.trim(),
        updatedAt: new Date(),
      });

      onComplete();
    } catch (err) {
      console.error('Error updating user info:', err);
      setError('정보 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E0DDD8' }}>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1E3A63' }}>
            추가 정보 입력
          </h1>
          <p className="leading-relaxed text-sm md:text-base" style={{ color: '#1E3A63' }}>
            설문 진행을 위해 학번과 이름을 입력해주세요.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
              학번
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={{ borderColor: '#6B8EA6' }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
              placeholder="학번을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderColor: '#6B8EA6' }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
              placeholder="이름을 입력하세요"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: '#1E3A63', color: '#ffffff' }}
            className="w-full font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? '저장 중...' : '계속하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
