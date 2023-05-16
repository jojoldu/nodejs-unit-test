import { CourseTypeKey, getCourseType } from '../../src/business-value/CourseType';

describe('CourseType', () => {
  it('문자열로 Type을 찾는다', () => {
    const key = 'OFFLINE';
    const result = getCourseType(key);

    expect(result).toBe(CourseTypeKey.OFFLINE);
    expect(result.key).toBe('OFFLINE');
    expect(result.display).toBe('오프라인');
  });
});