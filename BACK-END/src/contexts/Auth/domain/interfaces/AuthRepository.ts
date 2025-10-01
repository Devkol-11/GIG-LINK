import { User } from "../entities/User";

export interface AuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}
