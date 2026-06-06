export interface CreateStudentInput {
  name: string;
  stdClass: 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
  gender: 'male' | 'female';
  dob: string; // DD/MM/YYYY - will be parsed to Date
  parentsContact: {
    name: string;
    phone: string;
    email?: string;
    relationship: 'father' | 'mother' | 'guardian';
  };
}
