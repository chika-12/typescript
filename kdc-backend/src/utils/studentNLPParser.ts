interface StudentQuery {
  filter: Record<string, any>;
  sort: Record<string, any>;
  count: boolean;
}

const SENIOR_CLASSES = ['SS1', 'SS2', 'SS3'];
const JUNIOR_CLASSES = ['JSS1', 'JSS2', 'JSS3'];
const ALL_CLASSES = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

export const parseStudentQuery = (query: string): StudentQuery => {
  const q = query.toLowerCase().trim();
  const filter: Record<string, any> = {};
  const sort: Record<string, any> = {};
  let count = false;

  if (q.includes('how many')) {
    count = true;
  }

  // Gender
  if (q.includes('boy') || q.includes('male')) {
    filter.gender = 'male';
  } else if (q.includes('girl') || q.includes('female')) {
    filter.gender = 'female';
  }

  // Active status
  if (q.includes('inactive') || q.includes('suspended')) {
    filter.isActive = false;
  } else if (q.includes('active')) {
    filter.isActive = true;
  }

  // Class detection - specific classes first
  const classMatch = q.match(/\b(jss1|jss2|jss3|ss1|ss2|ss3)\b/);
  if (classMatch) {
    filter.class = classMatch[1].toUpperCase();
  } else if (q.includes('junior graduating')) {
    filter.class = 'JSS3';
  } else if (q.includes('graduating')) {
    filter.class = 'SS3';
  } else if (q.includes('senior')) {
    filter.class = { $in: SENIOR_CLASSES };
  } else if (q.includes('junior')) {
    filter.class = { $in: JUNIOR_CLASSES };
  }

  // Name search
  const nameMatch = q.match(/named?\s+([a-z]+)/);
  if (nameMatch) {
    filter.name = { $regex: nameMatch[1], $options: 'i' };
  }

  // Sort
  if (q.includes('youngest') || q.includes('young student')) {
    sort.dob = -1;
  } else if (q.includes('oldest')) {
    sort.dob = 1;
  } else if (q.includes('recently added') || q.includes('new student')) {
    sort.createdAt = -1;
  }

  return { filter, sort, count };
};
