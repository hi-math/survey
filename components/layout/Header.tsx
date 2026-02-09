'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function Header() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user info from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.displayName || '사용자');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  // Only show header if user is logged in
  if (!userName) {
    return null;
  }

  return (
    <header style={{ backgroundColor: '#1E3A63' }} className="shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: '#E0DDD8' }}>접속자:</span>
          <span className="font-semibold" style={{ color: '#F5B963' }}>{userName}</span>
        </div>
      </div>
    </header>
  );
}
