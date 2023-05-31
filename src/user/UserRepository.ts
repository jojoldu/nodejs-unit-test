import { User } from './User';

export class UserRepository {
  private static database = new Map<number, User>();

  constructor() {
    UserRepository.database.set(1, new User());
  }

  async findById(id: number): Promise<User> {
    return UserRepository.database.get(id);
  }
  async findActiveUser(name: string) {
    return this.findByIdAndIsDeletedAndIsBlocked(name, false, false);
  }

  async findBlockedUser(name: string) {
    return this.findByIdAndIsDeletedAndIsBlocked(name, false);
  }

  async findByIdAndIsDeletedAndIsBlocked(name: string, isBlocked?: boolean, isDeleted?: boolean) {
    console.log(`find user: name=${name}, isBlocked=${isBlocked}, isDeleted=${isDeleted})`);
    return `select * from user where name = ${name} and isBlocked = ${isBlocked} and isDeleted = ${isDeleted}`;
  }
}
