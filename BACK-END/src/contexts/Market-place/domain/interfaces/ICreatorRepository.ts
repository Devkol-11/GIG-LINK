import { Creator } from "../entities/Creator.js";

export interface ICreatorRepository {
  save(creator: Creator): Promise<Creator>;
  findById(id: string): Promise<Creator | null>;
  findByUserId(userId: string): Promise<Creator | null>;
  findAll(): Promise<Creator[]>;
  delete(id: string): Promise<void>;
}
