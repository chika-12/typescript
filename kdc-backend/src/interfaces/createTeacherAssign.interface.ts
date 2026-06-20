export type ClassLevel = 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';

export interface CreateTeacherAssign {
  teacher: string;
  subject: string;
  className: ClassLevel;
  term: string;
  arm?: string;
}
