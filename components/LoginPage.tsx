'use client';

import { useState } from 'react';
import { signInWithPopup, signInAnonymously, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Set session persistence (logout on browser close)
      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, googleProvider);

      // Store user info in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        loginMethod: 'google',
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Google login error:', err);
      setError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId.trim() || !name.trim()) {
      setError('학번과 이름을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Set session persistence (logout on browser close)
      await setPersistence(auth, browserSessionPersistence);

      // Sign in anonymously
      const result = await signInAnonymously(auth);

      // Store manual login info in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        studentId: studentId.trim(),
        displayName: name.trim(),
        loginMethod: 'manual',
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Manual login error:', err);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E0DDD8' }}>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1E3A63' }}>
            강의 전 설문
          </h1>
          <p className="leading-relaxed text-sm md:text-base" style={{ color: '#1E3A63' }}>
            강의는 함께 만들어나가는 것입니다. 여러분의 현재 상황을 솔직하게 응답해주시면
            그 결과를 반영하여 강의 수준 및 방법을 최대한 맞춰보겠습니다.
            설문 응답으로 알게 된 개인 정보는 절대 유출하지 않겠습니다.
            이번 학기 강의를 함께 즐겁고 의미있는 시간으로 만들어가봅시다.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {!showManualLogin ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{ borderColor: '#6B8EA6' }}
              className="w-full bg-white border-2 font-semibold py-4 px-6 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? '로그인 중...' : '구글 계정으로 로그인'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <button
              onClick={() => setShowManualLogin(true)}
              style={{ backgroundColor: '#6B8EA6', color: 'white' }}
              className="w-full font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-all duration-200"
            >
              학번과 이름으로 로그인
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualLogin} className="space-y-4">
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowManualLogin(false);
                  setError('');
                  setStudentId('');
                  setName('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
                disabled={isLoading}
              >
                뒤로
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: '#1E3A63', color: '#ffffff' }}
                className="flex-1 font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
