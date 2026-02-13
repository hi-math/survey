export type ScienceAttitudeRow = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10";
export type MatrixValue = "1" | "2" | "3" | "4";

export interface SurveyData {
  /** 구글 로그인 시 설문 맨 앞에서 수집 */
  studentId?: string;
  displayName?: string;
  reason?: string[];
  reasonOther?: string;
  expectation?: string[];
  expectationOther?: string;
  highschool_science?: string[];
  highschool_scienceOther?: string;
  university_courses?: string;
  science_interest?: string;
  science_attitude?: Partial<Record<ScienceAttitudeRow, MatrixValue>>;
}
