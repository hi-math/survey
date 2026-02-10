"use client";

import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import LoginPage from "@/components/LoginPage";
import UserInfoForm from "@/components/UserInfoForm";
import SurveyCompletePage from "@/components/SurveyCompletePage";
import CustomSurvey from "@/components/survey/CustomSurvey";
import type { SurveyData } from "@/types/survey";

const AUTH_NULL_GRACE_MS = 2500;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [needsUserInfo, setNeedsUserInfo] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [initialSurveyData, setInitialSurveyData] = useState<SurveyData | null>(null);

  const pendingNullTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadUserThisSessionRef = useRef(false);

  // Auth Guard 타이밍 해결: getRedirectResult 완료 후에만 onAuthStateChanged 구독.
  // 모바일: "user 있었다가 null"일 때만 유예 시간 적용 (세션 복원/일시적 null로 인한 첫 화면 복귀 방지).
  useEffect(() => {
    if (typeof window === "undefined" || !auth) return;
    setRedirectError(null);

    let unsub: (() => void) | null = null;
    let done = false;

    const clearPendingNull = () => {
      if (pendingNullTimeoutRef.current) {
        clearTimeout(pendingNullTimeoutRef.current);
        pendingNullTimeoutRef.current = null;
      }
    };

    const subscribeAuth = () => {
      if (unsub) return;
      unsub = onAuthStateChanged(auth, (u) => {
        console.log("[구글 로그인] USER:", u ? `${u.uid}` : "null");
        clearPendingNull();
        if (u) {
          hadUserThisSessionRef.current = true;
          setUser(u);
          setLoading(false);
          return;
        }
        // null: 한 번이라도 user가 있었으면 유예 시간 후 로그인 화면 (모바일 일시적 null 대응)
        if (hadUserThisSessionRef.current) {
          pendingNullTimeoutRef.current = setTimeout(() => {
            pendingNullTimeoutRef.current = null;
            hadUserThisSessionRef.current = false;
            setUser(null);
            setLoading(false);
          }, AUTH_NULL_GRACE_MS);
        } else {
          setUser(null);
          setLoading(false);
        }
      });
    };

    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        subscribeAuth();
      }
    }, 3000);

    getRedirectResult(auth)
      .then(async (result) => {
        done = true;
        if (!result?.user) {
          if (result === null) {
            console.log("[구글 로그인] 리다이렉트 복귀 아님 또는 이미 처리됨");
          } else {
            console.log("[구글 로그인] getRedirectResult 결과 없음:", result);
          }
        } else {
          console.log("[구글 로그인] 리다이렉트 성공, user:", result.user.uid);
          try {
            await setDoc(doc(db, "users", result.user.uid), {
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              loginMethod: "google",
              createdAt: new Date(),
            });
          } catch (e) {
            console.error("[구글 로그인] Firestore 저장 실패:", e);
            const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
            setRedirectError(`로그인 후 저장 실패: ${msg}`);
          }
        }
      })
      .catch((err: unknown) => {
        const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : undefined;
        const message = err instanceof Error ? err.message : String(err);
        console.error("[구글 로그인] 리다이렉트 결과 처리 실패:", { err, code, message });
        const detail = code ? `[${code}] ${message}` : message;
        setRedirectError(`구글 로그인 실패. ${detail}`);
      })
      .finally(() => {
        done = true;
        subscribeAuth();
      });

    return () => {
      clearTimeout(timeout);
      clearPendingNull();
      unsub?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setNeedsUserInfo(!snap.exists() || !snap.data()?.displayName);
      } catch {
        setNeedsUserInfo(true);
      }
    };
    check();
  }, [user]);

  const handleSurveySubmit = async (data: SurveyData) => {
    if (!user) return;
    await setDoc(doc(db, "surveys", user.uid), {
      userId: user.uid,
      completedAt: new Date().toISOString(),
      ...data,
    });
    setSurveyCompleted(true);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-main)" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--primary)" }}
          />
          <p className="mt-4" style={{ color: "var(--text)" }}>
            로딩 중...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage initialError={redirectError} onClearError={() => setRedirectError(null)} />;
  }

  if (needsUserInfo) {
    return (
      <UserInfoForm
        userId={user.uid}
        onComplete={() => setNeedsUserInfo(false)}
      />
    );
  }

  if (surveyCompleted) {
    return (
      <SurveyCompletePage
        onEditSurvey={async () => {
          if (!user) return;
          try {
            const snap = await getDoc(doc(db, "surveys", user.uid));
            if (snap.exists()) {
              const raw = snap.data();
              const { userId: _u, completedAt: _t, ...surveyData } = raw;
              setInitialSurveyData(surveyData as SurveyData);
              setSurveyCompleted(false);
            }
          } catch (e) {
            console.error("Failed to load survey for edit:", e);
          }
        }}
        onStartOver={() => {
          setInitialSurveyData(null);
          setSurveyCompleted(false);
        }}
      />
    );
  }

  return (
    <div
      className="min-h-[60vh] w-full max-w-full box-border"
      style={{ padding: "8px" }}
    >
      <CustomSurvey
        key={initialSurveyData ? JSON.stringify(initialSurveyData) : "empty"}
        initialData={initialSurveyData}
        onSubmit={handleSurveySubmit}
      />
    </div>
  );
}
