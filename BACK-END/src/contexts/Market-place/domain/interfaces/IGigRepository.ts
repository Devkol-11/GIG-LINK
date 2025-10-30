import { Gig } from "../entities/Gig.js";

export interface IGigRepository {
  save(gig: Gig): Promise<Gig>;
  findById(id: string): Promise<Gig | null>;
  findAll(): Promise<Gig[]>;
  delete(id: string): Promise<void>;
}
