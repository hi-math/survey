"use client";

import { useState, useCallback } from "react";
import type { SurveyData } from "@/types/survey";
import { MATRIX_ROWS } from "@/lib/survey-data";
import SurveySection1 from "./SurveySection1";
import SurveySection2 from "./SurveySection2";

interface CustomSurveyProps {
  initialData?: SurveyData | null;
  /** 구글 로그인 시 true → 설문 맨 앞에 학번/이름 수집 페이지 표시 */
  collectStudentInfo?: boolean;
  onSubmit: (data: SurveyData) => Promise<void>;
}

export default function CustomSurvey({
  initialData,
  collectStudentInfo = false,
  onSubmit,
}: CustomSurveyProps) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<SurveyData>(() => ({
    studentId: initialData?.studentId ?? "",
    displayName: initialData?.displayName ?? "",
    reason: initialData?.reason ?? [],
    reasonOther: initialData?.reasonOther ?? "",
    expectation: initialData?.expectation ?? [],
    expectationOther: initialData?.expectationOther ?? "",
    highschool_science: initialData?.highschool_science ?? [],
    highschool_scienceOther: initialData?.highschool_scienceOther ?? "",
    university_courses: initialData?.university_courses ?? "",
    science_interest: initialData?.science_interest ?? "",
    science_attitude: initialData?.science_attitude ?? {},
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateData = useCallback((partial: Partial<SurveyData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(partial).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const validateStudentInfo = (): boolean => {
    if (!collectStudentInfo) return true;
    const err: Record<string, string> = {};
    if (!(data.studentId ?? "").trim()) err.studentId = "학번을 입력해 주세요.";
    if (!(data.displayName ?? "").trim()) err.displayName = "이름을 입력해 주세요.";
    setErrors((prev) => ({ ...prev, ...err }));
    return Object.keys(err).length === 0;
  };

  const validateSection1 = (): boolean => {
    const err: Record<string, string> = {};
    if (!data.reason?.length) err.reason = "1번 문항에 응답해 주세요.";
    if (!data.expectation?.length) err.expectation = "2번 문항에 응답해 주세요.";
    if (!data.highschool_science?.length)
      err.highschool_science = "3번 문항에 응답해 주세요.";
    const courses = (data.university_courses ?? "").trim();
    if (!courses) err.university_courses = "4번 문항에 응답해 주세요.";
    const interest = (data.science_interest ?? "").trim();
    if (!interest) err.science_interest = "5번 문항에 응답해 주세요.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateSection2 = (): boolean => {
    const missing = MATRIX_ROWS.filter(
      (r) => !data.science_attitude?.[r.value as keyof typeof data.science_attitude]
    );
    if (missing.length > 0) {
      setErrors({
        science_attitude: "모든 문항에 응답해 주세요. (미응답 행이 있습니다)",
      });
      return false;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.science_attitude;
      return next;
    });
    return true;
  };

  const handleNext = () => {
    if (collectStudentInfo && page === 0) {
      if (!validateStudentInfo()) return;
    } else if ((collectStudentInfo && page === 1) || (!collectStudentInfo && page === 0)) {
      if (!validateSection1()) return;
    }
    setPage((p) => p + 1);
  };

  const handlePrev = () => setPage((p) => p - 1);

  const handleSubmit = async () => {
    if (!validateSection2()) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  const isStudentInfoPage = collectStudentInfo && page === 0;
  const isSection1Page = (collectStudentInfo && page === 1) || (!collectStudentInfo && page === 0);
  const isSection2Page = (collectStudentInfo && page === 2) || (!collectStudentInfo && page === 1);
  const isLastPage = isSection2Page;

  return (
    <div className="page-frame pb-10">
      {isStudentInfoPage && (
        <div className="space-y-4">
          <p className="text-sm font-medium px-1 mb-2" style={{ color: "var(--text-muted)" }}>
            설문 진행을 위해 학번과 이름을 입력해 주세요.
          </p>
          <div className="survey-question">
            <div className="survey-question-bar">학번</div>
            <div className="survey-card-head">
              <input
                type="text"
                value={data.studentId ?? ""}
                onChange={(e) => updateData({ studentId: e.target.value })}
                style={{
                  borderColor: errors.studentId ? "#f87171" : "var(--border)",
                  backgroundColor: errors.studentId ? "rgba(254,226,226,0.4)" : "var(--card-bg)",
                }}
                className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--secondary)]"
                placeholder="학번을 입력하세요"
              />
              {errors.studentId && (
                <p className="text-xs mt-1" style={{ color: "#ef4444" }}>학번을 입력하세요</p>
              )}
            </div>
          </div>
          <div className="survey-question">
            <div className="survey-question-bar">이름</div>
            <div className="survey-card-head">
              <input
                type="text"
                value={data.displayName ?? ""}
                onChange={(e) => updateData({ displayName: e.target.value })}
                style={{
                  borderColor: errors.displayName ? "#f87171" : "var(--border)",
                  backgroundColor: errors.displayName ? "rgba(254,226,226,0.4)" : "var(--card-bg)",
                }}
                className="w-full px-4 py-3 border-2 rounded-xl outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--secondary)]"
                placeholder="이름을 입력하세요"
              />
              {errors.displayName && (
                <p className="text-xs mt-1" style={{ color: "#ef4444" }}>이름을 입력하세요</p>
              )}
            </div>
          </div>
        </div>
      )}
      {isSection1Page && (
        <SurveySection1
          data={data}
          onChange={updateData}
          errors={errors}
        />
      )}
      {isSection2Page && (
        <SurveySection2
          data={data}
          onChange={updateData}
          errors={errors}
        />
      )}

      {/* 하단 버튼 영역: 스크린샷처럼 큰 오렌지 버튼 + 아이콘 */}
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        {isLastPage ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3.5 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
              style={{
                borderColor: "var(--secondary)",
                color: "var(--secondary)",
                background: "var(--card-bg)",
              }}
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--primary)" }}
            >
              {submitting ? "제출 중…" : "제출하기"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
