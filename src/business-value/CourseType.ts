export class CourseType {
  private readonly _key: string;
  private readonly _display: string;

  constructor(key: string, display: string) {
    this._key = key;
    this._display = display;
  }

  get key(): string {
    return this._key;
  }

  get display(): string {
    return this._display;
  }
}

export const CourseTypeKey = {
  OFFLINE: new CourseType('OFFLINE', '오프라인'),
  ONLINE: new CourseType('ONLINE', '온라인'),
  MEETUP: new CourseType('MEETUP', '밋업'),
}

export function getCourseType(type: string): CourseType {
  return CourseTypeKey[type]
}