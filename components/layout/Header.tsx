'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Header() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShow(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!show) return null;

  return (
    <header
      className="w-full header-bar pt-5 pb-14 rounded-b-3xl"
      style={{ backgroundColor: "var(--shade-bg)" }}
    >
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: "var(--header-title)" }}
          aria-hidden
        />
        <span className="font-bold text-2xl header-title">
          강의 전 설문
        </span>
        <span
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm"
          aria-hidden
        >
          <img
            src="/chat.svg"
            alt=""
            className="w-7 h-7 object-contain"
            width={28}
            height={28}
          />
        </span>
      </div>
    </header>
  );
}
