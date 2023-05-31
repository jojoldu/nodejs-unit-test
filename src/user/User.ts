import { LocalDateTime } from '@js-joda/core';

function generateId(): number {
  return Math.random() * (99999 - 1) + 1;
}
export class User {
  private _id: number;
  private _name: string;
  private _isBlocked: boolean;
  private _isDeleted: boolean;
  private _signedAt: LocalDateTime;
  constructor() {
    this._id = generateId();
  }

  static signup(name: string): User {
    const newUser = new User();
    newUser._name = name;
    newUser._signedAt = LocalDateTime.now();
    newUser._isBlocked = false;
    newUser._isDeleted = false;
    return newUser;
  }
}
