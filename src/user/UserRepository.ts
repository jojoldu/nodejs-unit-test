import { Order } from '../order/Order';
import { User } from './User';

export class UserRepository {
  private static database = new Map<number, User>();

  constructor() {
    UserRepository.database.set(1, new User());
  }

  async findById(id: number): Promise<User> {
    return UserRepository.database.get(id);
  }
}
