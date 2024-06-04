export class Course {
  id: string | null;
  courseYear: string | null;
  courseSemester: string | null;
  courseName: string | null;
  courseCode: string | null;
  courseCredit: string | null;
  courseDescription: string | null;
  courseLearningOutcomes: {
    outcome: string;
    pValues: { [key: string]: number }; // pValues tanımı
  }[] | null;
  courseSyllabus: string | null;
  courseAssesments: {
    type: string;
    score: number;
  }[] | null;
  courseInstructor: string | null;

  constructor(courseYear: string, courseSemester: string, courseName: string, courseCode: string, courseCredit: string, courseDescription: string, courseLearningOutcomes: {
    outcome: string;
    pValues: { [key: string]: number }; 
  }[], courseSyllabus: string, courseAssesments: {
    type: string;
    score: number;
  }[], courseInstructor: string) {
    this.courseYear = courseYear;
    this.courseSemester = courseSemester;
    this.courseName = courseName;
    this.courseCode = courseCode;
    this.courseCredit = courseCredit;
    this.courseDescription = courseDescription;
    this.courseLearningOutcomes = courseLearningOutcomes;
    this.courseSyllabus = courseSyllabus;
    courseAssesments = this.courseAssesments;
    this.courseInstructor = courseInstructor;
  }


  toJSON() {
    return {
      courseYear: this.courseYear,
      courseSemester: this.courseSemester,
      courseName: this.courseName,
      courseCode: this.courseCode,
      courseCredit: this.courseCredit,
      courseDescription: this.courseDescription,
      courseLearningOutcomes: this.courseLearningOutcomes,
      courseSyllabus: this.courseSyllabus,
      courseAssesments: this.courseAssesments,
      courseInstructor: this.courseInstructor
    };
  }
}