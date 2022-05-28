import TestableRepository from './TestableRepository';
import Posts from './Posts';

export default class TestableService {
  constructor(private readonly testableRepository: TestableRepository) {
    this.testableRepository = testableRepository;
  }

  public write(title: string, body: string) {
    return this.testableRepository.write(
      new Posts(title, body, new Date()),
    );
  }
}


