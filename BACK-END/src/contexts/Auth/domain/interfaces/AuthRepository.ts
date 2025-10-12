import { User } from "../entities/User";

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
}
