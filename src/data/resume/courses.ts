export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

// Course entries are added here once confirmed. The resume page hides the
// Courses section while this list is empty.
const courses: Course[] = [];

export default courses;
