export interface TopicLesson {
  name: string;
  lessons: Lessons[];
}

export interface Lessons {
  name: string;
  link: string;
}
