export class Course {
    courseYear: string | null;
    courseSemester: string | null;
    courseName: string | null;
    courseCode: string | null;
    courseCredit: string | null;
    courseDescription: string | null;
    courseLearningOutcomes: string | null;
    courseAssessments: string | null;
    courseInstructor: string | null;

    constructor(courseYear: string, courseSemester: string, courseName: string, courseCode: string, courseCredit: string, courseDescription: string, courseLearningOutcomes: string, courseAssessments: string, courseInstructor: string) {
        this.courseYear = courseYear;
        this.courseSemester = courseSemester;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.courseCredit = courseCredit;
        this.courseDescription = courseDescription;
        this.courseLearningOutcomes = courseLearningOutcomes;
        this.courseAssessments = courseAssessments;
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
          courseAssessments: this.courseAssessments,
          courseInstructor: this.courseInstructor
        };
      }
}